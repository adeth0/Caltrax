import { Card } from "@/components/ui/Card";

export default function FoodsLoading() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:max-w-4xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-24 animate-pulse rounded bg-surface-raised" />
          <div className="h-4 w-64 animate-pulse rounded bg-surface-raised" />
        </div>
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-control bg-surface-raised" />
      </div>
      <div className="mb-4 h-11 animate-pulse rounded-control bg-surface-raised" />
      <div className="flex flex-col gap-2">
        <Card className="h-16 animate-pulse bg-surface-raised" />
        <Card className="h-16 animate-pulse bg-surface-raised" />
        <Card className="h-16 animate-pulse bg-surface-raised" />
        <Card className="h-16 animate-pulse bg-surface-raised" />
      </div>
    </main>
  );
}
