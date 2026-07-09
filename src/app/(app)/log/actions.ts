"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { FOOD_SOURCE_TO_PRISMA, MEAL_TO_PRISMA } from "@/lib/enumMap";
import { searchOpenFoodFacts } from "@/lib/foodSearch";
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
