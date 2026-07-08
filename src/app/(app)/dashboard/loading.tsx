import { GlassCard } from "@/components/ui/GlassCard";

export default function DashboardLoading() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-4 pb-24 sm:p-6">
      {[0, 1, 2, 3].map((i) => (
        <GlassCard key={i} className="h-28 animate-pulse bg-white/5" />
      ))}
    </main>
  );
}
