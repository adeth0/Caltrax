/**
 * Estimates calories burned from manually-logged strength-training sets.
 * Deliberately a rough approximation, not a precision claim -- there's
 * no heart-rate or duration data behind a manually-logged set the way a
 * wearable has, so this leans on a standard MET (Metabolic Equivalent
 * of Task) formula with a reasonable assumed time-per-set, and should
 * be understood as "in the right ballpark", not a substitute for a
 * heart-rate-based estimate from a connected device.
 *
 * calories = MET x weight(kg) x duration(hours)
 *
 * Using MET 5.0 (a standard value for moderate-to-vigorous resistance
 * training -- see the Compendium of Physical Activities, the reference
 * most fitness apps and researchers use for MET values) and assuming
 * roughly 2.5 minutes per set including rest between sets, which is a
 * reasonable average for typical strength training rep ranges.
 */
const RESISTANCE_TRAINING_MET = 5.0;
const ASSUMED_MINUTES_PER_SET = 2.5;

export function estimateWorkoutCalories(totalSets: number, bodyWeightKg: number): number {
  if (totalSets <= 0 || bodyWeightKg <= 0) return 0;
  const hours = (totalSets * ASSUMED_MINUTES_PER_SET) / 60;
  return Math.round(RESISTANCE_TRAINING_MET * bodyWeightKg * hours);
}
