import { db } from "@/lib/db";
import { getLastNDaysRange } from "@/lib/dates";
import { profileToGoalInput } from "@/lib/enumMap";
import { calculateGoals } from "@/lib/goalEngine";

export type ReportPeriod = "week" | "month" | "year";

const PERIOD_DAYS: Record<ReportPeriod, number> = { week: 7, month: 30, year: 365 };

export interface ReportDayPoint {
  date: string; // short display label
  calories: number;
}

export interface Report {
  periodLabel: string;
  daysWithLogs: number;
  totalDaysInPeriod: number;
  avgCalories: number;
  targetCalories: number;
  avgProteinG: number;
  targetProteinG: number;
  avgCarbsG: number;
  avgFatG: number;
  avgWaterMl: number;
  targetWaterMl: number;
  weightChangeKg: number | null;
  startWeightKg: number | null;
  endWeightKg: number | null;
  dailySeries: ReportDayPoint[];
}

export async function computeReport(userId: string, period: ReportPeriod): Promise<Report | null> {
  const profile = await db.profile.findUnique({ where: { id: userId } });
  if (!profile) return null;

  const days = PERIOD_DAYS[period];
  const { start, end } = getLastNDaysRange(days);
  const { targets } = calculateGoals(profileToGoalInput(profile));
  const timezone = profile.timezone;
  const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: timezone });
  const labelFmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    day: "2-digit",
    month: "short",
  });

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

  const caloriesByDay = new Map<string, number>();
  const macroTotals = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
  const loggedDates = new Set<string>();

  for (const entry of mealEntries as (typeof mealEntries)[number][]) {
    const scale = entry.servingUnitG / 100;
    const calories = entry.food.caloriesPer100g * scale;
    macroTotals.calories += calories;
    macroTotals.proteinG += entry.food.proteinPer100g * scale;
    macroTotals.carbsG += entry.food.carbsPer100g * scale;
    macroTotals.fatG += entry.food.fatPer100g * scale;

    const dateKey = dayFmt.format(entry.loggedAt);
    loggedDates.add(dateKey);
    caloriesByDay.set(dateKey, (caloriesByDay.get(dateKey) ?? 0) + calories);
  }

  const daysWithLogs = Math.max(loggedDates.size, 1);
  const waterTotal = (waterLogs as (typeof waterLogs)[number][]).reduce((sum, w) => sum + w.amountMl, 0);

  const firstWeight = weightLogs[0];
  const lastWeight = weightLogs[weightLogs.length - 1];
  const weightChangeKg =
    weightLogs.length >= 2 && firstWeight && lastWeight
      ? Number((lastWeight.weightKg - firstWeight.weightKg).toFixed(1))
      : null;

  // Build a continuous daily series (zero-filled) so the chart doesn't have gaps.
  const dailySeries: ReportDayPoint[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = dayFmt.format(cursor);
    dailySeries.push({ date: labelFmt.format(cursor), calories: Math.round(caloriesByDay.get(key) ?? 0) });
    cursor.setDate(cursor.getDate() + 1);
  }

  return {
    periodLabel: period === "week" ? "Last 7 days" : period === "month" ? "Last 30 days" : "Last 365 days",
    daysWithLogs: loggedDates.size,
    totalDaysInPeriod: days,
    avgCalories: Math.round(macroTotals.calories / daysWithLogs),
    targetCalories: Math.round(targets.calories),
    avgProteinG: Math.round(macroTotals.proteinG / daysWithLogs),
    targetProteinG: Math.round(targets.proteinG),
    avgCarbsG: Math.round(macroTotals.carbsG / daysWithLogs),
    avgFatG: Math.round(macroTotals.fatG / daysWithLogs),
    avgWaterMl: Math.round(waterTotal / daysWithLogs),
    targetWaterMl: profile.dailyWaterGoalMl ?? targets.waterMl,
    weightChangeKg,
    startWeightKg: firstWeight?.weightKg ?? null,
    endWeightKg: lastWeight?.weightKg ?? null,
    dailySeries,
  };
}
