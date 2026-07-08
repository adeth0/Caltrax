import { GlassCard } from "@/components/ui/GlassCard";

export default function ProgressPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Progress</h1>
      <GlassCard className="mt-4">
        <p className="text-sm text-text-secondary">
          Weight history, body measurements and full nutrition trend charts land in the next build phase.
        </p>
      </GlassCard>
    </main>
  );
}
