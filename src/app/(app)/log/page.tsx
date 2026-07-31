import {
  LogClient,
  type MealTemplateOption,
  type QuickAddFood,
  type TodayEntryRow,
} from "@/components/log/LogClient";
import { LogModeToggle } from "@/components/log/LogModeToggle";
import { DiagnosticErrorBoundary } from "@/components/ErrorBoundary";
import type { ExerciseOption, RoutineOption, TodayWorkoutSetRow } from "@/components/log/WorkoutLogClient";
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

  const [entries, favourites, recentEntries, mealTemplates] = user
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
        db.mealTemplate.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          include: { items: { include: { food: true } } },
        }),
      ])
    : [[], [], [], []];

  const [exercises, todaysWorkout, routines] = await Promise.all([
    db.exercise.findMany({ orderBy: { name: "asc" } }),
    user
      ? db.workout.findFirst({
          where: { userId: user.id, loggedAt: { gte: start, lte: end } },
          include: { sets: { include: { exercise: true }, orderBy: { order: "asc" } } },
        })
      : Promise.resolve(null),
    user
      ? db.workoutRoutine.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          include: { exercises: { include: { exercise: true }, orderBy: { order: "asc" } } },
        })
      : Promise.resolve([]),
  ]);

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
      imageUrl: e.food.imageUrl ?? undefined,
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

  const mealTemplateOptions: MealTemplateOption[] = mealTemplates.map((t: (typeof mealTemplates)[number]) => {
    const totalCalories = t.items.reduce(
      (sum: number, item: (typeof t.items)[number]) =>
        sum + item.food.caloriesPer100g * (item.servingGrams / 100),
      0
    );
    return {
      id: t.id,
      name: t.name,
      foodNames: t.items.map((item: (typeof t.items)[number]) => item.food.name),
      totalCalories: Math.round(totalCalories),
    };
  });

  const exerciseOptions: ExerciseOption[] = exercises.map((e: (typeof exercises)[number]) => ({
    id: e.id,
    name: e.name,
    muscleGroup: e.muscleGroup,
    equipment: e.equipment,
  }));

  const todayWorkoutSets: TodayWorkoutSetRow[] = (todaysWorkout?.sets ?? []).map(
    (s: NonNullable<typeof todaysWorkout>["sets"][number]) => ({
      id: s.id,
      exerciseId: s.exerciseId,
      exerciseName: s.exercise.name,
      setNumber: s.setNumber,
      reps: s.reps,
      weightKg: s.weightKg,
    })
  );

  const routineOptions: RoutineOption[] = routines.map((r: (typeof routines)[number]) => ({
    id: r.id,
    name: r.name,
    exercises: r.exercises.map((re: (typeof r.exercises)[number]) => ({
      id: re.exercise.id,
      name: re.exercise.name,
      muscleGroup: re.exercise.muscleGroup,
      equipment: re.exercise.equipment,
    })),
  }));

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:max-w-4xl">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">Log</h1>
        <p className="text-sm text-text-tertiary">Track a meal, or log today&apos;s workout.</p>
      </header>
      <DiagnosticErrorBoundary label="log-page">
        <LogModeToggle
          mealSlot={
            <LogClient
              todayEntries={todayEntries}
              favouriteFoods={favouriteFoods}
              recentFoods={recentFoods}
              mealTemplates={mealTemplateOptions}
            />
          }
          exercises={exerciseOptions}
          todaySets={todayWorkoutSets}
          routines={routineOptions}
        />
      </DiagnosticErrorBoundary>
    </main>
  );
}
