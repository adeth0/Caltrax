import { Card } from "@/components/ui/Card";

export default function DashboardLoading() {
  return (
    <main className="p-4 pb-24 sm:p-6 lg:mx-auto lg:max-w-[1400px] lg:pb-6">
      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:items-start lg:gap-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card className="h-40 animate-pulse bg-surface-raised" />
          <Card className="h-28 animate-pulse bg-surface-raised" />
        </div>
        <div className="flex flex-col gap-4">
          <Card className="h-40 animate-pulse bg-surface-raised" />
          <Card className="h-24 animate-pulse bg-surface-raised" />
          <Card className="h-40 animate-pulse bg-surface-raised" />
        </div>
      </div>
    </main>
  );
}
