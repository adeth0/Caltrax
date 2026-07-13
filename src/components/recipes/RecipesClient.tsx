"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { deleteRecipeAction, logRecipeAction } from "@/app/(app)/foods/actions";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import type { MealType } from "@/types";

const MEAL_OPTIONS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export interface RecipeSummary {
  id: string;
  name: string;
  servings: number;
  ingredientCount: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
}

interface RecipesClientProps {
  recipes: RecipeSummary[];
}

export function RecipesClient({ recipes }: RecipesClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [servingsEaten, setServingsEaten] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [isLogging, startLogging] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  function openLogPanel(recipeId: string) {
    setLoggingId(recipeId);
    setServingsEaten("1");
    setError(null);
  }

  function handleLog() {
    if (!loggingId) return;
    const servings = Number(servingsEaten);
    if (!Number.isFinite(servings) || servings <= 0) {
      setError("Enter a valid number of servings");
      return;
    }
    setError(null);
    startLogging(async () => {
      try {
        await logRecipeAction(loggingId, mealType, servings);
        setLoggingId(null);
        router.refresh();
      } catch {
        setError("Couldn't log that recipe — try again.");
      }
    });
  }

  function handleDelete(recipeId: string) {
    startDeleting(async () => {
      await deleteRecipeAction(recipeId);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {!showForm && (
        <Button type="button" onClick={() => setShowForm(true)} className="w-full">
          + New recipe
        </Button>
      )}

      {showForm && (
        <RecipeForm
          onSaved={() => {
            setShowForm(false);
            router.refresh();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {recipes.length === 0 && !showForm && (
        <GlassCard>
          <p className="text-sm text-text-tertiary">
            No recipes yet — bundle foods you eat together (like a breakfast bowl or a protein shake) so you
            can log the whole thing in one tap.
          </p>
        </GlassCard>
      )}

      {recipes.map((recipe) => (
        <GlassCard key={recipe.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-text-primary">{recipe.name}</p>
              <p className="text-xs text-text-tertiary">
                {recipe.servings} servings · {recipe.ingredientCount} ingredient
                {recipe.ingredientCount === 1 ? "" : "s"}
              </p>
            </div>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => handleDelete(recipe.id)}
              className="touch-target focus-ring shrink-0 text-xs text-text-tertiary hover:text-accent-danger"
            >
              Delete
            </button>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {Math.round(recipe.caloriesPerServing)}
              </p>
              <p className="text-[10px] text-text-tertiary">kcal/serving</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-macro-protein">
                {Math.round(recipe.proteinPerServing)}g
              </p>
              <p className="text-[10px] text-text-tertiary">Protein</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-macro-carbs">{Math.round(recipe.carbsPerServing)}g</p>
              <p className="text-[10px] text-text-tertiary">Carbs</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-macro-fat">{Math.round(recipe.fatPerServing)}g</p>
              <p className="text-[10px] text-text-tertiary">Fat</p>
            </div>
          </div>

          {loggingId !== recipe.id ? (
            <Button
              type="button"
              variant="glass"
              onClick={() => openLogPanel(recipe.id)}
              className="mt-3 w-full"
            >
              Log this recipe
            </Button>
          ) : (
            <div className="mt-3 flex flex-col gap-3 rounded-control border border-accent-info/30 bg-accent-info/10 p-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {MEAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMealType(opt.value)}
                    className={cn(
                      "control focus-ring touch-target shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-colors",
                      mealType === opt.value
                        ? "bg-accent-info/20 text-accent-info"
                        : "bg-white/5 text-text-secondary hover:bg-white/10"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-text-secondary">Servings eaten</label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={servingsEaten}
                  onChange={(e) => setServingsEaten(e.target.value)}
                  className="w-20"
                />
              </div>
              {error && <p className="text-xs text-accent-danger">{error}</p>}
              <div className="flex gap-2">
                <Button type="button" onClick={handleLog} disabled={isLogging} className="flex-1">
                  {isLogging ? "Adding…" : `Add to ${mealType}`}
                </Button>
                <Button type="button" variant="glass" onClick={() => setLoggingId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
