import { Card } from "@/components/ui/Card";

export default function SettingsLoading() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:max-w-4xl">
      <div className="mb-4 flex flex-col gap-2">
        <div className="h-7 w-28 animate-pulse rounded bg-surface-raised" />
        <div className="h-4 w-48 animate-pulse rounded bg-surface-raised" />
      </div>
      <div className="flex flex-col gap-4">
        <Card className="h-32 animate-pulse bg-surface-raised" />
        <Card className="h-24 animate-pulse bg-surface-raised" />
        <Card className="h-40 animate-pulse bg-surface-raised" />
        <Card className="h-24 animate-pulse bg-surface-raised" />
      </div>
    </main>
  );
}
