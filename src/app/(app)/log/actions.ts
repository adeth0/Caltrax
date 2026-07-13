"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { FOOD_SOURCE_TO_PRISMA, MEAL_TO_PRISMA } from "@/lib/enumMap";
import { lookupBarcode, searchOpenFoodFacts, upsertFoodItem } from "@/lib/foodSearch";
import { recognizeMealPhoto, type MealRecognitionResult } from "@/lib/ai/mealRecognition";
import { AIConfigError } from "@/lib/ai/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FoodItem, MealType } from "@/types";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export async function searchFoodsAction(query: string): Promise<FoodItem[]> {
  await requireUserId();
  return searchOpenFoodFacts(query);
}

export async function lookupBarcodeAction(barcode: string): Promise<FoodItem | null> {
  await requireUserId();
  return lookupBarcode(barcode);
}

interface LogMealParams {
  food: FoodItem;
  mealType: MealType;
  /** Grams of this food actually eaten (already scaled by quantity × serving size on the client). */
  servingGrams: number;
}

/** Caches the food (if new) then writes a MealEntry for today. */
export async function logMealAction({ food, mealType, servingGrams }: LogMealParams) {
  const userId = await requireUserId();

  if (!Number.isFinite(servingGrams) || servingGrams <= 0) {
    throw new Error("Enter a valid serving amount");
  }

  const dbFood = await upsertFoodItem(food);

  await db.mealEntry.create({
    data: {
      userId,
      foodId: dbFood.id,
      mealType: MEAL_TO_PRISMA[mealType],
      servingQuantity: 1,
      servingUnitG: servingGrams,
    },
  });

  revalidatePath("/log");
  revalidatePath("/dashboard");
}

/** Quick-add for an already-cached Food row (favourites/recent chips, recipe items) — no re-upsert needed. */
export async function logCachedFoodAction(foodId: string, mealType: MealType, servingGrams: number) {
  const userId = await requireUserId();

  if (!Number.isFinite(servingGrams) || servingGrams <= 0) {
    throw new Error("Enter a valid serving amount");
  }

  await db.mealEntry.create({
    data: {
      userId,
      foodId,
      mealType: MEAL_TO_PRISMA[mealType],
      servingQuantity: 1,
      servingUnitG: servingGrams,
    },
  });

  revalidatePath("/log");
  revalidatePath("/dashboard");
}

export async function deleteMealEntryAction(entryId: string) {
  const userId = await requireUserId();
  await db.mealEntry.deleteMany({ where: { id: entryId, userId } });
  revalidatePath("/log");
  revalidatePath("/dashboard");
}

/** Sends a downscaled photo to Claude and returns its structured meal-item guesses. */
export async function recognizeMealPhotoAction(
  imageBase64: string,
  mediaType: string
): Promise<MealRecognitionResult> {
  await requireUserId();
  try {
    return await recognizeMealPhoto(imageBase64, mediaType);
  } catch (err) {
    if (err instanceof AIConfigError) throw err;
    throw new Error("Couldn't analyze that photo — try again, or add the meal manually.");
  }
}

interface CustomFoodInput {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  servingGrams: number;
  mealType: MealType;
}

/**
 * Logs a one-off food that isn't in Open Food Facts — used for the AI photo
 * flow and manual "not found" entries. Each gets its own Food row (source:
 * CUSTOM, a fresh sourceId) rather than being deduped, since these are
 * per-user estimates rather than a shared catalog item.
 */
export async function logCustomFoodAction(input: CustomFoodInput) {
  const userId = await requireUserId();

  if (!Number.isFinite(input.servingGrams) || input.servingGrams <= 0) {
    throw new Error("Enter a valid serving amount");
  }
  if (!input.name.trim()) {
    throw new Error("Enter a food name");
  }

  const dbFood = await db.food.create({
    data: {
      source: FOOD_SOURCE_TO_PRISMA.custom,
      sourceId: crypto.randomUUID(),
      name: input.name.trim(),
      caloriesPer100g: input.caloriesPer100g,
      proteinPer100g: input.proteinPer100g,
      carbsPer100g: input.carbsPer100g,
      fatPer100g: input.fatPer100g,
    },
  });

  await db.mealEntry.create({
    data: {
      userId,
      foodId: dbFood.id,
      mealType: MEAL_TO_PRISMA[input.mealType],
      servingQuantity: 1,
      servingUnitG: input.servingGrams,
    },
  });

  revalidatePath("/log");
  revalidatePath("/dashboard");
}

/** Toggles favourite status for a food, caching it first if it isn't already saved. */
export async function toggleFavouriteAction(food: FoodItem): Promise<{ favourited: boolean }> {
  const userId = await requireUserId();
  const dbFood = await upsertFoodItem(food);

  const existing = await db.favourite.findUnique({
    where: { userId_foodId: { userId, foodId: dbFood.id } },
  });

  if (existing) {
    await db.favourite.delete({ where: { id: existing.id } });
    revalidatePath("/log");
    return { favourited: false };
  }

  await db.favourite.create({ data: { userId, foodId: dbFood.id } });
  revalidatePath("/log");
  return { favourited: true };
}

export async function removeFavouriteByFoodIdAction(foodId: string) {
  const userId = await requireUserId();
  await db.favourite.deleteMany({ where: { userId, foodId } });
  revalidatePath("/log");
}

export async function addFavouriteByFoodIdAction(foodId: string) {
  const userId = await requireUserId();
  await db.favourite.upsert({
    where: { userId_foodId: { userId, foodId } },
    create: { userId, foodId },
    update: {},
  });
  revalidatePath("/log");
}
