"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export async function logWeightAction(weightKg: number, bodyFatPct?: number) {
  const userId = await requireUserId();
  if (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 400) {
    throw new Error("Enter a valid weight");
  }

  await db.weightLog.create({
    data: { userId, weightKg, bodyFatPct: bodyFatPct ?? null },
  });

  // Keep Profile.weightKg (used by the goal engine) in sync with the latest log.
  await db.profile.update({ where: { id: userId }, data: { weightKg } });

  revalidatePath("/progress");
  revalidatePath("/dashboard");
}

export async function logWaterAction(amountMl: number) {
  const userId = await requireUserId();
  if (!Number.isFinite(amountMl) || amountMl <= 0) throw new Error("Enter a valid amount");

  await db.waterLog.create({ data: { userId, amountMl } });

  revalidatePath("/progress");
  revalidatePath("/dashboard");
}

export async function deleteWeightLogAction(id: string) {
  const userId = await requireUserId();
  await db.weightLog.deleteMany({ where: { id, userId } });
  revalidatePath("/progress");
  revalidatePath("/dashboard");
}
