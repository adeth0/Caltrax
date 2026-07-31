"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CuratedRecipeCard, type CuratedRecipeSummary } from "./CuratedRecipeCard";
import { type MealCategoryValue } from "./recipeCategoryMeta";

export type { CuratedRecipeSummary, MealCategoryValue };

const CATEGORY_FILTERS: { value: MealCategoryValue | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "BRUNCH", label: "Brunch" },
  { value: "LUNCH", label: "Lunch" },
  { value: "TEA", label: "Tea" },
  { value: "SNACK", label: "Snack" },
];

type SortMode = "recommended" | "rated" | "newest";

export function FindMealsClient({
  recipes,
  emptyMessage = "No meals match that search.",
}: {
  recipes: CuratedRecipeSummary[];
  emptyMessage?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MealCategoryValue | "all">("all");
  const [sort, setSort] = useState<SortMode>("recommended");

  const filtered = useMemo(() => {
    let list = recipes;
    if (category !== "all") list = list.filter((r) => r.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
    }

    const sorted = [...list];
    if (sort === "rated") {
      sorted.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
    } else if (sort === "recommended") {
      // Weighted so a handful of 5-star ratings doesn't outrank a
      // consistently well-rated recipe with more votes -- a simple
      // Bayesian-ish blend toward the overall average.
      const overallAvg =
        recipes.filter((r) => r.averageRating !== null).reduce((s, r) => s + (r.averageRating ?? 0), 0) /
        Math.max(1, recipes.filter((r) => r.averageRating !== null).length);
      const CONFIDENCE = 3;
      const score = (r: CuratedRecipeSummary) =>
        ((r.averageRating ?? overallAvg) * r.ratingCount + overallAvg * CONFIDENCE) /
        (r.ratingCount + CONFIDENCE);
      sorted.sort((a, b) => score(b) - score(a));
    }
    // "newest" keeps the incoming order (already newest-first from the server query).
    return sorted;
  }, [recipes, query, category, sort]);

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search meals…"
        className="mb-3"
      />

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
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

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { value: "recommended", label: "Recommended" },
            { value: "rated", label: "Best rated" },
            { value: "newest", label: "Newest" },
          ] as const
        ).map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setSort(s.value)}
            className={cn(
              "control focus-ring touch-target px-3 py-1.5 text-xs font-medium",
              sort === s.value ? "text-brand" : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-tertiary">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((recipe) => (
            <CuratedRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
