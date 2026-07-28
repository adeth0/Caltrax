"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { WearableProvider } from "@prisma/client";
import { db } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";
import { syncWearableConnection } from "@/lib/wearables/sync";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

const REMINDER_TYPES = ["meal", "water", "exercise", "weight_check", "supplement", "custom"] as const;
export type ReminderType = (typeof REMINDER_TYPES)[number];

interface CreateReminderInput {
  type: ReminderType;
  label: string;
  time: string; // "HH:mm"
}

export async function createReminderAction(input: CreateReminderInput) {
  const userId = await requireUserId();

  if (!REMINDER_TYPES.includes(input.type)) throw new Error("Invalid reminder type");
  if (!input.label.trim()) throw new Error("Enter a label");
  if (!/^\d{2}:\d{2}$/.test(input.time)) throw new Error("Invalid time");

  await db.reminder.create({
    data: { userId, type: input.type, label: input.label.trim(), time: input.time },
  });

  revalidatePath("/settings");
}

export async function toggleReminderActiveAction(id: string, active: boolean) {
  const userId = await requireUserId();
  await db.reminder.updateMany({ where: { id, userId }, data: { active } });
  revalidatePath("/settings");
}

export async function deleteReminderAction(id: string) {
  const userId = await requireUserId();
  await db.reminder.deleteMany({ where: { id, userId } });
  revalidatePath("/settings");
}

interface SubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export async function subscribeToPushAction(sub: SubscriptionInput) {
  const userId = await requireUserId();
  await db.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    create: { userId, endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
    update: { userId, p256dh: sub.p256dh, auth: sub.auth },
  });
  revalidatePath("/settings");
}

export async function unsubscribeFromPushAction(endpoint: string) {
  await db.pushSubscription.deleteMany({ where: { endpoint } });
  revalidatePath("/settings");
}

export async function updateTimezoneAction(timezone: string) {
  const userId = await requireUserId();
  // Defensive check — Intl.DateTimeFormat gives real IANA zones, but never
  // trust a client-supplied string going into a DB column unvalidated.
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
  } catch {
    return;
  }
  await db.profile.update({ where: { id: userId }, data: { timezone } });
}

export async function sendTestPushAction() {
  const userId = await requireUserId();
  const subs = await db.pushSubscription.count({ where: { userId } });
  if (subs === 0) {
    throw new Error("No active notification subscription on this device yet.");
  }
  await sendPushToUser(userId, {
    title: "Caltrax",
    body: "Notifications are working! You'll get reminders like this.",
    url: "/dashboard",
  });
}

/** No sign-out path existed anywhere in the app — this closes that gap. */
export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function disconnectWearableAction(provider: WearableProvider) {
  const userId = await requireUserId();
  await db.wearableConnection.deleteMany({ where: { userId, provider } });
  revalidatePath("/settings");
}

export async function manualSyncWearableAction(provider: WearableProvider) {
  const userId = await requireUserId();
  const connection = await db.wearableConnection.findUnique({
    where: { userId_provider: { userId, provider } },
  });
  if (!connection) throw new Error("Not connected");
  await syncWearableConnection(connection);
  revalidatePath("/settings");
}
