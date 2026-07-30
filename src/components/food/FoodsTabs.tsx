"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FoodSearchTab } from "@/components/food/FoodSearchTab";
import { RecipesClient, type RecipeSummary } from "@/components/recipes/RecipesClient";
import { FindMealsClient, type CuratedRecipeSummary } from "@/components/recipes/FindMealsClient";

interface FoodsTabsProps {
  recipes: RecipeSummary[];
  curatedRecipes: CuratedRecipeSummary[];
  savedRecipeIds: string[];
}

export function FoodsTabs({ recipes, curatedRecipes }: FoodsTabsProps) {
  const [tab, setTab] = useState<"search" | "meals" | "recipes">("search");

  return (
    <div>
      <div className="mb-4 flex gap-2 rounded-control bg-surface-raised p-1">
        {(
          [
            { value: "search", label: "Search" },
            { value: "meals", label: "Find meals" },
            { value: "recipes", label: `My recipes${recipes.length > 0 ? ` (${recipes.length})` : ""}` },
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

      {tab === "search" && <FoodSearchTab />}
      {tab === "meals" && <FindMealsClient recipes={curatedRecipes} />}
      {tab === "recipes" && <RecipesClient recipes={recipes} />}
    </div>
  );
}
