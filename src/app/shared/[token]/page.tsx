import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { db } from "@/lib/db";
import { getTodayRange } from "@/lib/dates";
import { MEAL_FROM_PRISMA } from "@/lib/enumMap";

export const dynamic = "force-dynamic";

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack"] as const;
const MEAL_LABELS: Record<(typeof MEAL_ORDER)[number], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export default async function SharedDiaryPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const share = await db.diaryShare.findUnique({
    where: { token },
    include: { user: { select: { name: true } } },
  });

  if (!share) {
    notFound();
  }

  const { start, end } = getTodayRange();
  const entries = await db.mealEntry.findMany({
    where: { userId: share.userId, loggedAt: { gte: start, lte: end } },
    include: { food: true },
    orderBy: { loggedAt: "asc" },
  });

  const totals = entries.reduce(
    (
      acc: { calories: number; proteinG: number; carbsG: number; fatG: number },
      e: (typeof entries)[number]
    ) => {
      const scale = e.servingUnitG / 100;
      acc.calories += e.food.caloriesPer100g * scale;
      acc.proteinG += e.food.proteinPer100g * scale;
      acc.carbsG += e.food.carbsPer100g * scale;
      acc.fatG += e.food.fatPer100g * scale;
      return acc;
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  const grouped = MEAL_ORDER.map((meal) => ({
    meal,
    label: MEAL_LABELS[meal],
    entries: entries.filter((e: (typeof entries)[number]) => MEAL_FROM_PRISMA[e.mealType] === meal),
  }));

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-base p-4 sm:p-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          {share.user.name ? `${share.user.name}'s diary` : "Shared diary"}
        </h1>
        <p className="text-sm text-text-tertiary">Today — read-only, shared via a link</p>
      </header>

      <Card className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Today&apos;s totals
        </p>
        <p className="mt-2 font-display text-3xl font-bold tabular-nums text-text-primary">
          {Math.round(totals.calories)} <span className="text-sm font-medium text-text-secondary">kcal</span>
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-semibold text-text-primary">{Math.round(totals.proteinG)}g</p>
            <p className="text-xs text-text-tertiary">Protein</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">{Math.round(totals.carbsG)}g</p>
            <p className="text-xs text-text-tertiary">Carbs</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">{Math.round(totals.fatG)}g</p>
            <p className="text-xs text-text-tertiary">Fat</p>
          </div>
        </div>
      </Card>

      {entries.length === 0 ? (
        <p className="text-sm text-text-tertiary">Nothing logged yet today.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {grouped
            .filter((g) => g.entries.length > 0)
            .map((g) => (
              <Card key={g.meal}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  {g.label}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {g.entries.map((e: (typeof entries)[number]) => {
                    const scale = e.servingUnitG / 100;
                    return (
                      <li key={e.id} className="flex justify-between text-sm">
                        <span className="text-text-secondary">{e.food.name}</span>
                        <span className="text-text-tertiary">
                          {Math.round(e.food.caloriesPer100g * scale)} kcal
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-text-tertiary">Shared via Caltrax</p>
    </main>
  );
}
