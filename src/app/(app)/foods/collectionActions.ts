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

export async function createRecipeCollectionAction(name: string) {
  const userId = await requireUserId();
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Enter a name for this collection");

  await db.recipeCollection.create({ data: { userId, name: trimmedName } });
  revalidatePath("/foods");
}

export async function deleteRecipeCollectionAction(collectionId: string) {
  const userId = await requireUserId();
  await db.recipeCollection.deleteMany({ where: { id: collectionId, userId } });
  revalidatePath("/foods");
}

/**
 * Toggles a recipe's membership in a collection -- adds it if not
 * already there, removes it if it is. A recipe can belong to any
 * number of collections; this doesn't affect saving, ownership, or
 * publishing, purely organisational.
 */
export async function toggleRecipeInCollectionAction(collectionId: string, recipeId: string) {
  const userId = await requireUserId();

  // Scope through the collection's owner -- RecipeCollectionItem itself
  // has no userId column.
  const collection = await db.recipeCollection.findFirst({ where: { id: collectionId, userId } });
  if (!collection) throw new Error("Collection not found");

  const existing = await db.recipeCollectionItem.findUnique({
    where: { collectionId_recipeId: { collectionId, recipeId } },
  });

  if (existing) {
    await db.recipeCollectionItem.delete({ where: { id: existing.id } });
  } else {
    await db.recipeCollectionItem.create({ data: { collectionId, recipeId } });
  }

  revalidatePath("/foods");
  revalidatePath(`/foods/recipes/${recipeId}`);
  return { added: !existing };
}
