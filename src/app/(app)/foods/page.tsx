import { FoodsTabs } from "@/components/food/FoodsTabs";
import type { RecipeSummary } from "@/components/recipes/RecipesClient";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function FoodsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const recipes = user
    ? await db.recipe.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: { items: { include: { food: true } } },
      })
    : [];

  const recipeSummaries: RecipeSummary[] = recipes.map((r: (typeof recipes)[number]) => {
    const totals = r.items.reduce(
      (
        acc: { calories: number; protein: number; carbs: number; fat: number },
        item: (typeof r.items)[number]
      ) => {
        const scale = item.grams / 100;
        acc.calories += item.food.caloriesPer100g * scale;
        acc.protein += item.food.proteinPer100g * scale;
        acc.carbs += item.food.carbsPer100g * scale;
        acc.fat += item.food.fatPer100g * scale;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      id: r.id,
      name: r.name,
      servings: r.servings,
      ingredientCount: r.items.length,
      caloriesPerServing: totals.calories / r.servings,
      proteinPerServing: totals.protein / r.servings,
      carbsPerServing: totals.carbs / r.servings,
      fatPerServing: totals.fat / r.servings,
    };
  });

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Foods</h1>
        <p className="text-sm text-text-tertiary">Search Open Food Facts, or build your own recipes.</p>
      </header>

      <FoodsTabs recipes={recipeSummaries} />
    </main>
  );
}
