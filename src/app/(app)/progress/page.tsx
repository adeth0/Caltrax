import { format } from "date-fns";
import { InsightsCard } from "@/components/progress/InsightsCard";
import { MicronutrientsCard } from "@/components/progress/MicronutrientsCard";
import { ProgressClient, type WeightPointRow } from "@/components/progress/ProgressClient";
import { db } from "@/lib/db";
import { getTodayRange } from "@/lib/dates";
import { profileToGoalInput, SEX_FROM_PRISMA } from "@/lib/enumMap";
import { calculateGoals } from "@/lib/goalEngine";
import { addFoodMicronutrients, emptyIntake } from "@/lib/micronutrients";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProgressPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await db.profile.findUnique({ where: { id: user.id } });
  if (!profile) redirect("/onboarding");

  const { start, end } = getTodayRange();

  const [weightLogs, waterLogs, todayMealEntries] = await Promise.all([
    db.weightLog.findMany({
      where: { userId: user.id },
      orderBy: { loggedAt: "asc" },
      take: 60,
    }),
    db.waterLog.findMany({ where: { userId: user.id, loggedAt: { gte: start, lte: end } } }),
    db.mealEntry.findMany({
      where: { userId: user.id, loggedAt: { gte: start, lte: end } },
      include: { food: true },
    }),
  ]);

  const weightPoints: WeightPointRow[] = weightLogs.map((w: (typeof weightLogs)[number]) => ({
    id: w.id,
    date: format(w.loggedAt, "d MMM"),
    weightKg: w.weightKg,
  }));

  const waterConsumedMl = waterLogs.reduce((sum, w: (typeof waterLogs)[number]) => sum + w.amountMl, 0);
  const { targets } = calculateGoals(profileToGoalInput(profile));

  const micronutrientIntake = todayMealEntries.reduce(
    (intake: ReturnType<typeof emptyIntake>, entry: (typeof todayMealEntries)[number]) =>
      addFoodMicronutrients(intake, entry.food, entry.servingUnitG),
    emptyIntake()
  );

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Progress</h1>
        <p className="text-sm text-text-tertiary">Weight trend and hydration history.</p>
      </header>
      <div className="mb-4">
        <InsightsCard />
      </div>
      <ProgressClient
        weightPoints={weightPoints}
        goalWeightKg={profile.targetWeightKg ?? undefined}
        waterConsumedMl={waterConsumedMl}
        waterTargetMl={profile.dailyWaterGoalMl ?? targets.waterMl}
      />
      <div className="mt-4">
        <MicronutrientsCard
          intake={micronutrientIntake}
          sex={SEX_FROM_PRISMA[profile.sex]}
          hasLoggedToday={todayMealEntries.length > 0}
        />
      </div>
    </main>
  );
}
