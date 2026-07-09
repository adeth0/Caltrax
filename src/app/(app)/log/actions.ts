"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { FOOD_SOURCE_TO_PRISMA, MEAL_TO_PRISMA } from "@/lib/enumMap";
import { lookupBarcode, searchOpenFoodFacts } from "@/lib/foodSearch";
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

  const source = FOOD_SOURCE_TO_PRISMA[food.source];

  const dbFood = await db.food.upsert({
    where: { source_sourceId: { source, sourceId: food.sourceId } },
    create: {
      source,
      sourceId: food.sourceId,
      name: food.name,
      brand: food.brand,
      barcode: food.barcode,
      servingSizeG: food.servingSizeG,
      servingSizeLabel: food.servingSizeLabel,
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
      fibrePer100g: food.fibrePer100g,
      sugarPer100g: food.sugarPer100g,
      sodiumMgPer100g: food.sodiumMgPer100g,
      imageUrl: food.imageUrl,
    },
    update: {
      name: food.name,
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
    },
  });

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
