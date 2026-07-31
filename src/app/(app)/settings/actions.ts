"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { WearableProvider } from "@prisma/client";
import { db } from "@/lib/db";
import { ACTIVITY_TO_PRISMA, DIET_TO_PRISMA, GOAL_TO_PRISMA, SEX_TO_PRISMA } from "@/lib/enumMap";
import { sendPushToUser } from "@/lib/push";
import { onboardingSchema } from "@/lib/validations/profile";
import { syncWearableConnection } from "@/lib/wearables/sync";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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

export interface UpdateProfileActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

/**
 * Edits the same fields onboarding collects. Onboarding's own copy has
 * promised "you can change any of this later in Settings" since it was
 * first written -- this is what actually makes that true, replacing the
 * placeholder that used to sit here instead.
 */
export async function updateProfileAction(
  _prevState: UpdateProfileActionState,
  formData: FormData
): Promise<UpdateProfileActionState> {
  const userId = await requireUserId();

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

  await db.profile.update({
    where: { id: userId },
    data: {
      name: input.name || undefined,
      sex: SEX_TO_PRISMA[input.sex],
      age: input.age,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      weightUnit: input.weightUnit,
      heightUnit: input.heightUnit,
      targetWeightKg: input.targetWeightKg ?? null,
      activityLevel: ACTIVITY_TO_PRISMA[input.activityLevel],
      primaryGoal: GOAL_TO_PRISMA[input.primaryGoal] as never,
      dietaryPreference: DIET_TO_PRISMA[input.dietaryPreference] as never,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Permanently deletes the account and every trace of the user's data,
 * both the app's own tables and the Supabase auth user itself. This is
 * irreversible — the confirmation step lives in the calling UI
 * (DeleteAccountCard), which requires typing "DELETE" before this can
 * even be called.
 */
export async function deleteAccountAction() {
  const userId = await requireUserId();

  // Food rows the user created (via meal-photo scan, custom entries, etc.)
  // aren't cascade-deleted with the profile -- they may still be
  // referenced by OTHER users' meal history if the same food was ever
  // logged by someone else too, so deleting them outright could corrupt
  // other people's data. Orphaning (clearing ownership) is the safe
  // equivalent of "this is no longer mine" without risking that.
  await db.food.updateMany({ where: { ownerId: userId }, data: { ownerId: null } });

  // Deletes the Profile row, which cascades to every other app table
  // (meal entries, weight/water logs, reminders, wearable connections,
  // recipes, favourites, planned meals, push subscriptions, achievements)
  // via each relation's onDelete: Cascade.
  await db.profile.delete({ where: { id: userId } });

  // The Profile row is gone, but the actual Supabase auth account (email,
  // password hash, session) still exists until explicitly removed via
  // the admin API -- the regular session-based client has no permission
  // to delete its own auth user.
  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    // App data is already gone at this point -- surface this clearly
    // rather than silently leaving a dangling, dataless auth account.
    console.error("deleteAccountAction: failed to delete auth user after deleting app data:", error);
    throw new Error(
      "Your data was deleted, but removing your login could not be completed. Contact support to finish closing your account."
    );
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/signup?accountDeleted=1");
}
