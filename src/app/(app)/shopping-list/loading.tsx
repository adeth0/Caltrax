import { Card } from "@/components/ui/Card";

export default function ShoppingListLoading() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <div className="mb-4 flex flex-col gap-2">
        <div className="h-7 w-40 animate-pulse rounded bg-surface-raised" />
        <div className="h-4 w-64 animate-pulse rounded bg-surface-raised" />
      </div>
      <Card className="mb-4 h-14 animate-pulse bg-surface-raised" />
      <div className="flex flex-col gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-11 animate-pulse rounded-control bg-surface-raised" />
        ))}
      </div>
    </main>
  );
}
