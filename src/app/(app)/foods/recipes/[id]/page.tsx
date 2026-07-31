import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { averageRating, computeRecipeNutritionPerServing } from "@/lib/recipeNutrition";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RecipeDetailClient } from "./RecipeDetailClient";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const recipe = await db.recipe.findFirst({
    where: {
      id,
      OR: [{ source: "CURATED" }, { userId: user.id }, { source: "USER", isPublished: true }],
    },
    include: {
      items: { include: { food: true } },
      steps: { orderBy: { order: "asc" } },
      ratings: true,
    },
  });
  if (!recipe) notFound();

  const perServing = computeRecipeNutritionPerServing(recipe.items, recipe.servings);
  const avgRating = averageRating(recipe.ratings);
  const myRating =
    recipe.ratings.find((r: (typeof recipe.ratings)[number]) => r.userId === user.id)?.stars ?? null;

  const saved = await db.savedRecipe.findUnique({
    where: { userId_recipeId: { userId: user.id, recipeId: recipe.id } },
    select: { id: true },
  });

  const collections = await db.recipeCollection.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { where: { recipeId: recipe.id }, select: { id: true } } },
  });
  const collectionOptions = collections.map((c: (typeof collections)[number]) => ({
    id: c.id,
    name: c.name,
    containsThisRecipe: c.items.length > 0,
  }));

  return (
    <RecipeDetailClient
      recipe={{
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        category: recipe.category,
        imageUrl: recipe.imageUrl,
        servings: recipe.servings,
        prepMinutes: recipe.prepMinutes,
        cookMinutes: recipe.cookMinutes,
        isCommunityRecipe: recipe.source === "CURATED" || recipe.isPublished,
        canSave: (recipe.source === "CURATED" || recipe.isPublished) && recipe.userId !== user.id,
        ingredients: recipe.items.map((item: (typeof recipe.items)[number]) => ({
          id: item.id,
          label: item.displayLabel ?? `${item.food.name}, ${Math.round(item.grams)}g`,
        })),
        steps: recipe.steps.map((step: (typeof recipe.steps)[number]) => ({
          id: step.id,
          order: step.order,
          content: step.content,
          durationSeconds: step.durationSeconds,
        })),
        caloriesPerServing: Math.round(perServing.calories),
        proteinPerServing: Math.round(perServing.proteinG),
        carbsPerServing: Math.round(perServing.carbsG),
        fatPerServing: Math.round(perServing.fatG),
        averageRating: avgRating,
        ratingCount: recipe.ratings.length,
        myRating,
        isSaved: saved !== null,
      }}
      collections={collectionOptions}
    />
  );
}
