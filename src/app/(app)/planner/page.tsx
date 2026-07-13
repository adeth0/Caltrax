import { addDays, format, startOfDay } from "date-fns";
import { PlannerClient, type PlannedMealRow, type RecipeOption } from "@/components/planner/PlannerClient";
import { db } from "@/lib/db";
import { MEAL_FROM_PRISMA } from "@/lib/enumMap";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface PlannerPageProps {
  searchParams: Promise<{ start?: string }>;
}

export default async function PlannerPage({ searchParams }: PlannerPageProps) {
  const { start: startParam } = await searchParams;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const weekStart = startParam ? startOfDay(new Date(`${startParam}T00:00:00`)) : startOfDay(new Date());
  const weekEnd = addDays(weekStart, 6);

  const [plannedMeals, recipes] = user
    ? await Promise.all([
        db.plannedMeal.findMany({
          where: { userId: user.id, date: { gte: weekStart, lte: weekEnd } },
          include: { food: true, recipe: true },
          orderBy: { createdAt: "asc" },
        }),
        db.recipe.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
      ])
    : [[], []];

  const plannedRows: PlannedMealRow[] = plannedMeals.map((p: (typeof plannedMeals)[number]) => {
    if (p.food && p.servingGrams) {
      const scale = p.servingGrams / 100;
      return {
        id: p.id,
        date: format(p.date, "yyyy-MM-dd"),
        mealType: MEAL_FROM_PRISMA[p.mealType],
        label: p.food.name,
        detail: `${Math.round(p.servingGrams)}g`,
        calories: Math.round(p.food.caloriesPer100g * scale),
      };
    }
    if (p.recipe && p.servingsCount) {
      return {
        id: p.id,
        date: format(p.date, "yyyy-MM-dd"),
        mealType: MEAL_FROM_PRISMA[p.mealType],
        label: p.recipe.name,
        detail: `${p.servingsCount} serving${p.servingsCount === 1 ? "" : "s"}`,
        calories: null,
      };
    }
    return {
      id: p.id,
      date: format(p.date, "yyyy-MM-dd"),
      mealType: MEAL_FROM_PRISMA[p.mealType],
      label: "Planned meal",
      detail: "",
      calories: null,
    };
  });

  const recipeOptions: RecipeOption[] = recipes.map((r: (typeof recipes)[number]) => ({
    id: r.id,
    name: r.name,
    servings: r.servings,
  }));

  const days = Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), "yyyy-MM-dd"));

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Meal planner</h1>
        <p className="text-sm text-text-tertiary">Plan ahead, then mark meals eaten when you have them.</p>
      </header>
      <PlannerClient days={days} plannedMeals={plannedRows} recipes={recipeOptions} />
    </main>
  );
}
