"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  ACTIVITY_TO_PRISMA,
  ACTIVITY_FROM_PRISMA,
  DIET_TO_PRISMA,
  DIET_FROM_PRISMA,
  GOAL_TO_PRISMA,
  GOAL_FROM_PRISMA,
} from "@/lib/enumMap";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActivityLevel, DietaryPreference, PrimaryGoal } from "@/types";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export interface GoalPresetInput {
  name: string;
  primaryGoal: PrimaryGoal;
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  targetWeightKg: number | null;
}

export async function saveGoalPresetAction(input: GoalPresetInput) {
  const userId = await requireUserId();
  const trimmedName = input.name.trim();
  if (!trimmedName) throw new Error("Enter a name for this preset");

  await db.goalPreset.upsert({
    where: { userId_name: { userId, name: trimmedName } },
    create: {
      userId,
      name: trimmedName,
      primaryGoal: GOAL_TO_PRISMA[input.primaryGoal],
      activityLevel: ACTIVITY_TO_PRISMA[input.activityLevel],
      dietaryPreference: DIET_TO_PRISMA[input.dietaryPreference],
      targetWeightKg: input.targetWeightKg,
    },
    update: {
      primaryGoal: GOAL_TO_PRISMA[input.primaryGoal],
      activityLevel: ACTIVITY_TO_PRISMA[input.activityLevel],
      dietaryPreference: DIET_TO_PRISMA[input.dietaryPreference],
      targetWeightKg: input.targetWeightKg,
    },
  });

  revalidatePath("/settings");
}

/**
 * Overwrites the live profile's goal-related fields with a saved
 * preset's values -- a preset is a snapshot to restore FROM, not a
 * continuously-synced alternate profile, so activating one is a
 * one-time write, same as manually editing the settings form.
 */
export async function activateGoalPresetAction(presetId: string): Promise<{
  primaryGoal: PrimaryGoal;
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  targetWeightKg: number | null;
}> {
  const userId = await requireUserId();

  const preset = await db.goalPreset.findFirst({ where: { id: presetId, userId } });
  if (!preset) throw new Error("Preset not found");

  await db.profile.update({
    where: { id: userId },
    data: {
      primaryGoal: preset.primaryGoal,
      activityLevel: preset.activityLevel,
      dietaryPreference: preset.dietaryPreference,
      targetWeightKg: preset.targetWeightKg,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/progress");

  return {
    primaryGoal: GOAL_FROM_PRISMA[preset.primaryGoal],
    activityLevel: ACTIVITY_FROM_PRISMA[preset.activityLevel],
    dietaryPreference: DIET_FROM_PRISMA[preset.dietaryPreference],
    targetWeightKg: preset.targetWeightKg,
  };
}

export async function deleteGoalPresetAction(presetId: string) {
  const userId = await requireUserId();
  await db.goalPreset.deleteMany({ where: { id: presetId, userId } });
  revalidatePath("/settings");
}
