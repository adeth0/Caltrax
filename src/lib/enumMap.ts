import type {
  Profile,
  Sex as PrismaSex,
  ActivityLevel as PrismaActivityLevel,
  PrimaryGoal as PrismaPrimaryGoal,
  DietaryPreference as PrismaDietaryPreference,
  MealType as PrismaMealType,
  FoodSource as PrismaFoodSource,
} from "@prisma/client";
import type {
  ActivityLevel,
  DietaryPreference,
  FoodItem,
  MealType,
  PrimaryGoal,
  Sex,
  UserProfileInput,
} from "@/types";

// Prisma stores enums as SCREAMING_SNAKE_CASE; the goal engine and UI work
// with lowercase literal unions (nicer in JSX, form values, etc). Convert at
// the boundary rather than letting either style leak into the other layer.
// Each *_FROM_PRISMA map is keyed by the actual Prisma-generated enum type so
// TypeScript knows the lookup is exhaustive (no `| undefined`).

export const SEX_TO_PRISMA: Record<Sex, PrismaSex> = { male: "MALE", female: "FEMALE" };
export const SEX_FROM_PRISMA: Record<PrismaSex, Sex> = { MALE: "male", FEMALE: "female" };

export const ACTIVITY_TO_PRISMA: Record<ActivityLevel, PrismaActivityLevel> = {
  sedentary: "SEDENTARY",
  light: "LIGHT",
  moderate: "MODERATE",
  active: "ACTIVE",
  very_active: "VERY_ACTIVE",
};
export const ACTIVITY_FROM_PRISMA: Record<PrismaActivityLevel, ActivityLevel> = {
  SEDENTARY: "sedentary",
  LIGHT: "light",
  MODERATE: "moderate",
  ACTIVE: "active",
  VERY_ACTIVE: "very_active",
};

export const GOAL_TO_PRISMA: Record<PrimaryGoal, PrismaPrimaryGoal> = {
  lose_fat: "LOSE_FAT",
  build_muscle: "BUILD_MUSCLE",
  maintain_weight: "MAINTAIN_WEIGHT",
  improve_health: "IMPROVE_HEALTH",
  increase_protein: "INCREASE_PROTEIN",
  athletic_performance: "ATHLETIC_PERFORMANCE",
  body_recomposition: "BODY_RECOMPOSITION",
};
export const GOAL_FROM_PRISMA: Record<PrismaPrimaryGoal, PrimaryGoal> = {
  LOSE_FAT: "lose_fat",
  BUILD_MUSCLE: "build_muscle",
  MAINTAIN_WEIGHT: "maintain_weight",
  IMPROVE_HEALTH: "improve_health",
  INCREASE_PROTEIN: "increase_protein",
  ATHLETIC_PERFORMANCE: "athletic_performance",
  BODY_RECOMPOSITION: "body_recomposition",
};

export const DIET_TO_PRISMA: Record<DietaryPreference, PrismaDietaryPreference> = {
  none: "NONE",
  vegetarian: "VEGETARIAN",
  vegan: "VEGAN",
  keto: "KETO",
  low_carb: "LOW_CARB",
  mediterranean: "MEDITERRANEAN",
};
export const DIET_FROM_PRISMA: Record<PrismaDietaryPreference, DietaryPreference> = {
  NONE: "none",
  VEGETARIAN: "vegetarian",
  VEGAN: "vegan",
  KETO: "keto",
  LOW_CARB: "low_carb",
  MEDITERRANEAN: "mediterranean",
};

export const MEAL_TO_PRISMA: Record<MealType, PrismaMealType> = {
  breakfast: "BREAKFAST",
  lunch: "LUNCH",
  dinner: "DINNER",
  snack: "SNACK",
};
export const MEAL_FROM_PRISMA: Record<PrismaMealType, MealType> = {
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
  SNACK: "snack",
};

export const FOOD_SOURCE_TO_PRISMA: Record<FoodItem["source"], PrismaFoodSource> = {
  open_food_facts: "OPEN_FOOD_FACTS",
  usda: "USDA",
  custom: "CUSTOM",
};

/** Build the goal engine's input shape straight from a Prisma `Profile` row. */
export function profileToGoalInput(profile: Profile): UserProfileInput {
  return {
    sex: SEX_FROM_PRISMA[profile.sex],
    age: profile.age,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    targetWeightKg: profile.targetWeightKg ?? undefined,
    activityLevel: ACTIVITY_FROM_PRISMA[profile.activityLevel],
    primaryGoal: GOAL_FROM_PRISMA[profile.primaryGoal],
    targetRateKgPerWeek: profile.targetRateKgPerWeek ?? undefined,
    dietaryPreference: DIET_FROM_PRISMA[profile.dietaryPreference],
  };
}
