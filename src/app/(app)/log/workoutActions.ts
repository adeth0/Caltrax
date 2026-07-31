"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getTodayRange } from "@/lib/dates";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

/** Finds today's workout for this user, creating one if this is the first set logged today. */
async function getOrCreateTodaysWorkout(userId: string) {
  const { start, end } = getTodayRange();
  const existing = await db.workout.findFirst({
    where: { userId, loggedAt: { gte: start, lte: end } },
  });
  if (existing) return existing;
  return db.workout.create({ data: { userId } });
}

export async function addWorkoutSetAction(exerciseId: string, reps: number, weightKg: number | null) {
  const userId = await requireUserId();

  if (!Number.isInteger(reps) || reps <= 0) {
    throw new Error("Enter a valid number of reps");
  }
  if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg < 0)) {
    throw new Error("Enter a valid weight");
  }

  const workout = await getOrCreateTodaysWorkout(userId);

  const [setCountForExercise, maxOrderSet] = await Promise.all([
    db.workoutSet.count({ where: { workoutId: workout.id, exerciseId } }),
    db.workoutSet.findFirst({ where: { workoutId: workout.id }, orderBy: { order: "desc" } }),
  ]);

  await db.workoutSet.create({
    data: {
      workoutId: workout.id,
      exerciseId,
      setNumber: setCountForExercise + 1,
      reps,
      weightKg: weightKg ?? undefined,
      order: (maxOrderSet?.order ?? 0) + 1,
    },
  });

  revalidatePath("/log");
}

export async function deleteWorkoutSetAction(setId: string) {
  const userId = await requireUserId();
  // Scope the delete through the parent workout's owner -- WorkoutSet
  // itself has no userId column (it belongs to a Workout, which does).
  await db.workoutSet.deleteMany({
    where: { id: setId, workout: { userId } },
  });
  revalidatePath("/log");
}

/**
 * Saves today's distinct exercises (in the order they were first logged)
 * as a reusable named routine. Deliberately captures exercises only, not
 * weight or reps -- see the WorkoutRoutine model comment for why.
 */
export async function saveRoutineFromTodayAction(name: string) {
  const userId = await requireUserId();
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Enter a name for this routine");

  const { start, end } = getTodayRange();
  const todaysWorkout = await db.workout.findFirst({
    where: { userId, loggedAt: { gte: start, lte: end } },
    include: { sets: { orderBy: { order: "asc" } } },
  });
  if (!todaysWorkout || todaysWorkout.sets.length === 0) {
    throw new Error("Log at least one set today before saving a routine");
  }

  const distinctExerciseIds = [
    ...new Set(todaysWorkout.sets.map((s: (typeof todaysWorkout.sets)[number]) => s.exerciseId)),
  ];

  await db.workoutRoutine.create({
    data: {
      userId,
      name: trimmedName,
      exercises: {
        create: distinctExerciseIds.map((exerciseId, i) => ({ exerciseId, order: i })),
      },
    },
  });

  revalidatePath("/log");
}

export async function deleteRoutineAction(routineId: string) {
  const userId = await requireUserId();
  await db.workoutRoutine.deleteMany({ where: { id: routineId, userId } });
  revalidatePath("/log");
}
