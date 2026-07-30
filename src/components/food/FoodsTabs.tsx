"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FoodSearchTab } from "@/components/food/FoodSearchTab";
import type { RecipeSummary } from "@/components/recipes/RecipesClient";
import { FindMealsClient, type CuratedRecipeSummary } from "@/components/recipes/FindMealsClient";
import { MyRecipesClient } from "@/components/recipes/MyRecipesClient";

interface FoodsTabsProps {
  recipes: RecipeSummary[];
  curatedRecipes: CuratedRecipeSummary[];
  communityRecipes: CuratedRecipeSummary[];
  savedRecipes: CuratedRecipeSummary[];
}

type TabValue = "search" | "meals" | "community" | "recipes";

export function FoodsTabs({ recipes, curatedRecipes, communityRecipes, savedRecipes }: FoodsTabsProps) {
  const [tab, setTab] = useState<TabValue>("search");
  const myRecipesCount = recipes.length + savedRecipes.length;

  const tabs: { value: TabValue; label: string }[] = [
    { value: "search", label: "Search" },
    { value: "meals", label: "Find meals" },
    { value: "community", label: "User recipes" },
    { value: "recipes", label: `My recipes${myRecipesCount > 0 ? ` (${myRecipesCount})` : ""}` },
  ];

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto rounded-control bg-surface-raised p-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "control focus-ring touch-target shrink-0 px-3 py-2 text-sm font-medium transition-colors",
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
      {tab === "community" && (
        <FindMealsClient
          recipes={communityRecipes}
          emptyMessage="No shared recipes yet — be the first to publish one from My Recipes."
        />
      )}
      {tab === "recipes" && <MyRecipesClient savedRecipes={savedRecipes} createdRecipes={recipes} />}
    </div>
  );
}
