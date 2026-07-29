import { LogOut } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PushSubscribeCard } from "@/components/settings/PushSubscribeCard";
import { RemindersCard, type ReminderRow } from "@/components/settings/RemindersCard";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "./actions";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const reminders = user
    ? await db.reminder.findMany({ where: { userId: user.id }, orderBy: { time: "asc" } })
    : [];

  const reminderRows: ReminderRow[] = reminders.map((r: (typeof reminders)[number]) => ({
    id: r.id,
    type: r.type as ReminderRow["type"],
    label: r.label,
    time: r.time,
    active: r.active,
  }));

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
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
