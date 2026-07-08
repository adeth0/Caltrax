import { GlassCard } from "@/components/ui/GlassCard";

export default function LogPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Log a meal</h1>
      <GlassCard className="mt-4">
        <p className="text-sm text-text-secondary">
          Food search, barcode scanning and meal logging land in the next build phase — see the README
          roadmap.
        </p>
      </GlassCard>
    </main>
  );
}
