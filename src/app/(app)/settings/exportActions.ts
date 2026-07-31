"use server";

import { db } from "@/lib/db";
import { rowsToCsv } from "@/lib/csv";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export async function exportMealsCsvAction(): Promise<string> {
  const userId = await requireUserId();
  const entries = await db.mealEntry.findMany({
    where: { userId },
    include: { food: true },
    orderBy: { loggedAt: "asc" },
  });

  const rows = entries.map((e: (typeof entries)[number]) => {
    const scale = e.servingUnitG / 100;
    return [
      e.loggedAt.toISOString(),
      e.mealType,
      e.food.name,
      Math.round(e.servingUnitG),
      Math.round(e.food.caloriesPer100g * scale),
      Math.round(e.food.proteinPer100g * scale * 10) / 10,
      Math.round(e.food.carbsPer100g * scale * 10) / 10,
      Math.round(e.food.fatPer100g * scale * 10) / 10,
    ];
  });

  return rowsToCsv(
    ["Date", "Meal", "Food", "Grams", "Calories", "Protein (g)", "Carbs (g)", "Fat (g)"],
    rows
  );
}

export async function exportWeightCsvAction(): Promise<string> {
  const userId = await requireUserId();
  const logs = await db.weightLog.findMany({ where: { userId }, orderBy: { loggedAt: "asc" } });

  const rows = logs.map((l: (typeof logs)[number]) => [
    l.loggedAt.toISOString(),
    l.weightKg,
    l.bodyFatPct,
    l.source,
  ]);

  return rowsToCsv(["Date", "Weight (kg)", "Body Fat (%)", "Source"], rows);
}

export async function exportMeasurementsCsvAction(): Promise<string> {
  const userId = await requireUserId();
  const logs = await db.bodyMeasurement.findMany({ where: { userId }, orderBy: { loggedAt: "asc" } });

  const rows = logs.map((l: (typeof logs)[number]) => [l.loggedAt.toISOString(), l.type, l.valueCm]);

  return rowsToCsv(["Date", "Type", "Value (cm)"], rows);
}

export async function exportWorkoutsCsvAction(): Promise<string> {
  const userId = await requireUserId();
  const workouts = await db.workout.findMany({
    where: { userId },
    orderBy: { loggedAt: "asc" },
    include: { sets: { include: { exercise: true }, orderBy: { order: "asc" } } },
  });

  const rows = workouts.flatMap((w: (typeof workouts)[number]) =>
    w.sets.map((s: (typeof w.sets)[number]) => [
      w.loggedAt.toISOString(),
      s.exercise.name,
      s.setNumber,
      s.reps,
      s.weightKg,
    ])
  );

  return rowsToCsv(["Date", "Exercise", "Set", "Reps", "Weight (kg)"], rows);
}
