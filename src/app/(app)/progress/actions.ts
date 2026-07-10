"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { AIConfigError } from "@/lib/ai/client";
import { generateInsights, type InsightsResult } from "@/lib/ai/insights";
import { getLastNDaysRange } from "@/lib/dates";
import { profileToGoalInput } from "@/lib/enumMap";
import { calculateGoals } from "@/lib/goalEngine";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export async function logWeightAction(weightKg: number, bodyFatPct?: number) {
  const userId = await requireUserId();
  if (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 400) {
    throw new Error("Enter a valid weight");
  }

  await db.weightLog.create({
    data: { userId, weightKg, bodyFatPct: bodyFatPct ?? null },
  });

  // Keep Profile.weightKg (used by the goal engine) in sync with the latest log.
  await db.profile.update({ where: { id: userId }, data: { weightKg } });

  revalidatePath("/progress");
  revalidatePath("/dashboard");
}

export async function logWaterAction(amountMl: number) {
  const userId = await requireUserId();
  if (!Number.isFinite(amountMl) || amountMl <= 0) throw new Error("Enter a valid amount");

  await db.waterLog.create({ data: { userId, amountMl } });

  revalidatePath("/progress");
  revalidatePath("/dashboard");
}

export async function deleteWeightLogAction(id: string) {
  const userId = await requireUserId();
  await db.weightLog.deleteMany({ where: { id, userId } });
  revalidatePath("/progress");
  revalidatePath("/dashboard");
}

export async function generateInsightsAction(period: "week" | "month"): Promise<InsightsResult> {
  const userId = await requireUserId();
  const days = period === "week" ? 7 : 30;

  const profile = await db.profile.findUnique({ where: { id: userId } });
  if (!profile) throw new Error("Profile not found");

  const { start, end } = getLastNDaysRange(days);
  const { targets } = calculateGoals(profileToGoalInput(profile));

  const [mealEntries, waterLogs, weightLogs] = await Promise.all([
    db.mealEntry.findMany({
      where: { userId, loggedAt: { gte: start, lte: end } },
      include: { food: true },
    }),
    db.waterLog.findMany({ where: { userId, loggedAt: { gte: start, lte: end } } }),
    db.weightLog.findMany({
      where: { userId, loggedAt: { gte: start, lte: end } },
      orderBy: { loggedAt: "asc" },
    }),
  ]);

  const loggedDays = new Set(mealEntries.map((e: (typeof mealEntries)[number]) => e.loggedAt.toDateString()));

  const totals = mealEntries.reduce(
    (acc, e: (typeof mealEntries)[number]) => {
      const scale = e.servingUnitG / 100;
      acc.calories += e.food.caloriesPer100g * scale;
      acc.proteinG += e.food.proteinPer100g * scale;
      acc.carbsG += e.food.carbsPer100g * scale;
      acc.fatG += e.food.fatPer100g * scale;
      return acc;
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  const daysWithLogs = Math.max(loggedDays.size, 1);
  const waterTotal = waterLogs.reduce((sum, w: (typeof waterLogs)[number]) => sum + w.amountMl, 0);

  const firstWeight = weightLogs[0];
  const lastWeight = weightLogs[weightLogs.length - 1];
  const weightChangeKg =
    weightLogs.length >= 2 && firstWeight && lastWeight
      ? Number((lastWeight.weightKg - firstWeight.weightKg).toFixed(1))
      : null;

  try {
    return await generateInsights({
      periodLabel: period === "week" ? "the last 7 days" : "the last 30 days",
      daysWithLogs: loggedDays.size,
      totalDaysInPeriod: days,
      avgCalories: Math.round(totals.calories / daysWithLogs),
      targetCalories: Math.round(targets.calories),
      avgProteinG: Math.round(totals.proteinG / daysWithLogs),
      targetProteinG: Math.round(targets.proteinG),
      avgCarbsG: Math.round(totals.carbsG / daysWithLogs),
      avgFatG: Math.round(totals.fatG / daysWithLogs),
      avgWaterMl: Math.round(waterTotal / daysWithLogs),
      targetWaterMl: profile.dailyWaterGoalMl ?? targets.waterMl,
      weightChangeKg,
      primaryGoal: profile.primaryGoal,
    });
  } catch (err) {
    if (err instanceof AIConfigError) throw err;
    throw new Error("Couldn't generate insights right now — try again shortly.");
  }
}
