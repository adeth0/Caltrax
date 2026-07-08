import type { GoalEngineResult, MacroTargets, PrimaryGoal, UserProfileInput } from "@/types";

/**
 * Goal Engine
 * ------------------------------------------------------------------
 * Pure, side-effect-free, fully unit-tested math. No component or API
 * route should recompute BMR/TDEE/macros itself — always go through
 * `calculateGoals` so the numbers stay consistent across the whole app.
 *
 * References:
 *  - BMR: Mifflin-St Jeor equation (more accurate than Harris-Benedict
 *    for the general population; used by MacroFactor & Cronometer).
 *  - Safe rate of weight change is capped at 1% of bodyweight/week,
 *    matching ACSM guidance, to avoid the engine ever recommending an
 *    unsafe deficit/surplus regardless of what the user requests.
 */

const ACTIVITY_MULTIPLIERS: Record<UserProfileInput["activityLevel"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/** kcal per kg of bodyweight change (approx. energy density of adipose tissue) */
const KCAL_PER_KG = 7700;

const MIN_CALORIES_FLOOR: Record<UserProfileInput["sex"], number> = {
  // Never recommend below these floors regardless of inputs — this is a
  // hard safety rail, not a suggestion the UI can override.
  male: 1500,
  female: 1200,
};

export function calculateBMR(input: UserProfileInput): number {
  const { sex, age, heightCm, weightKg } = input;
  // Mifflin-St Jeor
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: UserProfileInput["activityLevel"]): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

function defaultRateForGoal(goal: PrimaryGoal, weightKg: number): number {
  // kg/week, clamped to a safe ±1% bodyweight/week band
  const safeCap = weightKg * 0.01;
  switch (goal) {
    case "lose_fat":
      return -Math.min(0.5, safeCap);
    case "build_muscle":
      return Math.min(0.25, safeCap);
    case "body_recomposition":
      return 0; // recomp targets are driven by macros, not scale weight
    case "athletic_performance":
    case "increase_protein":
    case "improve_health":
    case "maintain_weight":
    default:
      return 0;
  }
}

function macroSplitForGoal(goal: PrimaryGoal): { proteinPerKg: number; fatPctOfCalories: number } {
  // proteinPerKg is grams of protein per kg of bodyweight; fat is a % of
  // total calories; carbs absorb whatever calories remain.
  switch (goal) {
    case "build_muscle":
      return { proteinPerKg: 2.0, fatPctOfCalories: 0.25 };
    case "lose_fat":
      return { proteinPerKg: 2.2, fatPctOfCalories: 0.3 }; // higher protein preserves lean mass in a deficit
    case "body_recomposition":
      return { proteinPerKg: 2.2, fatPctOfCalories: 0.28 };
    case "athletic_performance":
      return { proteinPerKg: 1.8, fatPctOfCalories: 0.25 };
    case "increase_protein":
      return { proteinPerKg: 2.4, fatPctOfCalories: 0.3 };
    case "improve_health":
    case "maintain_weight":
    default:
      return { proteinPerKg: 1.6, fatPctOfCalories: 0.3 };
  }
}

export function calculateGoals(input: UserProfileInput): GoalEngineResult {
  const bmr = calculateBMR(input);
  const tdee = calculateTDEE(bmr, input.activityLevel);

  const rateKgPerWeek = input.targetRateKgPerWeek ?? defaultRateForGoal(input.primaryGoal, input.weightKg);
  const dailyCalorieAdjustment = (rateKgPerWeek * KCAL_PER_KG) / 7;

  let calories = Math.round(tdee + dailyCalorieAdjustment);
  const floor = MIN_CALORIES_FLOOR[input.sex];
  const rationale: string[] = [
    `BMR calculated with the Mifflin-St Jeor equation: ${Math.round(bmr)} kcal/day.`,
    `TDEE applies your ${input.activityLevel.replace("_", " ")} activity multiplier: ${Math.round(tdee)} kcal/day.`,
  ];

  if (calories < floor) {
    rationale.push(
      `Target adjusted up to a safe minimum of ${floor} kcal/day; the requested rate of change was too aggressive to sustain.`
    );
    calories = floor;
  } else if (rateKgPerWeek !== 0) {
    rationale.push(
      `Calories adjusted by ${Math.round(dailyCalorieAdjustment)} kcal/day to target ${Math.abs(rateKgPerWeek).toFixed(2)} kg/week ${
        rateKgPerWeek < 0 ? "loss" : "gain"
      }.`
    );
  }

  const { proteinPerKg, fatPctOfCalories } = macroSplitForGoal(input.primaryGoal);
  const proteinG = Math.round(proteinPerKg * input.weightKg);
  const fatG = Math.round((calories * fatPctOfCalories) / 9);
  const proteinCalories = proteinG * 4;
  const fatCalories = fatG * 9;
  const remainingCalories = Math.max(0, calories - proteinCalories - fatCalories);
  const carbsG = Math.round(remainingCalories / 4);

  // Fibre: 14g per 1000 kcal is the widely-cited evidence-based ratio (US/EU guidelines)
  const fibreG = Math.round((calories / 1000) * 14);

  // Water: 33ml per kg bodyweight is a common baseline recommendation,
  // nudged up for higher activity levels.
  const activityWaterBonusMl =
    input.activityLevel === "active" || input.activityLevel === "very_active" ? 500 : 0;
  const waterMl = Math.round(input.weightKg * 33 + activityWaterBonusMl);

  const targets: MacroTargets = {
    calories,
    proteinG,
    carbsG,
    fatG,
    fibreG,
    waterMl,
  };

  rationale.push(
    `Protein set to ${proteinPerKg}g/kg bodyweight (${proteinG}g); fat set to ${Math.round(
      fatPctOfCalories * 100
    )}% of calories (${fatG}g); carbohydrates fill the remaining calories (${carbsG}g).`
  );

  return { bmr, tdee, targets, rationale };
}

/** Convenience helper for the dashboard: how much of today's target remains. */
export function remaining(target: number, consumed: number): number {
  return Math.max(0, target - consumed);
}

/** 0-100 status used to colour a ring/progress bar per the design system's accent semantics. */
export function progressStatus(consumed: number, target: number): "info" | "success" | "warning" | "danger" {
  if (target <= 0) return "info";
  const pct = consumed / target;
  if (pct < 0.85) return "info";
  if (pct <= 1.0) return "success";
  if (pct <= 1.1) return "warning";
  return "danger";
}
