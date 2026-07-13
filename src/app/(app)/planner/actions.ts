"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { MEAL_TO_PRISMA } from "@/lib/enumMap";
import { upsertFoodItem } from "@/lib/foodSearch";
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

interface AddPlannedFoodInput {
  date: string; // "YYYY-MM-DD"
  mealType: MealType;
  food: FoodItem;
  servingGrams: number;
}

export async function addPlannedFoodAction(input: AddPlannedFoodInput) {
  const userId = await requireUserId();
  if (!Number.isFinite(input.servingGrams) || input.servingGrams <= 0) {
    throw new Error("Enter a valid serving amount");
  }

  const dbFood = await upsertFoodItem(input.food);

  await db.plannedMeal.create({
    data: {
      userId,
      date: new Date(`${input.date}T00:00:00.000Z`),
      mealType: MEAL_TO_PRISMA[input.mealType],
      foodId: dbFood.id,
      servingGrams: input.servingGrams,
    },
  });

  revalidatePath("/planner");
}

interface AddPlannedRecipeInput {
  date: string;
  mealType: MealType;
  recipeId: string;
  servingsCount: number;
}

export async function addPlannedRecipeAction(input: AddPlannedRecipeInput) {
  const userId = await requireUserId();
  if (!Number.isFinite(input.servingsCount) || input.servingsCount <= 0) {
    throw new Error("Enter a valid number of servings");
  }

  await db.plannedMeal.create({
    data: {
      userId,
      date: new Date(`${input.date}T00:00:00.000Z`),
      mealType: MEAL_TO_PRISMA[input.mealType],
      recipeId: input.recipeId,
      servingsCount: input.servingsCount,
    },
  });

  revalidatePath("/planner");
}

export async function deletePlannedMealAction(id: string) {
  const userId = await requireUserId();
  await db.plannedMeal.deleteMany({ where: { id, userId } });
  revalidatePath("/planner");
}

/** Converts a planned meal into a real logged entry (now), then removes it from the plan. */
export async function markPlannedMealEatenAction(id: string) {
  const userId = await requireUserId();

  const planned = await db.plannedMeal.findFirst({ where: { id, userId } });
  if (!planned) throw new Error("Planned meal not found");

  if (planned.foodId && planned.servingGrams) {
    await db.mealEntry.create({
      data: {
        userId,
        foodId: planned.foodId,
        mealType: planned.mealType,
        servingQuantity: 1,
        servingUnitG: planned.servingGrams,
      },
    });
  } else if (planned.recipeId && planned.servingsCount) {
    const recipe = await db.recipe.findFirst({
      where: { id: planned.recipeId, userId },
      include: { items: true },
    });
    if (!recipe) throw new Error("Recipe not found");
    const scale = planned.servingsCount / recipe.servings;
    await db.mealEntry.createMany({
      data: recipe.items.map((item: (typeof recipe.items)[number]) => ({
        userId,
        foodId: item.foodId,
        mealType: planned.mealType,
        servingQuantity: 1,
        servingUnitG: item.grams * scale,
      })),
    });
  } else {
    throw new Error("Planned meal is missing its food or recipe details");
  }

  await db.plannedMeal.delete({ where: { id: planned.id } });

  revalidatePath("/planner");
  revalidatePath("/log");
  revalidatePath("/dashboard");
}
