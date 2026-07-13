"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FoodSearchTab } from "@/components/food/FoodSearchTab";
import { RecipesClient, type RecipeSummary } from "@/components/recipes/RecipesClient";

interface FoodsTabsProps {
  recipes: RecipeSummary[];
}

export function FoodsTabs({ recipes }: FoodsTabsProps) {
  const [tab, setTab] = useState<"search" | "recipes">("search");

  return (
    <div>
      <div className="mb-4 flex gap-2 rounded-control bg-white/5 p-1">
        {(
          [
            { value: "search", label: "Search" },
            { value: "recipes", label: `Recipes${recipes.length > 0 ? ` (${recipes.length})` : ""}` },
          ] as const
        ).map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "control focus-ring touch-target flex-1 px-3 py-2 text-sm font-medium transition-colors",
              tab === t.value
                ? "bg-accent-info/20 text-accent-info"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "search" ? <FoodSearchTab /> : <RecipesClient recipes={recipes} />}
    </div>
  );
}
