import { LogClient, type QuickAddFood, type TodayEntryRow } from "@/components/log/LogClient";
import { db } from "@/lib/db";
import { getTodayRange } from "@/lib/dates";
import { MEAL_FROM_PRISMA } from "@/lib/enumMap";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LogPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { start, end } = getTodayRange();

  const [entries, favourites, recentEntries] = user
    ? await Promise.all([
        db.mealEntry.findMany({
          where: { userId: user.id, loggedAt: { gte: start, lte: end } },
          include: { food: true },
          orderBy: { loggedAt: "asc" },
        }),
        db.favourite.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          include: { food: true },
        }),
        db.mealEntry.findMany({
          where: { userId: user.id },
          distinct: ["foodId"],
          orderBy: { loggedAt: "desc" },
          take: 8,
          include: { food: true },
        }),
      ])
    : [[], [], []];

  const todayEntries: TodayEntryRow[] = entries.map((e: (typeof entries)[number]) => {
    const scale = e.servingUnitG / 100;
    return {
      id: e.id,
      mealType: MEAL_FROM_PRISMA[e.mealType],
      foodName: e.food.name,
      servingGrams: e.servingUnitG,
      calories: e.food.caloriesPer100g * scale,
      proteinG: e.food.proteinPer100g * scale,
      carbsG: e.food.carbsPer100g * scale,
      fatG: e.food.fatPer100g * scale,
    };
  });

  const favouritedFoodIds = new Set(favourites.map((f: (typeof favourites)[number]) => f.foodId));

  function toQuickAdd(food: {
    id: string;
    name: string;
    brand: string | null;
    servingSizeG: number | null;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
  }): QuickAddFood {
    return {
      foodId: food.id,
      name: food.name,
      brand: food.brand ?? undefined,
      servingSizeG: food.servingSizeG ?? undefined,
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
      isFavourite: favouritedFoodIds.has(food.id),
    };
  }

  const favouriteFoods: QuickAddFood[] = favourites.map((f: (typeof favourites)[number]) =>
    toQuickAdd(f.food)
  );
  const recentFoods: QuickAddFood[] = recentEntries
    .map((e: (typeof recentEntries)[number]) => toQuickAdd(e.food))
    .filter((f: QuickAddFood) => !favouritedFoodIds.has(f.foodId));

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Log a meal</h1>
        <p className="text-sm text-text-tertiary">Search Open Food Facts and add it to today.</p>
      </header>
      <LogClient todayEntries={todayEntries} favouriteFoods={favouriteFoods} recentFoods={recentFoods} />
    </main>
  );
}
