"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Apple, ChevronRight, Dumbbell, Moon, Pill } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type KnowledgeCategoryValue = "NUTRITION_BASICS" | "SUPPLEMENTS" | "TRAINING" | "RECOVERY";

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  category: KnowledgeCategoryValue;
  summary: string;
}

export const CATEGORY_META: Record<
  KnowledgeCategoryValue,
  { label: string; icon: typeof Apple; colorClass: string }
> = {
  NUTRITION_BASICS: { label: "Nutrition Basics", icon: Apple, colorClass: "text-macro-carbs" },
  SUPPLEMENTS: { label: "Supplements", icon: Pill, colorClass: "text-brand" },
  TRAINING: { label: "Training", icon: Dumbbell, colorClass: "text-macro-protein" },
  RECOVERY: { label: "Recovery", icon: Moon, colorClass: "text-accent-info" },
};

const CATEGORY_FILTERS: { value: KnowledgeCategoryValue | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "NUTRITION_BASICS", label: "Nutrition" },
  { value: "SUPPLEMENTS", label: "Supplements" },
  { value: "TRAINING", label: "Training" },
  { value: "RECOVERY", label: "Recovery" },
];

export function LearnClient({ articles }: { articles: ArticleSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<KnowledgeCategoryValue | "all">("all");

  const filtered = useMemo(() => {
    let list = articles;
    if (category !== "all") list = list.filter((a) => a.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
    }
    return list;
  }, [articles, query, category]);

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6 lg:max-w-4xl">
      <header className="mb-5 flex flex-col items-center text-center">
        <Image src="/icons/icon-192.png" alt="" width={44} height={44} className="rounded-xl" />
        <h1 className="mt-3 font-display text-2xl font-bold text-text-primary">Learn</h1>
        <p className="mt-1 max-w-sm text-sm text-text-tertiary">
          Real, science-grounded articles on nutrition, supplements, training, and recovery.
        </p>
      </header>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search — try "creatine" or "protein"…'
        className="mb-3"
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_FILTERS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={cn(
              "control focus-ring touch-target shrink-0 px-3 py-1.5 text-sm font-medium",
              category === c.value
                ? "bg-brand text-brand-foreground"
                : "bg-surface-raised text-text-secondary hover:bg-border-strong"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-tertiary">No articles match that search.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((article) => {
            const meta = CATEGORY_META[article.category];
            const Icon = meta.icon;
            return (
              <Link key={article.id} href={`/learn/${article.slug}`}>
                <Card padded={false} hoverable className="flex items-center gap-3 p-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-raised",
                      meta.colorClass
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">{article.title}</p>
                    <p className="truncate text-xs text-text-tertiary">{article.summary}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary" />
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
