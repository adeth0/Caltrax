import { format } from "date-fns";
import { redirect } from "next/navigation";
import { ProgressTabs } from "@/components/progress/ProgressTabs";
import type { WeightPointRow } from "@/components/progress/ProgressClient";
import type { UnlockedInfo } from "@/components/progress/AchievementsGrid";
import { db } from "@/lib/db";
import { getTodayRange } from "@/lib/dates";
import { profileToGoalInput, SEX_FROM_PRISMA } from "@/lib/enumMap";
import { calculateGoals } from "@/lib/goalEngine";
import { addFoodMicronutrients, emptyIntake } from "@/lib/micronutrients";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProgressPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await db.profile.findUnique({ where: { id: user.id } });
  if (!profile) redirect("/onboarding");

  const { start, end } = getTodayRange();

  const [weightLogs, waterLogs, todayMealEntries, unlockedAchievements] = await Promise.all([
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
    db.unlockedAchievement.findMany({ where: { userId: user.id }, orderBy: { unlockedAt: "asc" } }),
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

  const unlockedInfo: UnlockedInfo[] = unlockedAchievements.map(
    (u: (typeof unlockedAchievements)[number]) => ({
      key: u.key,
      unlockedAt: format(u.unlockedAt, "d MMM yyyy"),
    })
  );

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Progress</h1>
        <p className="text-sm text-text-tertiary">Trends, reports, and achievements.</p>
      </header>
      <ProgressTabs
        weightPoints={weightPoints}
        goalWeightKg={profile.targetWeightKg ?? undefined}
        waterConsumedMl={waterConsumedMl}
        waterTargetMl={profile.dailyWaterGoalMl ?? targets.waterMl}
        micronutrientIntake={micronutrientIntake}
        sex={SEX_FROM_PRISMA[profile.sex]}
        hasLoggedToday={todayMealEntries.length > 0}
        unlockedAchievements={unlockedInfo}
      />
    </main>
  );
}
