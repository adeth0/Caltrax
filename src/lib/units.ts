/**
 * Weight and height are always stored internally in metric (kg, cm) --
 * this file is the only place conversion happens, so display logic
 * throughout the app stays simple and consistent.
 */

const KG_PER_LB = 0.45359237;
const CM_PER_INCH = 2.54;

export function kgToLbs(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbsToKg(lbs: number): number {
  return lbs * KG_PER_LB;
}

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

/** Splits total inches into feet and remaining inches, e.g. 70 -> { feet: 5, inches: 10 }. */
export function inchesToFeetAndInches(totalInches: number): { feet: number; inches: number } {
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return { feet, inches };
}

export function feetAndInchesToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

/** Displays weight in the person's preferred unit, rounded to a sensible precision. */
export function formatWeight(kg: number, unit: "kg" | "lbs"): string {
  return unit === "lbs" ? `${Math.round(kgToLbs(kg) * 10) / 10} lbs` : `${Math.round(kg * 10) / 10} kg`;
}

/** Displays height in the person's preferred unit -- feet/inches for imperial, plain cm for metric. */
export function formatHeight(cm: number, unit: "cm" | "ft"): string {
  if (unit === "cm") return `${Math.round(cm)} cm`;
  const { feet, inches } = inchesToFeetAndInches(cmToInches(cm));
  return `${feet}'${inches}"`;
}
