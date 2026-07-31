import { format } from "date-fns";
import { redirect } from "next/navigation";
import { ProgressTabs } from "@/components/progress/ProgressTabs";
import type { WeightPointRow } from "@/components/progress/ProgressClient";
import type { UnlockedInfo } from "@/components/progress/AchievementsGrid";
import type { LoggedExerciseOption, WorkoutSessionRow } from "@/components/progress/WorkoutHistoryClient";
import type { LatestMeasurement } from "@/components/progress/MeasurementsCard";
import { db, withPreparedStatementRetry } from "@/lib/db";
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

  const profile = await withPreparedStatementRetry(() => db.profile.findUnique({ where: { id: user.id } }));
  if (!profile) redirect("/onboarding");

  const { start, end } = getTodayRange();

  const [weightLogs, waterLogs, todayMealEntries, unlockedAchievements, workouts, recentMeasurements] =
    await Promise.all([
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
      db.workout.findMany({
        where: { userId: user.id },
        orderBy: { loggedAt: "desc" },
        take: 30,
        include: { sets: { include: { exercise: true }, orderBy: { order: "asc" } } },
      }),
      // Ordered newest-first so the "latest per type" derivation below can
      // just take the first occurrence of each type.
      db.bodyMeasurement.findMany({ where: { userId: user.id }, orderBy: { loggedAt: "desc" }, take: 200 }),
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

  const workoutSessions: WorkoutSessionRow[] = workouts.map((w: (typeof workouts)[number]) => ({
    id: w.id,
    date: format(w.loggedAt, "EEE, d MMM"),
    exercises: [
      ...new Map(w.sets.map((s: (typeof w.sets)[number]) => [s.exerciseId, s.exercise.name])).entries(),
    ].map(([exerciseId, exerciseName]) => ({
      exerciseId,
      exerciseName,
      sets: w.sets
        .filter((s: (typeof w.sets)[number]) => s.exerciseId === exerciseId)
        .map((s: (typeof w.sets)[number]) => ({
          setNumber: s.setNumber,
          reps: s.reps,
          weightKg: s.weightKg,
        })),
    })),
  }));

  const loggedExercises: LoggedExerciseOption[] = [
    ...new Map<string, string>(
      workouts.flatMap((w: (typeof workouts)[number]) =>
        w.sets.map((s: (typeof w.sets)[number]) => [s.exerciseId, s.exercise.name] as [string, string])
      )
    ).entries(),
  ].map(([id, name]: [string, string]) => ({ id, name }));

  const latestMeasurements: LatestMeasurement[] = [
    ...new Map(recentMeasurements.map((m: (typeof recentMeasurements)[number]) => [m.type, m])).values(),
  ].map((m: (typeof recentMeasurements)[number]) => ({
    type: m.type,
    valueCm: m.valueCm,
    date: format(m.loggedAt, "d MMM"),
  }));

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:max-w-4xl">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">Progress</h1>
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
        workoutSessions={workoutSessions}
        loggedExercises={loggedExercises}
        latestMeasurements={latestMeasurements}
      />
    </main>
  );
}
