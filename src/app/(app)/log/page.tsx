import { LogClient, type TodayEntryRow } from "@/components/log/LogClient";
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

  const entries = user
    ? await db.mealEntry.findMany({
        where: { userId: user.id, loggedAt: { gte: start, lte: end } },
        include: { food: true },
        orderBy: { loggedAt: "asc" },
      })
    : [];

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

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Log a meal</h1>
        <p className="text-sm text-text-tertiary">Search Open Food Facts and add it to today.</p>
      </header>
      <LogClient todayEntries={todayEntries} />
    </main>
  );
}
