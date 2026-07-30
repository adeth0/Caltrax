/**
 * Curated exercise library -- common, well-established exercises across
 * major muscle groups. Not personalized programming advice, just a
 * searchable reference library to log sets against.
 */

export type MuscleGroupSeed =
  "CHEST" | "BACK" | "LEGS" | "SHOULDERS" | "ARMS" | "CORE" | "FULL_BODY" | "CARDIO";

export interface ExerciseSeedDef {
  name: string;
  muscleGroup: MuscleGroupSeed;
  equipment?: string;
}

export const CURATED_EXERCISES: ExerciseSeedDef[] = [
  // Chest
  { name: "Barbell Bench Press", muscleGroup: "CHEST", equipment: "Barbell" },
  { name: "Incline Dumbbell Press", muscleGroup: "CHEST", equipment: "Dumbbell" },
  { name: "Decline Bench Press", muscleGroup: "CHEST", equipment: "Barbell" },
  { name: "Push-Ups", muscleGroup: "CHEST", equipment: "Bodyweight" },
  { name: "Cable Fly", muscleGroup: "CHEST", equipment: "Cable" },
  { name: "Dips", muscleGroup: "CHEST", equipment: "Bodyweight" },

  // Back
  { name: "Deadlift", muscleGroup: "BACK", equipment: "Barbell" },
  { name: "Pull-Ups", muscleGroup: "BACK", equipment: "Bodyweight" },
  { name: "Barbell Row", muscleGroup: "BACK", equipment: "Barbell" },
  { name: "Lat Pulldown", muscleGroup: "BACK", equipment: "Machine" },
  { name: "Seated Cable Row", muscleGroup: "BACK", equipment: "Cable" },
  { name: "T-Bar Row", muscleGroup: "BACK", equipment: "Barbell" },

  // Legs
  { name: "Barbell Squat", muscleGroup: "LEGS", equipment: "Barbell" },
  { name: "Leg Press", muscleGroup: "LEGS", equipment: "Machine" },
  { name: "Romanian Deadlift", muscleGroup: "LEGS", equipment: "Barbell" },
  { name: "Walking Lunges", muscleGroup: "LEGS", equipment: "Dumbbell" },
  { name: "Leg Extension", muscleGroup: "LEGS", equipment: "Machine" },
  { name: "Leg Curl", muscleGroup: "LEGS", equipment: "Machine" },
  { name: "Calf Raise", muscleGroup: "LEGS", equipment: "Machine" },
  { name: "Bulgarian Split Squat", muscleGroup: "LEGS", equipment: "Dumbbell" },
  { name: "Hip Thrust", muscleGroup: "LEGS", equipment: "Barbell" },

  // Shoulders
  { name: "Overhead Press", muscleGroup: "SHOULDERS", equipment: "Barbell" },
  { name: "Lateral Raise", muscleGroup: "SHOULDERS", equipment: "Dumbbell" },
  { name: "Face Pull", muscleGroup: "SHOULDERS", equipment: "Cable" },
  { name: "Arnold Press", muscleGroup: "SHOULDERS", equipment: "Dumbbell" },
  { name: "Rear Delt Fly", muscleGroup: "SHOULDERS", equipment: "Dumbbell" },
  { name: "Upright Row", muscleGroup: "SHOULDERS", equipment: "Barbell" },

  // Arms
  { name: "Barbell Bicep Curl", muscleGroup: "ARMS", equipment: "Barbell" },
  { name: "Hammer Curl", muscleGroup: "ARMS", equipment: "Dumbbell" },
  { name: "Preacher Curl", muscleGroup: "ARMS", equipment: "Barbell" },
  { name: "Tricep Pushdown", muscleGroup: "ARMS", equipment: "Cable" },
  { name: "Overhead Tricep Extension", muscleGroup: "ARMS", equipment: "Dumbbell" },
  { name: "Skull Crushers", muscleGroup: "ARMS", equipment: "Barbell" },
  { name: "Close-Grip Bench Press", muscleGroup: "ARMS", equipment: "Barbell" },

  // Core
  { name: "Plank", muscleGroup: "CORE", equipment: "Bodyweight" },
  { name: "Hanging Leg Raise", muscleGroup: "CORE", equipment: "Bodyweight" },
  { name: "Cable Crunch", muscleGroup: "CORE", equipment: "Cable" },
  { name: "Russian Twist", muscleGroup: "CORE", equipment: "Bodyweight" },
  { name: "Ab Wheel Rollout", muscleGroup: "CORE", equipment: "Bodyweight" },

  // Full body
  { name: "Clean and Press", muscleGroup: "FULL_BODY", equipment: "Barbell" },
  { name: "Kettlebell Swing", muscleGroup: "FULL_BODY", equipment: "Kettlebell" },
  { name: "Burpees", muscleGroup: "FULL_BODY", equipment: "Bodyweight" },
  { name: "Thrusters", muscleGroup: "FULL_BODY", equipment: "Barbell" },

  // Cardio
  { name: "Treadmill Running", muscleGroup: "CARDIO", equipment: "Machine" },
  { name: "Rowing Machine", muscleGroup: "CARDIO", equipment: "Machine" },
  { name: "Stationary Bike", muscleGroup: "CARDIO", equipment: "Machine" },
  { name: "Jump Rope", muscleGroup: "CARDIO", equipment: "Bodyweight" },
  { name: "Elliptical", muscleGroup: "CARDIO", equipment: "Machine" },
];
