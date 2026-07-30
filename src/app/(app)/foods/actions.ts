"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { MEAL_TO_PRISMA } from "@/lib/enumMap";
import { upsertFoodItem } from "@/lib/foodSearch";
import { uploadBase64Image } from "@/lib/storage";
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

interface RecipeStepInput {
  content: string;
  durationSeconds?: number;
}

interface CreateRecipeInput {
  name: string;
  description?: string;
  category?: "BREAKFAST" | "BRUNCH" | "LUNCH" | "TEA" | "SNACK";
  servings: number;
  prepMinutes?: number;
  cookMinutes?: number;
  items: RecipeItemInput[];
  steps: RecipeStepInput[];
  isPublished: boolean;
  /** Downscaled photo, same shape as the meal-scan upload flow. */
  imageBase64?: string;
  imageMediaType?: string;
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

  let imageUrl: string | undefined;
  if (input.imageBase64 && input.imageMediaType) {
    try {
      imageUrl = await uploadBase64Image({
        userId,
        base64: input.imageBase64,
        mediaType: input.imageMediaType,
        path: `recipe-photos/${crypto.randomUUID()}.jpg`,
      });
    } catch (err) {
      // The recipe should still get created even if the photo upload
      // fails for some reason -- a missing picture is a much smaller
      // problem than losing everything the person just filled in.
      console.error("createRecipeAction: image upload failed, continuing without it:", err);
    }
  }

  await db.recipe.create({
    data: {
      userId,
      source: "USER",
      isPublished: input.isPublished,
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
      category: input.category,
      servings: input.servings,
      prepMinutes: input.prepMinutes,
      cookMinutes: input.cookMinutes,
      imageUrl,
      items: {
        create: input.items.map((item, i) => ({
          foodId: dbFoods[i]!.id,
          grams: item.grams,
          displayLabel: `${item.food.name}, ${Math.round(item.grams)}g`,
        })),
      },
      steps: {
        create: input.steps
          .filter((step) => step.content.trim())
          .map((step, i) => ({
            order: i + 1,
            content: step.content.trim(),
            durationSeconds: step.durationSeconds,
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
 * MealEntry+Food) working unchanged. Works for both a user's own recipes
 * and curated (userId: null) ones -- curated recipes belong to everyone,
 * so any signed-in user can log from them.
 */
export async function logRecipeAction(recipeId: string, mealType: MealType, servingsEaten: number) {
  const userId = await requireUserId();

  if (!Number.isFinite(servingsEaten) || servingsEaten <= 0) {
    throw new Error("Enter a valid number of servings");
  }

  const recipe = await db.recipe.findFirst({
    where: {
      id: recipeId,
      OR: [{ userId }, { source: "CURATED" }, { source: "USER", isPublished: true }],
    },
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

/** 1-5 stars, one per (user, recipe) -- resubmitting updates the existing rating rather than adding a second one. */
export async function rateRecipeAction(recipeId: string, stars: number) {
  const userId = await requireUserId();
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    throw new Error("Rating must be between 1 and 5 stars");
  }

  const visible = await db.recipe.findFirst({
    where: {
      id: recipeId,
      OR: [{ userId }, { source: "CURATED" }, { source: "USER", isPublished: true }],
    },
    select: { id: true },
  });
  if (!visible) throw new Error("Recipe not found");

  await db.recipeRating.upsert({
    where: { userId_recipeId: { userId, recipeId } },
    create: { userId, recipeId, stars },
    update: { stars },
  });

  revalidatePath("/foods");
  revalidatePath(`/foods/recipes/${recipeId}`);
}

/** Bookmarks a curated recipe into "My Recipes" without copying/owning it. Toggling off removes the bookmark, never the underlying Recipe. */
export async function toggleSaveRecipeAction(recipeId: string) {
  const userId = await requireUserId();

  const existing = await db.savedRecipe.findUnique({ where: { userId_recipeId: { userId, recipeId } } });
  if (existing) {
    await db.savedRecipe.delete({ where: { id: existing.id } });
  } else {
    const visible = await db.recipe.findFirst({
      where: {
        id: recipeId,
        OR: [{ userId }, { source: "CURATED" }, { source: "USER", isPublished: true }],
      },
      select: { id: true },
    });
    if (!visible) throw new Error("Recipe not found");
    await db.savedRecipe.create({ data: { userId, recipeId } });
  }

  revalidatePath("/foods");
  revalidatePath(`/foods/recipes/${recipeId}`);
  return { saved: !existing };
}
