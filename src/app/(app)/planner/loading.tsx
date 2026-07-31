import { Card } from "@/components/ui/Card";

export default function PlannerLoading() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:max-w-4xl">
      <div className="mb-4 flex flex-col gap-2">
        <div className="h-7 w-40 animate-pulse rounded bg-surface-raised" />
        <div className="h-4 w-56 animate-pulse rounded bg-surface-raised" />
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-20 animate-pulse bg-surface-raised" />
        ))}
      </div>
    </main>
  );
}
