"use client";

import { addDays, format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FoodSearchBox } from "@/components/food/FoodSearchBox";
import { searchFoodsAction } from "@/app/(app)/log/actions";
import {
  addPlannedFoodAction,
  addPlannedRecipeAction,
  deletePlannedMealAction,
  markPlannedMealEatenAction,
} from "@/app/(app)/planner/actions";
import type { FoodItem, MealType } from "@/types";

const MEAL_TABS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export interface PlannedMealRow {
  id: string;
  date: string; // "YYYY-MM-DD"
  mealType: MealType;
  label: string;
  detail: string;
  calories: number | null;
}

export interface RecipeOption {
  id: string;
  name: string;
  servings: number;
}

interface PlannerClientProps {
  days: string[]; // 7 "YYYY-MM-DD" strings
  plannedMeals: PlannedMealRow[];
  recipes: RecipeOption[];
}

export function PlannerClient({ days, plannedMeals, recipes }: PlannerClientProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(days[0]!);
  const [addingMealType, setAddingMealType] = useState<MealType | null>(null);
  const [mode, setMode] = useState<"food" | "recipe">("food");
  const [pickedFood, setPickedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState("100");
  const [recipeId, setRecipeId] = useState(recipes[0]?.id ?? "");
  const [servingsCount, setServingsCount] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isBusy, startBusy] = useTransition();

  function openAdd(mealType: MealType) {
    setAddingMealType(mealType);
    setMode("food");
    setPickedFood(null);
    setGrams("100");
    setServingsCount("1");
    setError(null);
  }

  function handleSaveFood() {
    if (!pickedFood || !addingMealType) return;
    const servingGrams = Number(grams);
    if (!Number.isFinite(servingGrams) || servingGrams <= 0) {
      setError("Enter a valid amount in grams");
      return;
    }
    setError(null);
    startSaving(async () => {
      try {
        await addPlannedFoodAction({
          date: selectedDate,
          mealType: addingMealType,
          food: pickedFood,
          servingGrams,
        });
        setAddingMealType(null);
        router.refresh();
      } catch {
        setError("Couldn't save that — try again.");
      }
    });
  }

  function handleSaveRecipe() {
    if (!recipeId || !addingMealType) return;
    const servings = Number(servingsCount);
    if (!Number.isFinite(servings) || servings <= 0) {
      setError("Enter a valid number of servings");
      return;
    }
    setError(null);
    startSaving(async () => {
      try {
        await addPlannedRecipeAction({
          date: selectedDate,
          mealType: addingMealType,
          recipeId,
          servingsCount: servings,
        });
        setAddingMealType(null);
        router.refresh();
      } catch {
        setError("Couldn't save that — try again.");
      }
    });
  }

  function handleMarkEaten(id: string) {
    setBusyId(id);
    startBusy(async () => {
      try {
        await markPlannedMealEatenAction(id);
        router.refresh();
      } finally {
        setBusyId(null);
      }
    });
  }

  function handleRemove(id: string) {
    setBusyId(id);
    startBusy(async () => {
      try {
        await deletePlannedMealAction(id);
        router.refresh();
      } finally {
        setBusyId(null);
      }
    });
  }

  function goToWeek(direction: "prev" | "next") {
    const newStart = addDays(parseISO(days[0]!), direction === "next" ? 7 : -7);
    router.push(`/planner?start=${format(newStart, "yyyy-MM-dd")}`);
  }

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const dayMeals = plannedMeals.filter((m) => m.date === selectedDate);

  return (
    <div className="flex flex-col gap-4">
      <GlassCard>
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goToWeek("prev")}
            className="touch-target focus-ring control px-3 text-sm text-text-secondary hover:text-text-primary"
          >
            ← Prev week
          </button>
          <button
            type="button"
            onClick={() => goToWeek("next")}
            className="touch-target focus-ring control px-3 text-sm text-text-secondary hover:text-text-primary"
          >
            Next week →
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => {
            const date = parseISO(day);
            const isSelected = day === selectedDate;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "control focus-ring touch-target flex shrink-0 flex-col items-center px-3 py-2 transition-colors",
                  isSelected
                    ? "bg-accent-info/20 text-accent-info"
                    : "bg-white/5 text-text-secondary hover:bg-white/10"
                )}
              >
                <span className="text-[10px] uppercase tracking-wide">{format(date, "EEE")}</span>
                <span className="text-sm font-medium">{format(date, "d")}</span>
                {day === todayStr && <span className="mt-0.5 h-1 w-1 rounded-full bg-accent-info" />}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {MEAL_TABS.map((tab) => {
        const items = dayMeals.filter((m) => m.mealType === tab.value);
        return (
          <GlassCard key={tab.value}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-primary">{tab.label}</p>
              <button
                type="button"
                onClick={() => openAdd(tab.value)}
                className="touch-target focus-ring control px-2 text-xs text-accent-info hover:underline"
              >
                + Add
              </button>
            </div>

            {items.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-control bg-white/5 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-text-primary">{item.label}</p>
                      <p className="text-xs text-text-tertiary">
                        {item.detail}
                        {item.calories !== null ? ` · ${item.calories} kcal` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={isBusy && busyId === item.id}
                        onClick={() => handleMarkEaten(item.id)}
                        className="touch-target focus-ring control px-2 text-xs text-accent-info hover:underline"
                      >
                        Mark eaten
                      </button>
                      <button
                        type="button"
                        disabled={isBusy && busyId === item.id}
                        onClick={() => handleRemove(item.id)}
                        className="touch-target focus-ring control px-2 text-xs text-text-tertiary hover:text-accent-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {addingMealType === tab.value && (
              <div className="mt-3 flex flex-col gap-3 rounded-control border border-accent-info/30 bg-accent-info/10 p-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("food")}
                    className={cn(
                      "control focus-ring px-3 py-1 text-xs font-medium",
                      mode === "food" ? "bg-accent-info/20 text-accent-info" : "text-text-tertiary"
                    )}
                  >
                    Search food
                  </button>
                  {recipes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setMode("recipe")}
                      className={cn(
                        "control focus-ring px-3 py-1 text-xs font-medium",
                        mode === "recipe" ? "bg-accent-info/20 text-accent-info" : "text-text-tertiary"
                      )}
                    >
                      Choose recipe
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setAddingMealType(null)}
                    className="ml-auto text-xs text-text-tertiary hover:text-text-secondary"
                  >
                    Cancel
                  </button>
                </div>

                {mode === "food" && (
                  <>
                    <FoodSearchBox onSelect={setPickedFood} searchAction={searchFoodsAction} />
                    {pickedFood && (
                      <>
                        <p className="text-sm text-text-primary">{pickedFood.name}</p>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            inputMode="decimal"
                            value={grams}
                            onChange={(e) => setGrams(e.target.value)}
                            className="w-24"
                          />
                          <span className="text-sm text-text-tertiary">grams</span>
                        </div>
                        {error && <p className="text-xs text-accent-danger">{error}</p>}
                        <Button type="button" onClick={handleSaveFood} disabled={isSaving} className="w-full">
                          {isSaving ? "Saving…" : "Add to plan"}
                        </Button>
                      </>
                    )}
                  </>
                )}

                {mode === "recipe" && (
                  <>
                    <select
                      value={recipeId}
                      onChange={(e) => setRecipeId(e.target.value)}
                      className="control h-11 w-full border border-white/10 bg-white/5 px-3 text-sm text-text-primary"
                    >
                      {recipes.map((r) => (
                        <option key={r.id} value={r.id} className="bg-bg-primary">
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-text-secondary">Servings</label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={servingsCount}
                        onChange={(e) => setServingsCount(e.target.value)}
                        className="w-20"
                      />
                    </div>
                    {error && <p className="text-xs text-accent-danger">{error}</p>}
                    <Button type="button" onClick={handleSaveRecipe} disabled={isSaving} className="w-full">
                      {isSaving ? "Saving…" : "Add to plan"}
                    </Button>
                  </>
                )}
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}
