import { LogOut } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DeleteAccountCard } from "@/components/settings/DeleteAccountCard";
import { DataExportCard } from "@/components/settings/DataExportCard";
import { ProfileEditCard, type ProfileFormValues } from "@/components/settings/ProfileEditCard";
import { GoalPresetsCard, type GoalPresetSummary } from "@/components/settings/GoalPresetsCard";
import { PushSubscribeCard } from "@/components/settings/PushSubscribeCard";
import { RemindersCard, type ReminderRow } from "@/components/settings/RemindersCard";
import {
  WearableConnectionsCard,
  type WearableConnectionRow,
} from "@/components/settings/WearableConnectionsCard";
import { db, withPreparedStatementRetry } from "@/lib/db";
import { ACTIVITY_FROM_PRISMA, DIET_FROM_PRISMA, GOAL_FROM_PRISMA, SEX_FROM_PRISMA } from "@/lib/enumMap";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PROVIDERS } from "@/lib/wearables";
import { signOutAction } from "./actions";

interface SettingsPageProps {
  searchParams: Promise<{ wearable_connected?: string; wearable_error?: string; provider?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [reminders, wearableConnections, profile, goalPresets] = await Promise.all([
    user
      ? db.reminder.findMany({ where: { userId: user.id }, orderBy: { time: "asc" } })
      : Promise.resolve([]),
    user ? db.wearableConnection.findMany({ where: { userId: user.id } }) : Promise.resolve([]),
    user
      ? withPreparedStatementRetry(() => db.profile.findUnique({ where: { id: user.id } }))
      : Promise.resolve(null),
    user
      ? db.goalPreset.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
      : Promise.resolve([]),
  ]);

  const profileFormValues: ProfileFormValues | null = profile
    ? {
        name: profile.name ?? "",
        sex: SEX_FROM_PRISMA[profile.sex],
        age: profile.age,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        targetWeightKg: profile.targetWeightKg,
        activityLevel: ACTIVITY_FROM_PRISMA[profile.activityLevel],
        primaryGoal: GOAL_FROM_PRISMA[profile.primaryGoal],
        dietaryPreference: DIET_FROM_PRISMA[profile.dietaryPreference],
        weightUnit: profile.weightUnit === "lbs" ? "lbs" : "kg",
        heightUnit: profile.heightUnit === "ft" ? "ft" : "cm",
      }
    : null;

  const goalPresetSummaries: GoalPresetSummary[] = goalPresets.map((p: (typeof goalPresets)[number]) => ({
    id: p.id,
    name: p.name,
  }));

  const currentGoalSettings = profile
    ? {
        name: "",
        primaryGoal: GOAL_FROM_PRISMA[profile.primaryGoal],
        activityLevel: ACTIVITY_FROM_PRISMA[profile.activityLevel],
        dietaryPreference: DIET_FROM_PRISMA[profile.dietaryPreference],
        targetWeightKg: profile.targetWeightKg,
      }
    : null;

  const reminderRows: ReminderRow[] = reminders.map((r: (typeof reminders)[number]) => ({
    id: r.id,
    type: r.type as ReminderRow["type"],
    label: r.label,
    time: r.time,
    active: r.active,
  }));

  const wearableRows: WearableConnectionRow[] = Object.values(PROVIDERS).map((adapter) => {
    const existing = wearableConnections.find(
      (c: (typeof wearableConnections)[number]) => c.provider === adapter.id
    );
    return {
      provider: adapter.id,
      label: adapter.label,
      description: adapter.description,
      connected: Boolean(existing),
      lastSyncedAt: existing?.lastSyncedAt ? existing.lastSyncedAt.toLocaleString() : null,
      lastSyncError: existing?.lastSyncError ?? null,
    };
  });

  const wearableNotice = params.wearable_connected
    ? { type: "connected" as const, provider: params.wearable_connected }
    : params.wearable_error
      ? { type: "error" as const, provider: params.provider, error: params.wearable_error }
      : undefined;

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-text-primary">Settings</h1>

      <Card className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-primary">Appearance</p>
          <p className="text-xs text-text-tertiary">Dark mode is the default experience.</p>
        </div>
        <ThemeToggle />
      </Card>

      <div className="mt-4">
        <PushSubscribeCard />
      </div>

      <div className="mt-4">
        <RemindersCard reminders={reminderRows} />
      </div>

      <div className="mt-4">
        <WearableConnectionsCard connections={wearableRows} notice={wearableNotice} />
      </div>

      {profileFormValues && (
        <div className="mt-4">
          <ProfileEditCard initial={profileFormValues} />
        </div>
      )}

      {currentGoalSettings && (
        <div className="mt-4">
          <GoalPresetsCard presets={goalPresetSummaries} currentSettings={currentGoalSettings} />
        </div>
      )}

      <Card className="mt-4">
        <p className="mb-3 text-sm font-medium text-text-primary">Account</p>
        {user?.email && <p className="mb-3 text-xs text-text-tertiary">Signed in as {user.email}</p>}
        <form action={signOutAction}>
          <Button type="submit" variant="secondary" className="w-full text-accent-danger">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </Card>

      <div className="mt-4">
        <DataExportCard />
      </div>

      <div className="mt-4">
        <DeleteAccountCard />
      </div>
    </main>
  );
}
