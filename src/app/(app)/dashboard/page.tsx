import { format } from "date-fns";
import { redirect } from "next/navigation";
import { CaloriesRemainingCard } from "@/components/dashboard/CaloriesRemainingCard";
import { HydrationCard } from "@/components/dashboard/HydrationCard";
import { MacroRingsCard } from "@/components/dashboard/MacroRingsCard";
import { WeightTrendCard } from "@/components/dashboard/WeightTrendCard";
import { logWaterAction } from "@/app/(app)/progress/actions";
import { db } from "@/lib/db";
import { getLastNDaysRange, getTodayRange } from "@/lib/dates";
import { profileToGoalInput } from "@/lib/enumMap";
import { calculateGoals } from "@/lib/goalEngine";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await db.profile.findUnique({ where: { id: user.id } });
  if (!profile) redirect("/onboarding");

  const { targets } = calculateGoals(profileToGoalInput(profile));
  const { start: todayStart, end: todayEnd } = getTodayRange();
  const { start: weekStart } = getLastNDaysRange(7);

  const [mealEntries, waterLogs, weightLogs] = await Promise.all([
    db.mealEntry.findMany({
      where: { userId: user.id, loggedAt: { gte: todayStart, lte: todayEnd } },
      include: { food: true },
    }),
    db.waterLog.findMany({ where: { userId: user.id, loggedAt: { gte: todayStart, lte: todayEnd } } }),
    db.weightLog.findMany({
      where: { userId: user.id, loggedAt: { gte: weekStart, lte: todayEnd } },
      orderBy: { loggedAt: "asc" },
    }),
  ]);

  const todayIntake = mealEntries.reduce(
    (acc, e: (typeof mealEntries)[number]) => {
      const scale = e.servingUnitG / 100;
      acc.calories += e.food.caloriesPer100g * scale;
      acc.proteinG += e.food.proteinPer100g * scale;
      acc.carbsG += e.food.carbsPer100g * scale;
      acc.fatG += e.food.fatPer100g * scale;
      acc.fibreG += (e.food.fibrePer100g ?? 0) * scale;
      return acc;
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fibreG: 0 }
  );

  const waterMl = waterLogs.reduce((sum, w: (typeof waterLogs)[number]) => sum + w.amountMl, 0);

  const weightPoints =
    weightLogs.length > 0
      ? weightLogs.map((w: (typeof weightLogs)[number]) => ({
          date: format(w.loggedAt, "EEE"),
          weightKg: w.weightKg,
        }))
      : [{ date: format(new Date(), "EEE"), weightKg: profile.weightKg }];

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-4 pb-24 sm:p-6">
      <header className="mb-2">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Today</h1>
        <p className="text-sm text-text-tertiary">{format(new Date(), "EEEE, d MMMM")}</p>
      </header>

      <CaloriesRemainingCard
        target={Math.round(targets.calories)}
        consumed={Math.round(todayIntake.calories)}
        burned={0}
      />

      <MacroRingsCard
        targets={targets}
        consumed={{
          proteinG: Math.round(todayIntake.proteinG),
          carbsG: Math.round(todayIntake.carbsG),
          fatG: Math.round(todayIntake.fatG),
          fibreG: Math.round(todayIntake.fibreG),
        }}
      />

      <HydrationCard
        consumedMl={waterMl}
        targetMl={profile.dailyWaterGoalMl ?? targets.waterMl}
        onAdd={logWaterAction}
      />

      <WeightTrendCard points={weightPoints} goalWeightKg={profile.targetWeightKg ?? undefined} />
    </main>
  );
}
