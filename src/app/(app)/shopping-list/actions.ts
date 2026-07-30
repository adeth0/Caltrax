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

  const recipe = await db.recipe.findFirst({
    where: {
      id: recipeId,
      OR: [{ userId }, { source: "CURATED" }, { source: "USER", isPublished: true }],
    },
    include: { items: { include: { food: true } } },
  });
  if (!recipe) throw new Error("Recipe not found");

  await db.shoppingListItem.createMany({
    data: recipe.items.map((item: (typeof recipe.items)[number]) => ({
      userId,
      label: item.displayLabel ?? `${item.food.name}, ${Math.round(item.grams)}g`,
      recipeName: recipe.name,
    })),
  });

  revalidatePath("/shopping-list");
  return { addedCount: recipe.items.length };
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
