import { GlassCard } from "@/components/ui/GlassCard";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Settings</h1>
      <GlassCard className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-primary">Appearance</p>
          <p className="text-xs text-text-tertiary">Dark mode is the default experience.</p>
        </div>
        <ThemeToggle />
      </GlassCard>
      <GlassCard className="mt-4">
        <p className="text-sm text-text-secondary">
          Profile editing, units, notifications and supplement reminders land in the next build phase.
        </p>
      </GlassCard>
    </main>
  );
}
