// Core domain types for Caltrax.
// Keep this the single source of truth for shapes shared between the
// goal engine, the dashboard widgets and the API routes.

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary" // little or no exercise
  | "light" // light exercise 1-3 days/week
  | "moderate" // moderate exercise 3-5 days/week
  | "active" // hard exercise 6-7 days/week
  | "very_active"; // very hard exercise, physical job

export type PrimaryGoal =
  | "lose_fat"
  | "build_muscle"
  | "maintain_weight"
  | "improve_health"
  | "increase_protein"
  | "athletic_performance"
  | "body_recomposition";

export type DietaryPreference = "none" | "vegetarian" | "vegan" | "keto" | "low_carb" | "mediterranean";

export type WeightUnit = "kg" | "lb";
export type HeightUnit = "cm" | "in";
export type VolumeUnit = "ml" | "fl_oz";

export interface UnitPreferences {
  weight: WeightUnit;
  height: HeightUnit;
  volume: VolumeUnit;
}

/** Everything the goal engine needs to compute BMR/TDEE/targets. */
export interface UserProfileInput {
  sex: Sex;
  age: number; // years
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  activityLevel: ActivityLevel;
  primaryGoal: PrimaryGoal;
  /** kg/week, positive = gain, negative = loss. Omit to use a safe default for the goal. */
  targetRateKgPerWeek?: number;
  dietaryPreference?: DietaryPreference;
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fibreG: number;
  waterMl: number;
}

export interface GoalEngineResult {
  bmr: number;
  tdee: number;
  targets: MacroTargets;
  /** Human-readable explanation of how the numbers were derived, shown in Settings > Goals */
  rationale: string[];
}

export interface DailyIntakeSummary {
  date: string; // ISO date
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fibreG: number;
  sugarG: number;
  saturatedFatG: number;
  sodiumMg: number;
  waterMl: number;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodItem {
  id: string;
  source: "open_food_facts" | "usda" | "custom";
  sourceId: string;
  name: string;
  brand?: string;
  barcode?: string;
  servingSizeG?: number;
  servingSizeLabel?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fibrePer100g?: number;
  sugarPer100g?: number;
  sodiumMgPer100g?: number;
  imageUrl?: string;
}

export interface MealEntry {
  id: string;
  userId: string;
  foodId: string;
  mealType: MealType;
  servingQuantity: number;
  servingUnitG: number;
  loggedAt: string; // ISO datetime
}
