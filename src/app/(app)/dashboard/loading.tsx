import { Card } from "@/components/ui/Card";

export default function DashboardLoading() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-4 pb-24 sm:p-6">
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} className="h-28 animate-pulse bg-surface-raised" />
      ))}
    </main>
  );
}
