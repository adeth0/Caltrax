import { FoodsTabs } from "@/components/food/FoodsTabs";
import type { RecipeSummary } from "@/components/recipes/RecipesClient";
import type { CuratedRecipeSummary } from "@/components/recipes/FindMealsClient";
import { db } from "@/lib/db";
import { averageRating, computeRecipeNutritionPerServing } from "@/lib/recipeNutrition";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RecipeWithItemsAndRatings = {
  id: string;
  name: string;
  description: string | null;
  category: CuratedRecipeSummary["category"];
  imageUrl: string | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  servings: number;
  items: {
    grams: number;
    food: { caloriesPer100g: number; proteinPer100g: number; carbsPer100g: number; fatPer100g: number };
  }[];
  ratings: { stars: number }[];
  user?: { name: string | null } | null;
};

function toCuratedSummary(r: RecipeWithItemsAndRatings): CuratedRecipeSummary {
  const perServing = computeRecipeNutritionPerServing(r.items, r.servings);
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    imageUrl: r.imageUrl,
    prepMinutes: r.prepMinutes,
    cookMinutes: r.cookMinutes,
    caloriesPerServing: Math.round(perServing.calories),
    averageRating: averageRating(r.ratings),
    ratingCount: r.ratings.length,
    creatorName: r.user?.name,
  };
}

export default async function FoodsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [myRecipes, curatedRecipes, communityRecipes, savedRecipeLinks] = await Promise.all([
    user
      ? db.recipe.findMany({
          where: { userId: user.id, source: "USER" },
          orderBy: { createdAt: "desc" },
          include: { items: { include: { food: true } } },
        })
      : Promise.resolve([]),
    db.recipe.findMany({
      where: { source: "CURATED" },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { food: true } }, ratings: true },
    }),
    db.recipe.findMany({
      where: { source: "USER", isPublished: true },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { food: true } }, ratings: true, user: { select: { name: true } } },
    }),
    user
      ? db.savedRecipe.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          include: { recipe: { include: { items: { include: { food: true } }, ratings: true } } },
        })
      : Promise.resolve([]),
  ]);

  const recipeSummaries: RecipeSummary[] = myRecipes.map((r: (typeof myRecipes)[number]) => {
    const perServing = computeRecipeNutritionPerServing(r.items, r.servings);
    return {
      id: r.id,
      name: r.name,
      servings: r.servings,
      ingredientCount: r.items.length,
      caloriesPerServing: perServing.calories,
      proteinPerServing: perServing.proteinG,
      carbsPerServing: perServing.carbsG,
      fatPerServing: perServing.fatG,
    };
  });

  const curatedSummaries: CuratedRecipeSummary[] = curatedRecipes.map((r: (typeof curatedRecipes)[number]) =>
    toCuratedSummary(r)
  );

  const communitySummaries: CuratedRecipeSummary[] = communityRecipes.map(
    (r: (typeof communityRecipes)[number]) => toCuratedSummary(r)
  );

  const savedSummaries: CuratedRecipeSummary[] = savedRecipeLinks.map(
    (s: (typeof savedRecipeLinks)[number]) => toCuratedSummary(s.recipe)
  );

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:max-w-4xl">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">Foods</h1>
        <p className="text-sm text-text-tertiary">
          Search Open Food Facts, find pre-made meals, or build your own recipes.
        </p>
      </header>

      <FoodsTabs
        recipes={recipeSummaries}
        curatedRecipes={curatedSummaries}
        communityRecipes={communitySummaries}
        savedRecipes={savedSummaries}
      />
    </main>
  );
}
