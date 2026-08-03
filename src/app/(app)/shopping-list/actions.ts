"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

async function addRecipeIngredientsToList(userId: string, recipeId: string): Promise<number> {
  const recipe = await db.recipe.findFirst({
    where: {
      id: recipeId,
      OR: [{ userId }, { source: "CURATED" }, { source: "USER", isPublished: true }],
    },
    include: { items: { include: { food: true } } },
  });
  if (!recipe) return 0;

  await db.shoppingListItem.createMany({
    data: recipe.items.map((item: (typeof recipe.items)[number]) => ({
      userId,
      label: item.displayLabel ?? `${item.food.name}, ${Math.round(item.grams)}g`,
      recipeName: recipe.name,
    })),
  });

  return recipe.items.length;
}

/**
 * Appends a recipe's ingredients to the shopping list -- doesn't attempt
 * to merge quantities with anything already on the list (ingredient
 * amounts are free-text display labels, not a structured quantity+unit
 * that could be safely summed). Adding the same recipe twice, or two
 * recipes sharing an ingredient, just means two list entries -- checking
 * off or deleting a duplicate is simpler and more reliable than getting
 * automatic merging wrong.
 */
export async function addRecipeToShoppingListAction(recipeId: string) {
  const userId = await requireUserId();
  const addedCount = await addRecipeIngredientsToList(userId, recipeId);
  if (addedCount === 0) throw new Error("Recipe not found");

  revalidatePath("/shopping-list");
  return { addedCount };
}

/**
 * Bulk version for the Meal Planner: adds ingredients for every
 * distinct recipe planned across a given 7-day week in one action,
 * rather than requiring a separate tap per planned meal. Plain-food
 * planned meals (no recipeId) are skipped -- a single food has nothing
 * resembling "ingredients" to shop for; the food itself is the item.
 * Recipes planned more than once in the week are only processed once
 * (their ingredients would just duplicate on the list otherwise).
 */
export async function addWeekToShoppingListAction(weekStartDateStr: string): Promise<{
  recipeCount: number;
  itemCount: number;
}> {
  const userId = await requireUserId();
  const weekStart = new Date(`${weekStartDateStr}T00:00:00Z`);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  const plannedMeals = await db.plannedMeal.findMany({
    where: { userId, date: { gte: weekStart, lt: weekEnd }, recipeId: { not: null } },
    select: { recipeId: true },
  });

  const uniqueRecipeIds = [
    ...new Set(plannedMeals.map((m: (typeof plannedMeals)[number]) => m.recipeId as string)),
  ] as string[];

  let itemCount = 0;
  for (const recipeId of uniqueRecipeIds) {
    itemCount += await addRecipeIngredientsToList(userId, recipeId);
  }

  revalidatePath("/shopping-list");
  return { recipeCount: uniqueRecipeIds.length, itemCount };
}

export async function addManualShoppingItemAction(label: string) {
  const userId = await requireUserId();
  const trimmed = label.trim();
  if (!trimmed) throw new Error("Enter an item to add");

  await db.shoppingListItem.create({ data: { userId, label: trimmed } });
  revalidatePath("/shopping-list");
}

export async function toggleShoppingItemAction(itemId: string) {
  const userId = await requireUserId();
  const item = await db.shoppingListItem.findFirst({ where: { id: itemId, userId } });
  if (!item) return;

  await db.shoppingListItem.update({ where: { id: itemId }, data: { checked: !item.checked } });
  revalidatePath("/shopping-list");
}

export async function deleteShoppingItemAction(itemId: string) {
  const userId = await requireUserId();
  await db.shoppingListItem.deleteMany({ where: { id: itemId, userId } });
  revalidatePath("/shopping-list");
}

export async function clearCheckedItemsAction() {
  const userId = await requireUserId();
  await db.shoppingListItem.deleteMany({ where: { userId, checked: true } });
  revalidatePath("/shopping-list");
}
