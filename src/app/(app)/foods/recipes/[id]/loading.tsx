import { Card } from "@/components/ui/Card";

export default function RecipeDetailLoading() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <div className="mb-3 h-9 w-20 animate-pulse rounded-full bg-surface-raised" />
      <div className="mb-4 h-48 w-full animate-pulse rounded-2xl bg-surface-raised" />
      <div className="mb-2 h-7 w-2/3 animate-pulse rounded bg-surface-raised" />
      <div className="mb-4 h-4 w-full animate-pulse rounded bg-surface-raised" />
      <Card className="h-24 animate-pulse bg-surface-raised" />
      <Card className="mt-4 h-40 animate-pulse bg-surface-raised" />
      <Card className="mt-4 h-56 animate-pulse bg-surface-raised" />
    </main>
  );
}
