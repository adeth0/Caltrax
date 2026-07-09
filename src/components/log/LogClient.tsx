"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FoodSearchBox } from "@/components/food/FoodSearchBox";
import { deleteMealEntryAction, logMealAction, searchFoodsAction } from "@/app/(app)/log/actions";
import type { FoodItem, MealType } from "@/types";

const MEAL_TABS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

function defaultMealForHour(hour: number): MealType {
  if (hour < 11) return "breakfast";
  if (hour < 15) return "lunch";
  if (hour < 20) return "dinner";
  return "snack";
}

export interface TodayEntryRow {
  id: string;
  mealType: MealType;
  foodName: string;
  servingGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

interface LogClientProps {
  todayEntries: TodayEntryRow[];
}

export function LogClient({ todayEntries }: LogClientProps) {
  const router = useRouter();
  const [mealType, setMealType] = useState<MealType>(() => defaultMealForHour(new Date().getHours()));
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState("100");
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSelect(food: FoodItem) {
    setSelectedFood(food);
    setGrams(String(Math.round(food.servingSizeG ?? 100)));
    setError(null);
  }

  function handleAdd() {
    if (!selectedFood) return;
    const servingGrams = Number(grams);
    if (!Number.isFinite(servingGrams) || servingGrams <= 0) {
      setError("Enter a valid amount in grams");
      return;
    }
    setError(null);
    startSaving(async () => {
      try {
        await logMealAction({ food: selectedFood, mealType, servingGrams });
        setSelectedFood(null);
        setGrams("100");
        router.refresh();
      } catch {
        setError("Couldn't save that entry — try again.");
      }
    });
  }

  function handleDelete(id: string) {
    startDeleting(async () => {
      await deleteMealEntryAction(id);
      router.refresh();
    });
  }

  const grouped = MEAL_TABS.map((tab) => ({
    ...tab,
    entries: todayEntries.filter((e) => e.mealType === tab.value),
  }));

  return (
    <div className="flex flex-col gap-4">
      <GlassCard>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MEAL_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setMealType(tab.value)}
              className={cn(
                "control focus-ring touch-target shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors",
                mealType === tab.value
                  ? "bg-accent-info/20 text-accent-info"
                  : "bg-white/5 text-text-secondary hover:bg-white/10"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <FoodSearchBox onSelect={handleSelect} searchAction={searchFoodsAction} />
        </div>

        {selectedFood && (
          <div className="mt-4 flex flex-col gap-3 rounded-control border border-accent-info/30 bg-accent-info/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-sm font-medium text-text-primary">{selectedFood.name}</p>
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="text-xs text-text-tertiary hover:text-text-secondary"
              >
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-text-secondary" htmlFor="grams-input">
                Amount
              </label>
              <Input
                id="grams-input"
                type="number"
                inputMode="decimal"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-text-tertiary">grams</span>
            </div>
            <p className="text-xs text-text-tertiary">
              ≈ {Math.round((selectedFood.caloriesPer100g * Number(grams || 0)) / 100)} kcal ·{" "}
              {Math.round((selectedFood.proteinPer100g * Number(grams || 0)) / 100)}g protein
            </p>
            {error && <p className="text-xs text-accent-danger">{error}</p>}
            <Button type="button" onClick={handleAdd} disabled={isSaving} className="w-full">
              {isSaving ? "Adding…" : `Add to ${mealType}`}
            </Button>
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <p className="mb-3 text-sm font-medium text-text-primary">Today&apos;s log</p>
        {todayEntries.length === 0 ? (
          <p className="text-sm text-text-tertiary">Nothing logged yet today — search above to add a meal.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {grouped
              .filter((g) => g.entries.length > 0)
              .map((g) => (
                <div key={g.value}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                    {g.label}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {g.entries.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-center justify-between gap-3 rounded-control bg-white/5 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-text-primary">{entry.foodName}</p>
                          <p className="text-xs text-text-tertiary">
                            {Math.round(entry.servingGrams)}g · {Math.round(entry.calories)} kcal
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(entry.id)}
                          className="touch-target focus-ring shrink-0 rounded-control px-2 text-xs text-text-tertiary hover:text-accent-danger"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
