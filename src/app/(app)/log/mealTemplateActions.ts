"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getTodayRange } from "@/lib/dates";
import { MEAL_TO_PRISMA } from "@/lib/enumMap";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MealType } from "@/types";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

/**
 * Saves today's entries for one meal type as a reusable template.
 * Direct parallel to saveRoutineFromTodayAction for workouts, but
 * captures actual gram amounts too (unlike a workout routine) -- a meal
 * genuinely is the same combination and portions each time someone eats
 * it that way, not something that needs re-deciding per use.
 */
export async function saveMealTemplateAction(name: string, mealType: MealType) {
  const userId = await requireUserId();
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Enter a name for this template");

  const { start, end } = getTodayRange();
  const entries = await db.mealEntry.findMany({
    where: {
      userId,
      mealType: MEAL_TO_PRISMA[mealType],
      loggedAt: { gte: start, lte: end },
    },
  });
  if (entries.length === 0) {
    throw new Error(`Log something to ${mealType} today before saving a template`);
  }

  await db.mealTemplate.create({
    data: {
      userId,
      name: trimmedName,
      items: {
        create: entries.map((e: (typeof entries)[number]) => ({
          foodId: e.foodId,
          servingGrams: e.servingUnitG,
        })),
      },
    },
  });

  revalidatePath("/log");
}

/** Logs every item in a template as a fresh MealEntry, at the current time, under the given meal type. */
export async function logMealTemplateAction(templateId: string, mealType: MealType) {
  const userId = await requireUserId();

  const template = await db.mealTemplate.findFirst({
    where: { id: templateId, userId },
    include: { items: true },
  });
  if (!template) throw new Error("Template not found");

  await db.mealEntry.createMany({
    data: template.items.map((item: (typeof template.items)[number]) => ({
      userId,
      foodId: item.foodId,
      mealType: MEAL_TO_PRISMA[mealType],
      servingQuantity: 1,
      servingUnitG: item.servingGrams,
    })),
  });

  revalidatePath("/log");
  revalidatePath("/dashboard");
}

export async function deleteMealTemplateAction(templateId: string) {
  const userId = await requireUserId();
  await db.mealTemplate.deleteMany({ where: { id: templateId, userId } });
  revalidatePath("/log");
}
