import { format } from "date-fns";
import { redirect } from "next/navigation";
import { CaloriesRemainingCard } from "@/components/dashboard/CaloriesRemainingCard";
import { DateNavigator } from "@/components/dashboard/DateNavigator";
import {
  FastingTimerCard,
  type ActiveFast,
  type CompletedFast,
} from "@/components/dashboard/FastingTimerCard";
import { GettingStartedCard } from "@/components/dashboard/GettingStartedCard";
import { HydrationCard } from "@/components/dashboard/HydrationCard";
import { MacroSplitChart } from "@/components/dashboard/MacroSplitChart";
import { NewAchievementBanner } from "@/components/dashboard/NewAchievementBanner";
import { PendingWearableRedirect } from "@/components/dashboard/PendingWearableRedirect";
import { WeightTrendCard } from "@/components/dashboard/WeightTrendCard";
import { logWaterAction } from "@/app/(app)/progress/actions";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import { getDashboardEngagement } from "@/lib/dashboardTips";
import { db, withPreparedStatementRetry } from "@/lib/db";
import { getDateRange, getLastNDaysRange, getTodayDateString } from "@/lib/dates";
import { profileToGoalInput } from "@/lib/enumMap";
import { calculateGoals } from "@/lib/goalEngine";
import { estimateWorkoutCalories } from "@/lib/workoutCalories";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await withPreparedStatementRetry(() => db.profile.findUnique({ where: { id: user.id } }));
  if (!profile) redirect("/onboarding");

  const { targets } = calculateGoals(profileToGoalInput(profile));

  const { date: dateParam } = await searchParams;
  const todayDateStr = getTodayDateString();
  const viewDateStr = dateParam ?? todayDateStr;
  const isToday = viewDateStr === todayDateStr;

  // "todayStart"/"todayEnd" here mean the VIEWED day, not necessarily
  // the actual calendar today -- kept the same variable names used
  // throughout the rest of this file to avoid a much larger rename,
  // since every nutrition-related query below already read them
  // correctly regardless of which specific day they represent.
  const { start: todayStart, end: todayEnd } = getDateRange(viewDateStr);
  const { start: weekStart } = getLastNDaysRange(7);

  const [
    mealEntries,
    waterLogs,
    weightLogs,
    activityLogs,
    newlyUnlocked,
    engagement,
    todaysWorkoutSetCount,
    openFast,
    recentCompletedFasts,
  ] = await Promise.all([
    db.mealEntry.findMany({
      where: { userId: user.id, loggedAt: { gte: todayStart, lte: todayEnd } },
      include: { food: true },
    }),
    db.waterLog.findMany({ where: { userId: user.id, loggedAt: { gte: todayStart, lte: todayEnd } } }),
    db.weightLog.findMany({
      where: { userId: user.id, loggedAt: { gte: weekStart, lte: todayEnd } },
      orderBy: { loggedAt: "asc" },
    }),
    db.activityLog.findMany({ where: { userId: user.id, date: todayStart } }),
    checkAndUnlockAchievements(user.id),
    getDashboardEngagement(user.id),
    db.workoutSet.count({
      where: { workout: { userId: user.id, loggedAt: { gte: todayStart, lte: todayEnd } } },
    }),
    db.fastingSession.findFirst({ where: { userId: user.id, endedAt: null } }),
    db.fastingSession.findMany({
      where: { userId: user.id, endedAt: { not: null } },
      orderBy: { startedAt: "desc" },
      take: 5,
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

  // Summed across any connected sources — if someone has two trackers
  // reporting the same activity this double-counts, but that's a rare
  // edge case versus the common one (exactly one device) working correctly.
  const wearableCalories = activityLogs.reduce(
    (sum: number, a: (typeof activityLogs)[number]) => sum + (a.activeCalories ?? 0),
    0
  );
  // A rough estimate from manually-logged strength-training sets, since
  // those previously contributed nothing at all to today's calorie
  // picture unless the person also had a connected wearable -- see
  // estimateWorkoutCalories for the (deliberately approximate) method.
  // If BOTH a wearable and manually-logged sets exist for the same
  // session, this double-counts -- an accepted tradeoff for now, same
  // as the existing multi-wearable case above, rather than trying to
  // reconcile two independent, differently-sourced estimates.
  const manualWorkoutCalories = estimateWorkoutCalories(todaysWorkoutSetCount, profile.weightKg);
  const earnedCalories = wearableCalories + manualWorkoutCalories;

  const weightPoints =
    weightLogs.length > 0
      ? weightLogs.map((w: (typeof weightLogs)[number]) => ({
          date: format(w.loggedAt, "EEE"),
          weightKg: w.weightKg,
        }))
      : [{ date: format(new Date(), "EEE"), weightKg: profile.weightKg }];

  const activeFast: ActiveFast | null = openFast
    ? { id: openFast.id, startedAt: openFast.startedAt.toISOString(), targetHours: openFast.targetHours }
    : null;

  const recentFasts: CompletedFast[] = recentCompletedFasts.map(
    (f: (typeof recentCompletedFasts)[number]) => ({
      id: f.id,
      durationHours: Math.round(((f.endedAt as Date).getTime() - f.startedAt.getTime()) / 3600000),
      date: format(f.startedAt, "d MMM"),
    })
  );

  return (
    <main className="p-4 pb-24 sm:p-6 lg:mx-auto lg:max-w-[1400px] lg:pb-6">
      <PendingWearableRedirect />
      <header className="mb-4 flex items-center justify-between lg:mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary lg:text-3xl">Today</h1>
          <p className="text-sm text-text-tertiary">{format(new Date(), "EEEE, d MMMM")}</p>
        </div>
        {engagement.currentStreak >= 2 && (
          <div className="flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1.5 text-sm font-semibold text-text-primary">
            <span aria-hidden>🔥</span>
            {engagement.currentStreak} day streak
          </div>
        )}
      </header>

      {isToday && <NewAchievementBanner achievements={newlyUnlocked} />}
      {isToday && <GettingStartedCard tips={engagement.tips} />}

      <DateNavigator viewDateStr={viewDateStr} />

      {/* Single stacked column below lg; a real two-column desktop layout
          from lg up so a wide monitor shows more at once instead of the
          same mobile-width column floating in empty space. */}
      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:items-start lg:gap-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <CaloriesRemainingCard
            target={Math.round(targets.calories)}
            consumed={Math.round(todayIntake.calories)}
            burned={earnedCalories}
          />
        </div>

        <div className="flex flex-col gap-4">
          <MacroSplitChart
            proteinG={Math.round(todayIntake.proteinG)}
            carbsG={Math.round(todayIntake.carbsG)}
            fatG={Math.round(todayIntake.fatG)}
            proteinTargetG={targets.proteinG}
            carbsTargetG={targets.carbsG}
            fatTargetG={targets.fatG}
          />
          <HydrationCard
            consumedMl={waterMl}
            targetMl={profile.dailyWaterGoalMl ?? targets.waterMl}
            onAdd={logWaterAction}
          />
          {isToday && <FastingTimerCard activeFast={activeFast} recentFasts={recentFasts} />}
          <WeightTrendCard
            points={weightPoints}
            goalWeightKg={profile.targetWeightKg ?? undefined}
            weightUnit={profile.weightUnit === "lbs" ? "lbs" : "kg"}
          />
        </div>
      </div>
    </main>
  );
}
