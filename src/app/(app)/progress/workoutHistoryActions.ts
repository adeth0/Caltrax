"use server";

import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export interface ExerciseProgressPoint {
  date: string; // short label, e.g. "12 Jul"
  /** The best set for that session -- highest weight if any set had one, otherwise highest reps (bodyweight exercises). */
  weightKg: number | null;
  reps: number;
}

/**
 * The best set per session for a given exercise, across every session
 * the person has ever logged it in -- this is what actually shows
 * whether progressive overload is happening, not just a flat list of
 * every set ever done.
 */
export async function getExerciseProgressAction(exerciseId: string): Promise<ExerciseProgressPoint[]> {
  const userId = await requireUserId();

  const sets = await db.workoutSet.findMany({
    where: { exerciseId, workout: { userId } },
    include: { workout: { select: { loggedAt: true } } },
    orderBy: { workout: { loggedAt: "asc" } },
  });

  const bySession = new Map<string, { loggedAt: Date; weightKg: number | null; reps: number }>();
  for (const set of sets) {
    const dayKey = set.workout.loggedAt.toDateString();
    const current = bySession.get(dayKey);
    const isBetter =
      !current ||
      (set.weightKg ?? 0) > (current.weightKg ?? 0) ||
      ((set.weightKg ?? 0) === (current.weightKg ?? 0) && set.reps > current.reps);
    if (isBetter) {
      bySession.set(dayKey, { loggedAt: set.workout.loggedAt, weightKg: set.weightKg, reps: set.reps });
    }
  }

  return [...bySession.values()]
    .sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime())
    .map((point) => ({
      date: point.loggedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      weightKg: point.weightKg,
      reps: point.reps,
    }));
}
