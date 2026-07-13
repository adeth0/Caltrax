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

interface RecipeItemInput {
  food: FoodItem;
  grams: number;
}

interface CreateRecipeInput {
  name: string;
  servings: number;
  items: RecipeItemInput[];
}

export async function createRecipeAction(input: CreateRecipeInput) {
  const userId = await requireUserId();

  if (!input.name.trim()) throw new Error("Enter a recipe name");
  if (!Number.isFinite(input.servings) || input.servings <= 0) {
    throw new Error("Servings must be a positive number");
  }
  if (input.items.length === 0) throw new Error("Add at least one ingredient");

  // Upsert every ingredient's Food row first so we have real foodIds to attach.
  const dbFoods = await Promise.all(input.items.map((item) => upsertFoodItem(item.food)));

  await db.recipe.create({
    data: {
      userId,
      name: input.name.trim(),
      servings: input.servings,
      items: {
        create: input.items.map((item, i) => ({
          foodId: dbFoods[i]!.id,
          grams: item.grams,
        })),
      },
    },
  });

  revalidatePath("/foods");
}

export async function deleteRecipeAction(recipeId: string) {
  const userId = await requireUserId();
  await db.recipe.deleteMany({ where: { id: recipeId, userId } });
  revalidatePath("/foods");
}

/**
 * Logs a recipe as a set of MealEntry rows (one per ingredient), each
 * scaled by (servingsEaten / recipe.servings). There's no single "recipe
 * entry" row — this keeps the existing daily-total math (which just sums
 * MealEntry+Food) working unchanged.
 */
export async function logRecipeAction(recipeId: string, mealType: MealType, servingsEaten: number) {
  const userId = await requireUserId();

  if (!Number.isFinite(servingsEaten) || servingsEaten <= 0) {
    throw new Error("Enter a valid number of servings");
  }

  const recipe = await db.recipe.findFirst({
    where: { id: recipeId, userId },
    include: { items: true },
  });
  if (!recipe) throw new Error("Recipe not found");

  const scale = servingsEaten / recipe.servings;

  await db.mealEntry.createMany({
    data: recipe.items.map((item: (typeof recipe.items)[number]) => ({
      userId,
      foodId: item.foodId,
      mealType: MEAL_TO_PRISMA[mealType],
      servingQuantity: 1,
      servingUnitG: item.grams * scale,
    })),
  });

  revalidatePath("/log");
  revalidatePath("/dashboard");
}
