import type { MuscleGroupValue } from "@/components/log/WorkoutLogClient";

/**
 * Maps a muscle group to a badge color -- gives every exercise result a
 * consistent, colorful icon badge in the exercise picker, echoing the
 * same visual-variety approach used for food categories. Kept as a
 * separate file from WorkoutLogClient (which stays the canonical home
 * for MuscleGroupValue and MUSCLE_GROUP_LABELS, since other files
 * already import those from there) purely to avoid growing that
 * already-large file further.
 */
const MUSCLE_GROUP_COLOR_CLASSES: Record<MuscleGroupValue, string> = {
  CHEST: "bg-[#5a2626]/20 text-[#d47f7f]",
  BACK: "bg-[#25405a]/20 text-[#7fa8c9]",
  LEGS: "bg-[#2d4a2d]/20 text-[#7fb37f]",
  SHOULDERS: "bg-[#5a4a1f]/20 text-[#d4b45f]",
  ARMS: "bg-[#5a3226]/20 text-[#c98a6b]",
  CORE: "bg-[#3d2f1f]/20 text-[#b08a5f]",
  FULL_BODY: "bg-[#3a2d4a]/20 text-[#a687c9]",
  CARDIO: "bg-[#5a2640]/20 text-[#d47fb3]",
};

export function getMuscleGroupColorClasses(muscleGroup: MuscleGroupValue): string {
  return MUSCLE_GROUP_COLOR_CLASSES[muscleGroup];
}
