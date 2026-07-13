"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FoodSearchBox } from "@/components/food/FoodSearchBox";
import { BarcodeScannerModal } from "@/components/scan/BarcodeScannerModal";
import { MealPhotoCapture } from "@/components/log/MealPhotoCapture";
import {
  addFavouriteByFoodIdAction,
  deleteMealEntryAction,
  logCachedFoodAction,
  logCustomFoodAction,
  logMealAction,
  lookupBarcodeAction,
  removeFavouriteByFoodIdAction,
  searchFoodsAction,
  toggleFavouriteAction,
} from "@/app/(app)/log/actions";
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

/** A previously-cached Food row, shown as a one-tap chip (favourites/recent). */
export interface QuickAddFood {
  foodId: string;
  name: string;
  brand?: string;
  servingSizeG?: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  isFavourite: boolean;
}

interface LogClientProps {
  todayEntries: TodayEntryRow[];
  favouriteFoods: QuickAddFood[];
  recentFoods: QuickAddFood[];
}

export function LogClient({ todayEntries, favouriteFoods, recentFoods }: LogClientProps) {
  const router = useRouter();
  const [mealType, setMealType] = useState<MealType>(() => defaultMealForHour(new Date().getHours()));
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState("100");
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isTogglingFavourite, startTogglingFavourite] = useTransition();
  const [justFavourited, setJustFavourited] = useState<boolean | null>(null);

  const [quickFood, setQuickFood] = useState<QuickAddFood | null>(null);
  const [quickGrams, setQuickGrams] = useState("100");
  const [isSavingQuick, startSavingQuick] = useTransition();
  const [isTogglingChip, startTogglingChip] = useTransition();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [isLookingUp, startLookingUp] = useTransition();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    grams: "100",
  });
  const [isSavingCustom, startSavingCustom] = useTransition();

  function handleSelect(food: FoodItem) {
    setSelectedFood(food);
    setQuickFood(null);
    setShowCustomForm(false);
    setJustFavourited(null);
    setGrams(String(Math.round(food.servingSizeG ?? 100)));
    setError(null);
  }

  function handleSelectQuick(food: QuickAddFood) {
    setQuickFood(food);
    setSelectedFood(null);
    setShowCustomForm(false);
    setQuickGrams(String(Math.round(food.servingSizeG ?? 100)));
    setError(null);
  }

  function handleBarcodeDetected(code: string) {
    setError(null);
    startLookingUp(async () => {
      const food = await lookupBarcodeAction(code);
      if (food) {
        handleSelect(food);
      } else {
        setCustomFood((c) => ({ ...c, name: "" }));
        setShowCustomForm(true);
        setError(`No product found for barcode ${code} — add it manually below.`);
      }
    });
  }

  function handleToggleFavourite() {
    if (!selectedFood) return;
    startTogglingFavourite(async () => {
      const { favourited } = await toggleFavouriteAction(selectedFood);
      setJustFavourited(favourited);
      router.refresh();
    });
  }

  function handleToggleChipFavourite(food: QuickAddFood) {
    startTogglingChip(async () => {
      if (food.isFavourite) {
        await removeFavouriteByFoodIdAction(food.foodId);
      } else {
        await addFavouriteByFoodIdAction(food.foodId);
      }
      router.refresh();
    });
  }

  function handleSaveCustomFood() {
    const calories = Number(customFood.calories);
    const protein = Number(customFood.protein) || 0;
    const carbs = Number(customFood.carbs) || 0;
    const fat = Number(customFood.fat) || 0;
    const servingGrams = Number(customFood.grams);

    if (!customFood.name.trim()) {
      setError("Enter a food name");
      return;
    }
    if (!Number.isFinite(calories) || calories < 0) {
      setError("Enter valid calories per 100g");
      return;
    }
    if (!Number.isFinite(servingGrams) || servingGrams <= 0) {
      setError("Enter a valid serving amount");
      return;
    }

    setError(null);
    startSavingCustom(async () => {
      try {
        await logCustomFoodAction({
          name: customFood.name.trim(),
          caloriesPer100g: calories,
          proteinPer100g: protein,
          carbsPer100g: carbs,
          fatPer100g: fat,
          servingGrams,
          mealType,
        });
        setShowCustomForm(false);
        setCustomFood({ name: "", calories: "", protein: "", carbs: "", fat: "", grams: "100" });
        router.refresh();
      } catch {
        setError("Couldn't save that entry — try again.");
      }
    });
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
        setJustFavourited(null);
        router.refresh();
      } catch {
        setError("Couldn't save that entry — try again.");
      }
    });
  }

  function handleAddQuick() {
    if (!quickFood) return;
    const servingGrams = Number(quickGrams);
    if (!Number.isFinite(servingGrams) || servingGrams <= 0) {
      setError("Enter a valid amount in grams");
      return;
    }
    setError(null);
    startSavingQuick(async () => {
      try {
        await logCachedFoodAction(quickFood.foodId, mealType, servingGrams);
        setQuickFood(null);
        setQuickGrams("100");
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

  const showQuickRows = favouriteFoods.length > 0 || recentFoods.length > 0;

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

        {showQuickRows && (
          <div className="mt-4 flex flex-col gap-2">
            {favouriteFoods.length > 0 && (
              <QuickAddRow
                label="Favourites"
                foods={favouriteFoods}
                onSelect={handleSelectQuick}
                onToggleFavourite={handleToggleChipFavourite}
                disabled={isTogglingChip}
              />
            )}
            {recentFoods.length > 0 && (
              <QuickAddRow
                label="Recent"
                foods={recentFoods}
                onSelect={handleSelectQuick}
                onToggleFavourite={handleToggleChipFavourite}
                disabled={isTogglingChip}
              />
            )}
          </div>
        )}

        <div className="mt-4">
          <FoodSearchBox onSelect={handleSelect} searchAction={searchFoodsAction} />
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => setScannerOpen(true)}
            disabled={isLookingUp}
          >
            {isLookingUp ? "Looking up…" : "📷 Scan barcode"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setSelectedFood(null);
              setQuickFood(null);
              setShowCustomForm((v) => !v);
              setError(null);
            }}
            className="touch-target focus-ring control px-3 text-xs text-text-tertiary hover:text-text-secondary"
          >
            Can&apos;t find it? Add manually
          </button>
        </div>

        <div className="mt-3">
          <MealPhotoCapture mealType={mealType} onDone={() => router.refresh()} />
        </div>

        {showCustomForm && (
          <div className="mt-4 flex flex-col gap-3 rounded-control border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-text-primary">Add a custom food</p>
            <Input
              placeholder="Food name"
              value={customFood.name}
              onChange={(e) => setCustomFood((c) => ({ ...c, name: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Calories / 100g"
                value={customFood.calories}
                onChange={(e) => setCustomFood((c) => ({ ...c, calories: e.target.value }))}
              />
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Protein g / 100g"
                value={customFood.protein}
                onChange={(e) => setCustomFood((c) => ({ ...c, protein: e.target.value }))}
              />
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Carbs g / 100g"
                value={customFood.carbs}
                onChange={(e) => setCustomFood((c) => ({ ...c, carbs: e.target.value }))}
              />
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Fat g / 100g"
                value={customFood.fat}
                onChange={(e) => setCustomFood((c) => ({ ...c, fat: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-text-secondary" htmlFor="custom-grams">
                Amount eaten
              </label>
              <Input
                id="custom-grams"
                type="number"
                inputMode="decimal"
                value={customFood.grams}
                onChange={(e) => setCustomFood((c) => ({ ...c, grams: e.target.value }))}
                className="w-24"
              />
              <span className="text-sm text-text-tertiary">grams</span>
            </div>
            <Button type="button" onClick={handleSaveCustomFood} disabled={isSavingCustom} className="w-full">
              {isSavingCustom ? "Adding…" : `Add to ${mealType}`}
            </Button>
          </div>
        )}

        {error && !selectedFood && !quickFood && <p className="mt-2 text-xs text-accent-danger">{error}</p>}

        <BarcodeScannerModal
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onDetected={handleBarcodeDetected}
        />

        {selectedFood && (
          <div className="mt-4 flex flex-col gap-3 rounded-control border border-accent-info/30 bg-accent-info/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-sm font-medium text-text-primary">{selectedFood.name}</p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleFavourite}
                  disabled={isTogglingFavourite}
                  aria-label="Toggle favourite"
                  className="touch-target focus-ring control flex items-center justify-center text-text-tertiary hover:text-accent-warning"
                >
                  <Star
                    className={cn("h-4 w-4", justFavourited && "fill-accent-warning text-accent-warning")}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFood(null)}
                  className="text-xs text-text-tertiary hover:text-text-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
            {justFavourited !== null && (
              <p className="text-xs text-accent-info">
                {justFavourited ? "Added to favourites" : "Removed from favourites"}
              </p>
            )}
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

        {quickFood && (
          <div className="mt-4 flex flex-col gap-3 rounded-control border border-accent-info/30 bg-accent-info/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-sm font-medium text-text-primary">{quickFood.name}</p>
              <button
                type="button"
                onClick={() => setQuickFood(null)}
                className="text-xs text-text-tertiary hover:text-text-secondary"
              >
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-text-secondary" htmlFor="quick-grams-input">
                Amount
              </label>
              <Input
                id="quick-grams-input"
                type="number"
                inputMode="decimal"
                value={quickGrams}
                onChange={(e) => setQuickGrams(e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-text-tertiary">grams</span>
            </div>
            <p className="text-xs text-text-tertiary">
              ≈ {Math.round((quickFood.caloriesPer100g * Number(quickGrams || 0)) / 100)} kcal ·{" "}
              {Math.round((quickFood.proteinPer100g * Number(quickGrams || 0)) / 100)}g protein
            </p>
            {error && <p className="text-xs text-accent-danger">{error}</p>}
            <Button type="button" onClick={handleAddQuick} disabled={isSavingQuick} className="w-full">
              {isSavingQuick ? "Adding…" : `Add to ${mealType}`}
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

interface QuickAddRowProps {
  label: string;
  foods: QuickAddFood[];
  onSelect: (food: QuickAddFood) => void;
  onToggleFavourite: (food: QuickAddFood) => void;
  disabled: boolean;
}

function QuickAddRow({ label, foods, onSelect, onToggleFavourite, disabled }: QuickAddRowProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-tertiary">{label}</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {foods.map((food) => (
          <div
            key={food.foodId}
            className="control flex shrink-0 items-center gap-1.5 border border-white/10 bg-white/5 py-1.5 pl-3 pr-1.5"
          >
            <button
              type="button"
              onClick={() => onSelect(food)}
              className="focus-ring max-w-[140px] truncate text-left text-sm text-text-secondary hover:text-text-primary"
            >
              {food.name}
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onToggleFavourite(food)}
              aria-label={food.isFavourite ? "Remove from favourites" : "Add to favourites"}
              className="touch-target focus-ring flex items-center justify-center text-text-tertiary hover:text-accent-warning"
            >
              <Star
                className={cn("h-3.5 w-3.5", food.isFavourite && "fill-accent-warning text-accent-warning")}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
