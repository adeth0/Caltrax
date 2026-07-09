"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ACTIVITY_TO_PRISMA, DIET_TO_PRISMA, GOAL_TO_PRISMA, SEX_TO_PRISMA } from "@/lib/enumMap";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validations/profile";

export interface OnboardingActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createProfile(
  _prevState: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = onboardingSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const input = parsed.data;

  await db.profile.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      name: input.name || user.email?.split("@")[0] || null,
      sex: SEX_TO_PRISMA[input.sex],
      age: input.age,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      targetWeightKg: input.targetWeightKg ?? null,
      activityLevel: ACTIVITY_TO_PRISMA[input.activityLevel],
      primaryGoal: GOAL_TO_PRISMA[input.primaryGoal] as never,
      dietaryPreference: DIET_TO_PRISMA[input.dietaryPreference] as never,
      dailyWaterGoalMl: Math.round(input.weightKg * 33),
    },
    update: {
      name: input.name || undefined,
      sex: SEX_TO_PRISMA[input.sex],
      age: input.age,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      targetWeightKg: input.targetWeightKg ?? null,
      activityLevel: ACTIVITY_TO_PRISMA[input.activityLevel],
      primaryGoal: GOAL_TO_PRISMA[input.primaryGoal] as never,
      dietaryPreference: DIET_TO_PRISMA[input.dietaryPreference] as never,
    },
  });

  redirect("/dashboard");
}
