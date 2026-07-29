import { LogOut } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PushSubscribeCard } from "@/components/settings/PushSubscribeCard";
import { RemindersCard, type ReminderRow } from "@/components/settings/RemindersCard";
import {
  WearableConnectionsCard,
  type WearableConnectionRow,
} from "@/components/settings/WearableConnectionsCard";
import { db } from "@/lib/db";
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

  const [reminders, wearableConnections] = await Promise.all([
    user
      ? db.reminder.findMany({ where: { userId: user.id }, orderBy: { time: "asc" } })
      : Promise.resolve([]),
    user ? db.wearableConnection.findMany({ where: { userId: user.id } }) : Promise.resolve([]),
  ]);

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

      <Card className="mt-4">
        <p className="text-sm text-text-secondary">
          Profile editing, units, and full micronutrient targets land in a future update.
        </p>
      </Card>

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
    </main>
  );
}
