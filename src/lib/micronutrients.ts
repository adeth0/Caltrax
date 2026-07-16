import type { Sex } from "@/types";

export type MicronutrientKey =
  | "vitaminA"
  | "vitaminC"
  | "vitaminD"
  | "vitaminE"
  | "vitaminK"
  | "calcium"
  | "iron"
  | "magnesium"
  | "potassium"
  | "zinc"
  | "sodium";

export interface MicronutrientDef {
  key: MicronutrientKey;
  label: string;
  unit: "mg" | "mcg";
  /** "min" = aim to reach this (vitamins/minerals); "max" = stay under this (sodium). */
  direction: "min" | "max";
  /** Adult RDA (or UL for direction "max"), per current NIH/FDA daily-value guidance. */
  target: (sex: Sex) => number;
}

// Values are standard adult Recommended Dietary Allowances (RDA) — or, for
// sodium, the commonly-cited upper limit — from NIH Office of Dietary
// Supplements / FDA daily values. These are population averages for
// general reference, not personalised medical advice; someone with a
// diagnosed deficiency or condition should follow guidance from their
// doctor instead.
export const MICRONUTRIENTS: MicronutrientDef[] = [
  {
    key: "vitaminA",
    label: "Vitamin A",
    unit: "mcg",
    direction: "min",
    target: (sex) => (sex === "male" ? 900 : 700),
  },
  {
    key: "vitaminC",
    label: "Vitamin C",
    unit: "mg",
    direction: "min",
    target: (sex) => (sex === "male" ? 90 : 75),
  },
  { key: "vitaminD", label: "Vitamin D", unit: "mcg", direction: "min", target: () => 15 },
  { key: "vitaminE", label: "Vitamin E", unit: "mg", direction: "min", target: () => 15 },
  {
    key: "vitaminK",
    label: "Vitamin K",
    unit: "mcg",
    direction: "min",
    target: (sex) => (sex === "male" ? 120 : 90),
  },
  { key: "calcium", label: "Calcium", unit: "mg", direction: "min", target: () => 1000 },
  { key: "iron", label: "Iron", unit: "mg", direction: "min", target: (sex) => (sex === "male" ? 8 : 18) },
  {
    key: "magnesium",
    label: "Magnesium",
    unit: "mg",
    direction: "min",
    target: (sex) => (sex === "male" ? 420 : 320),
  },
  {
    key: "potassium",
    label: "Potassium",
    unit: "mg",
    direction: "min",
    target: (sex) => (sex === "male" ? 3400 : 2600),
  },
  { key: "zinc", label: "Zinc", unit: "mg", direction: "min", target: (sex) => (sex === "male" ? 11 : 8) },
  { key: "sodium", label: "Sodium", unit: "mg", direction: "max", target: () => 2300 },
];

/** Grams-of-food-scaled micronutrient totals, keyed the same as MicronutrientKey. */
export type MicronutrientIntake = Record<MicronutrientKey, number>;

export function emptyIntake(): MicronutrientIntake {
  return {
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0,
    vitaminK: 0,
    calcium: 0,
    iron: 0,
    magnesium: 0,
    potassium: 0,
    zinc: 0,
    sodium: 0,
  };
}

/** Maps a Food row's *Per100g columns onto MicronutrientIntake keys, scaled by grams eaten. */
export function addFoodMicronutrients(
  intake: MicronutrientIntake,
  food: {
    vitaminAPer100g: number | null;
    vitaminCPer100g: number | null;
    vitaminDPer100g: number | null;
    vitaminEPer100g: number | null;
    vitaminKPer100g: number | null;
    calciumMgPer100g: number | null;
    ironMgPer100g: number | null;
    magnesiumMgPer100g: number | null;
    potassiumMgPer100g: number | null;
    zincMgPer100g: number | null;
    sodiumMgPer100g: number | null;
  },
  grams: number
): MicronutrientIntake {
  const scale = grams / 100;
  return {
    vitaminA: intake.vitaminA + (food.vitaminAPer100g ?? 0) * scale,
    vitaminC: intake.vitaminC + (food.vitaminCPer100g ?? 0) * scale,
    vitaminD: intake.vitaminD + (food.vitaminDPer100g ?? 0) * scale,
    vitaminE: intake.vitaminE + (food.vitaminEPer100g ?? 0) * scale,
    vitaminK: intake.vitaminK + (food.vitaminKPer100g ?? 0) * scale,
    calcium: intake.calcium + (food.calciumMgPer100g ?? 0) * scale,
    iron: intake.iron + (food.ironMgPer100g ?? 0) * scale,
    magnesium: intake.magnesium + (food.magnesiumMgPer100g ?? 0) * scale,
    potassium: intake.potassium + (food.potassiumMgPer100g ?? 0) * scale,
    zinc: intake.zinc + (food.zincMgPer100g ?? 0) * scale,
    sodium: intake.sodium + (food.sodiumMgPer100g ?? 0) * scale,
  };
}
