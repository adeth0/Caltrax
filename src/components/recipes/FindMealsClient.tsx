"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Coffee, Croissant, Salad, Soup, Star, UtensilsCrossed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type MealCategoryValue = "BREAKFAST" | "BRUNCH" | "LUNCH" | "TEA" | "SNACK";

export interface CuratedRecipeSummary {
  id: string;
  name: string;
  description: string | null;
  category: MealCategoryValue | null;
  imageUrl: string | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  caloriesPerServing: number;
  averageRating: number | null;
  ratingCount: number;
}

const CATEGORY_META: Record<MealCategoryValue, { label: string; icon: typeof Coffee; colorClass: string }> = {
  BREAKFAST: { label: "Breakfast", icon: Coffee, colorClass: "text-macro-carbs" },
  BRUNCH: { label: "Brunch", icon: Croissant, colorClass: "text-brand" },
  LUNCH: { label: "Lunch", icon: Salad, colorClass: "text-macro-fibre" },
  TEA: { label: "Tea", icon: Soup, colorClass: "text-macro-protein" },
  SNACK: { label: "Snack", icon: UtensilsCrossed, colorClass: "text-macro-fat" },
};

const CATEGORY_FILTERS: { value: MealCategoryValue | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "BRUNCH", label: "Brunch" },
  { value: "LUNCH", label: "Lunch" },
  { value: "TEA", label: "Tea" },
  { value: "SNACK", label: "Snack" },
];

type SortMode = "recommended" | "rated" | "newest";

function RecipeThumbnail({ recipe }: { recipe: CuratedRecipeSummary }) {
  if (recipe.imageUrl) {
    return (
      <Image
        src={recipe.imageUrl}
        alt=""
        width={200}
        height={140}
        unoptimized
        className="h-32 w-full rounded-t-card object-cover"
      />
    );
  }
  const meta = recipe.category ? CATEGORY_META[recipe.category] : CATEGORY_META.LUNCH;
  const Icon = meta.icon;
  return (
    <div className="flex h-32 w-full items-center justify-center rounded-t-card bg-surface-raised">
      <Icon className={cn("h-9 w-9", meta.colorClass)} strokeWidth={1.5} />
    </div>
  );
}

export function FindMealsClient({ recipes }: { recipes: CuratedRecipeSummary[] }) {
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

      <div className="mb-4 flex gap-2">
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
        <p className="py-8 text-center text-sm text-text-tertiary">No meals match that search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/foods/recipes/${recipe.id}`}
              className="control focus-ring card-surface overflow-hidden"
            >
              <RecipeThumbnail recipe={recipe} />
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-text-primary">{recipe.name}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-text-tertiary">
                  <span className="tabular-nums">{recipe.caloriesPerServing} kcal</span>
                  {recipe.averageRating !== null ? (
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-accent-warning text-accent-warning" />
                      {recipe.averageRating.toFixed(1)}
                    </span>
                  ) : (
                    (recipe.prepMinutes ?? 0) + (recipe.cookMinutes ?? 0) > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {(recipe.prepMinutes ?? 0) + (recipe.cookMinutes ?? 0)}m
                      </span>
                    )
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
