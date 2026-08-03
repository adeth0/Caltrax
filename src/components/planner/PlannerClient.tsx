"use client";

import { addDays, format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { FoodSearchBox } from "@/components/food/FoodSearchBox";
import { searchFoodsAction } from "@/app/(app)/log/actions";
import { addWeekToShoppingListAction } from "@/app/(app)/shopping-list/actions";
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
  const [isGeneratingList, startGeneratingList] = useTransition();
  const [shoppingListMessage, setShoppingListMessage] = useState<string | null>(null);
  const [pendingRemove, setPendingRemove] = useState<PlannedMealRow | null>(null);

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
        setPendingRemove(null);
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

  function handleAddWeekToShoppingList() {
    setShoppingListMessage(null);
    startGeneratingList(async () => {
      const { recipeCount, itemCount } = await addWeekToShoppingListAction(days[0]!);
      setShoppingListMessage(
        recipeCount === 0
          ? "No recipes planned this week yet — plan a few, then generate your list."
          : `Added ${itemCount} ingredient${itemCount === 1 ? "" : "s"} from ${recipeCount} recipe${
              recipeCount === 1 ? "" : "s"
            } to your shopping list.`
      );
    });
  }

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const dayMeals = plannedMeals.filter((m) => m.date === selectedDate);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goToWeek("prev")}
            className="control focus-ring touch-target flex items-center gap-1 px-3 text-sm text-text-secondary hover:text-text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev week
          </button>
          <button
            type="button"
            onClick={() => goToWeek("next")}
            className="control focus-ring touch-target flex items-center gap-1 px-3 text-sm text-text-secondary hover:text-text-primary"
          >
            Next week
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddWeekToShoppingList}
          disabled={isGeneratingList}
          className="control focus-ring touch-target mb-2 flex items-center gap-1.5 text-xs font-medium text-accent-info hover:underline"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {isGeneratingList ? "Adding…" : "Add this week's recipes to shopping list"}
        </button>
        {shoppingListMessage && <p className="mb-2 text-xs text-text-tertiary">{shoppingListMessage}</p>}

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
                    ? "bg-brand text-brand-foreground"
                    : "bg-surface-raised text-text-secondary hover:bg-border-strong"
                )}
              >
                <span className="text-[10px] uppercase tracking-wide">{format(date, "EEE")}</span>
                <span className="text-sm font-medium">{format(date, "d")}</span>
                {day === todayStr && (
                  <span
                    className={cn(
                      "mt-0.5 h-1 w-1 rounded-full",
                      isSelected ? "bg-brand-foreground" : "bg-brand"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {MEAL_TABS.map((tab) => {
        const items = dayMeals.filter((m) => m.mealType === tab.value);
        return (
          <Card key={tab.value}>
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
                    className="flex items-center justify-between gap-2 rounded-control bg-surface-raised px-3 py-2"
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
                        onClick={() => setPendingRemove(item)}
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
              <div className="border-accent-info/30 bg-accent-info/10 mt-3 flex flex-col gap-3 rounded-control border p-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("food")}
                    className={cn(
                      "control focus-ring px-3 py-1 text-xs font-medium",
                      mode === "food" ? "bg-brand text-brand-foreground" : "text-text-tertiary"
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
                        mode === "recipe" ? "bg-brand text-brand-foreground" : "text-text-tertiary"
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
                      className="control h-11 w-full border border-border bg-surface-raised px-3 text-sm text-text-primary"
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
          </Card>
        );
      })}

      <Modal
        open={pendingRemove !== null}
        onOpenChange={(open) => {
          if (!open) setPendingRemove(null);
        }}
        title="Remove from plan?"
        description={pendingRemove?.label}
      >
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => setPendingRemove(null)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            disabled={isBusy && busyId === pendingRemove?.id}
            onClick={() => pendingRemove && handleRemove(pendingRemove.id)}
          >
            {isBusy && busyId === pendingRemove?.id ? "Removing…" : "Remove"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
