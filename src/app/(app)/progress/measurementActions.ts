"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type MeasurementTypeValue =
  | "WAIST"
  | "CHEST"
  | "HIPS"
  | "NECK"
  | "SHOULDERS"
  | "LEFT_ARM"
  | "RIGHT_ARM"
  | "LEFT_THIGH"
  | "RIGHT_THIGH"
  | "LEFT_CALF"
  | "RIGHT_CALF";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export async function logMeasurementAction(type: MeasurementTypeValue, valueCm: number) {
  const userId = await requireUserId();
  if (!Number.isFinite(valueCm) || valueCm <= 0 || valueCm > 300) {
    throw new Error("Enter a valid measurement in cm");
  }

  await db.bodyMeasurement.create({
    data: { userId, type, valueCm },
  });
  revalidatePath("/progress");
}

export async function deleteMeasurementAction(id: string) {
  const userId = await requireUserId();
  await db.bodyMeasurement.deleteMany({ where: { id, userId } });
  revalidatePath("/progress");
}

/** History for a single measurement type, oldest first -- for the trend chart. */
export async function getMeasurementHistoryAction(
  type: MeasurementTypeValue
): Promise<{ date: string; valueCm: number }[]> {
  const userId = await requireUserId();

  const rows = await db.bodyMeasurement.findMany({
    where: { userId, type },
    orderBy: { loggedAt: "asc" },
  });

  return rows.map((r: (typeof rows)[number]) => ({
    date: r.loggedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    valueCm: r.valueCm,
  }));
}
