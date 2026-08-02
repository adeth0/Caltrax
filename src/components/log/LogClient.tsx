"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Camera, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { FoodSearchBox, type QuickPickFood } from "@/components/food/FoodSearchBox";
import { BarcodeScannerModal } from "@/components/scan/BarcodeScannerModal";
import { MealPhotoCapture } from "@/components/log/MealPhotoCapture";
import { FoodMacroRing } from "@/components/log/FoodMacroRing";
import {
  addFavouriteByFoodIdAction,
  copyYesterdayAction,
  deleteMealEntryAction,
  logCachedFoodAction,
  logCustomFoodAction,
  logMealAction,
  lookupBarcodeAction,
  removeFavouriteByFoodIdAction,
  searchFoodsAction,
  toggleFavouriteAction,
} from "@/app/(app)/log/actions";
import {
  deleteMealTemplateAction,
  logMealTemplateAction,
  saveMealTemplateAction,
} from "@/app/(app)/log/mealTemplateActions";
import type { FoodItem, MealType } from "@/types";

export interface MealTemplateOption {
  id: string;
  name: string;
  foodNames: string[];
  totalCalories: number;
}

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
  imageUrl?: string;
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
  mealTemplates: MealTemplateOption[];
  dailyTargets: { calories: number; proteinG: number; carbsG: number; fatG: number } | null;
}

export function LogClient({
  todayEntries,
  favouriteFoods,
  recentFoods,
  mealTemplates,
  dailyTargets,
}: LogClientProps) {
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

  const [pendingDelete, setPendingDelete] = useState<TodayEntryRow | null>(null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [isLookingUp, startLookingUp] = useTransition();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showQuickAddCalories, setShowQuickAddCalories] = useState(false);
  const [quickAddCalories, setQuickAddCalories] = useState({
    label: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [isSavingQuickAdd, startSavingQuickAdd] = useTransition();
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [isSavingTemplate, startSavingTemplate] = useTransition();
  const [isLoggingTemplate, startLoggingTemplate] = useTransition();
  const [isCopyingYesterday, startCopyingYesterday] = useTransition();
  const [copyYesterdayError, setCopyYesterdayError] = useState<string | null>(null);
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

  /**
   * Reuses logCustomFoodAction under the hood -- the only difference
   * from "Add manually" is the UX: the person enters the total calories
   * (and optionally macros) for this one eating occasion directly, with
   * no per-100g math and no required food name or serving size. Fixing
   * servingGrams at a notional 100 makes caloriesPer100g == the calories
   * actually entered, so the log shows the right number with none of
   * that internal mechanics visible to the person using it.
   */
  function handleSaveQuickAdd() {
    const calories = Number(quickAddCalories.calories);
    const protein = Number(quickAddCalories.protein) || 0;
    const carbs = Number(quickAddCalories.carbs) || 0;
    const fat = Number(quickAddCalories.fat) || 0;

    if (!Number.isFinite(calories) || calories <= 0) {
      setError("Enter a calorie amount");
      return;
    }

    setError(null);
    startSavingQuickAdd(async () => {
      try {
        await logCustomFoodAction({
          name: quickAddCalories.label.trim() || "Quick add",
          caloriesPer100g: calories,
          proteinPer100g: protein,
          carbsPer100g: carbs,
          fatPer100g: fat,
          servingGrams: 100,
          mealType,
        });
        setShowQuickAddCalories(false);
        setQuickAddCalories({ label: "", calories: "", protein: "", carbs: "", fat: "" });
        router.refresh();
      } catch {
        setError("Couldn't save that entry — try again.");
      }
    });
  }

  function handleSaveTemplate() {
    if (!templateName.trim()) {
      setTemplateError("Enter a name for this template");
      return;
    }
    setTemplateError(null);
    startSavingTemplate(async () => {
      try {
        await saveMealTemplateAction(templateName, mealType);
        setShowSaveTemplate(false);
        setTemplateName("");
        router.refresh();
      } catch (err) {
        setTemplateError(err instanceof Error ? err.message : "Couldn't save that template — try again.");
      }
    });
  }

  function handleLogTemplate(templateId: string) {
    startLoggingTemplate(async () => {
      await logMealTemplateAction(templateId, mealType);
      router.refresh();
    });
  }

  function handleDeleteTemplate(templateId: string) {
    startLoggingTemplate(async () => {
      await deleteMealTemplateAction(templateId);
      router.refresh();
    });
  }

  function handleCopyYesterday() {
    setCopyYesterdayError(null);
    startCopyingYesterday(async () => {
      try {
        const { copiedCount } = await copyYesterdayAction();
        if (copiedCount === 0) {
          setCopyYesterdayError("Nothing was logged yesterday to copy.");
          return;
        }
        router.refresh();
      } catch {
        setCopyYesterdayError("Couldn't copy yesterday's meals — try again.");
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

  function handleRequestDelete(entry: TodayEntryRow) {
    setPendingDelete(entry);
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    startDeleting(async () => {
      await deleteMealEntryAction(id);
      setPendingDelete(null);
      router.refresh();
    });
  }

  const grouped = MEAL_TABS.map((tab) => ({
    ...tab,
    entries: todayEntries.filter((e) => e.mealType === tab.value),
  }));

  const showQuickRows = favouriteFoods.length > 0 || recentFoods.length > 0;

  // Favourites first, then recents, deduplicated by foodId -- feeds the
  // search picker's immediate "Recent & favourites" row so it opens
  // onto something populated and tappable rather than a blank prompt.
  const quickPickFoods = [...favouriteFoods, ...recentFoods].filter(
    (food, index, all) => all.findIndex((f) => f.foodId === food.foodId) === index
  );
  const searchQuickPicks: QuickPickFood[] = quickPickFoods.map((food) => ({
    id: food.foodId,
    name: food.name,
    caloriesPer100g: food.caloriesPer100g,
    isFavourite: food.isFavourite,
  }));

  function handleSelectQuickPickFromSearch(foodId: string) {
    const food = quickPickFoods.find((f) => f.foodId === foodId);
    if (food) handleSelectQuick(food);
  }

  // Computed once per render for the review card below -- kept out of
  // the JSX itself since it's a genuine handful of related numbers
  // (this serving's macros, this food's own carb/fat/protein split for
  // the ring, and what fraction of the day's targets this serving
  // represents), not a single simple expression.
  let reviewValues: {
    servingCalories: number;
    servingProteinG: number;
    servingCarbsG: number;
    servingFatG: number;
    carbsPct: number;
    fatPct: number;
    proteinPct: number;
    goalPcts: { calories: number; carbs: number; fat: number; protein: number } | null;
  } | null = null;

  if (selectedFood) {
    const scale = Number(grams || 0) / 100;
    const servingCalories = Math.round(selectedFood.caloriesPer100g * scale);
    const servingProteinG = Math.round(selectedFood.proteinPer100g * scale);
    const servingCarbsG = Math.round(selectedFood.carbsPer100g * scale);
    const servingFatG = Math.round(selectedFood.fatPer100g * scale);

    const carbsCal = servingCarbsG * 4;
    const proteinCal = servingProteinG * 4;
    const fatCal = servingFatG * 9;
    const macroCalTotal = carbsCal + proteinCal + fatCal;

    reviewValues = {
      servingCalories,
      servingProteinG,
      servingCarbsG,
      servingFatG,
      carbsPct: macroCalTotal > 0 ? Math.round((carbsCal / macroCalTotal) * 100) : 0,
      fatPct: macroCalTotal > 0 ? Math.round((fatCal / macroCalTotal) * 100) : 0,
      proteinPct: macroCalTotal > 0 ? Math.round((proteinCal / macroCalTotal) * 100) : 0,
      goalPcts: dailyTargets
        ? {
            calories: Math.round((servingCalories / dailyTargets.calories) * 100),
            carbs: Math.round((servingCarbsG / dailyTargets.carbsG) * 100),
            fat: Math.round((servingFatG / dailyTargets.fatG) * 100),
            protein: Math.round((servingProteinG / dailyTargets.proteinG) * 100),
          }
        : null,
    };
  }

  return (
    <div className="flex flex-col gap-4">
      {mealTemplates.length > 0 && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">My templates</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {mealTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between gap-2 rounded-control bg-surface-raised px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{template.name}</p>
                  <p className="truncate text-xs text-text-tertiary">
                    {template.foodNames.join(", ")} · {template.totalCalories} kcal
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleLogTemplate(template.id)}
                  disabled={isLoggingTemplate}
                >
                  Log
                </Button>
                <button
                  type="button"
                  onClick={() => handleDeleteTemplate(template.id)}
                  disabled={isLoggingTemplate}
                  aria-label={`Delete ${template.name}`}
                  className="touch-target focus-ring text-text-tertiary hover:text-accent-danger"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MEAL_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setMealType(tab.value)}
              className={cn(
                "control focus-ring touch-target shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors",
                mealType === tab.value
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface-raised text-text-secondary hover:bg-border-strong"
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
          <FoodSearchBox
            onSelect={handleSelect}
            searchAction={searchFoodsAction}
            quickPicks={searchQuickPicks}
            onSelectQuickPick={handleSelectQuickPickFromSearch}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setScannerOpen(true)}
            disabled={isLookingUp}
          >
            <Camera className="h-4 w-4" />
            {isLookingUp ? "Looking up…" : "Scan barcode"}
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
          <button
            type="button"
            onClick={() => {
              setSelectedFood(null);
              setQuickFood(null);
              setShowQuickAddCalories((v) => !v);
              setError(null);
            }}
            className="touch-target focus-ring control px-3 text-xs text-text-tertiary hover:text-text-secondary"
          >
            Quick add calories
          </button>
          <button
            type="button"
            onClick={() => {
              setShowSaveTemplate((v) => !v);
              setTemplateError(null);
            }}
            className="touch-target focus-ring control px-3 text-xs text-text-tertiary hover:text-text-secondary"
          >
            Save {mealType} as a template
          </button>
        </div>

        {showSaveTemplate && (
          <div className="mt-3 flex items-center gap-2 rounded-control bg-surface-raised p-2.5">
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. My usual breakfast"
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={handleSaveTemplate} disabled={isSavingTemplate}>
              {isSavingTemplate ? "Saving…" : "Save"}
            </Button>
          </div>
        )}
        {templateError && <p className="mt-1.5 text-xs text-accent-danger">{templateError}</p>}

        <div className="mt-3">
          <MealPhotoCapture mealType={mealType} onDone={() => router.refresh()} />
        </div>

        {showCustomForm && (
          <div className="mt-4 flex flex-col gap-3 rounded-control border border-border bg-surface-raised p-4">
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

        {showQuickAddCalories && (
          <div className="mt-4 flex flex-col gap-3 rounded-control border border-border bg-surface-raised p-4">
            <p className="text-sm font-medium text-text-primary">Quick add calories</p>
            <p className="text-xs text-text-tertiary">
              For when you don&apos;t have exact nutrition info -- just enter what you know.
            </p>
            <Input
              placeholder='Label (optional, e.g. "Restaurant lunch")'
              value={quickAddCalories.label}
              onChange={(e) => setQuickAddCalories((c) => ({ ...c, label: e.target.value }))}
            />
            <Input
              type="number"
              inputMode="decimal"
              placeholder="Calories"
              value={quickAddCalories.calories}
              onChange={(e) => setQuickAddCalories((c) => ({ ...c, calories: e.target.value }))}
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Protein g"
                value={quickAddCalories.protein}
                onChange={(e) => setQuickAddCalories((c) => ({ ...c, protein: e.target.value }))}
              />
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Carbs g"
                value={quickAddCalories.carbs}
                onChange={(e) => setQuickAddCalories((c) => ({ ...c, carbs: e.target.value }))}
              />
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Fat g"
                value={quickAddCalories.fat}
                onChange={(e) => setQuickAddCalories((c) => ({ ...c, fat: e.target.value }))}
              />
            </div>
            <p className="text-xs text-text-tertiary">
              Protein, carbs and fat are optional -- leave blank if unknown.
            </p>
            <Button type="button" onClick={handleSaveQuickAdd} disabled={isSavingQuickAdd} className="w-full">
              {isSavingQuickAdd ? "Adding…" : `Add to ${mealType}`}
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
          <div className="border-accent-info/30 bg-accent-info/10 mt-4 flex flex-col gap-3 rounded-control border p-4">
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
            {reviewValues && (
              <div className="flex items-center gap-4">
                <FoodMacroRing
                  carbsPct={reviewValues.carbsPct}
                  fatPct={reviewValues.fatPct}
                  proteinPct={reviewValues.proteinPct}
                  calories={reviewValues.servingCalories}
                />
                <div className="flex flex-1 justify-around text-center text-xs">
                  <div>
                    <p className="font-semibold text-[var(--macro-carbs)]">{reviewValues.carbsPct}%</p>
                    <p className="text-text-tertiary">Carbs</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--macro-fat)]">{reviewValues.fatPct}%</p>
                    <p className="text-text-tertiary">Fat</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--macro-protein)]">{reviewValues.proteinPct}%</p>
                    <p className="text-text-tertiary">Protein</p>
                  </div>
                </div>
              </div>
            )}

            {reviewValues?.goalPcts && (
              <div>
                <p className="mb-1.5 text-xs font-semibold text-text-secondary">
                  Percent of Your Daily Goals
                </p>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  {(
                    [
                      ["Calories", reviewValues.goalPcts.calories, "var(--brand)"],
                      ["Carbs", reviewValues.goalPcts.carbs, "var(--macro-carbs)"],
                      ["Fat", reviewValues.goalPcts.fat, "var(--macro-fat)"],
                      ["Protein", reviewValues.goalPcts.protein, "var(--macro-protein)"],
                    ] as const
                  ).map(([label, pct, color]) => (
                    <div key={label}>
                      <p className="text-text-tertiary">{label}</p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, pct)}%`, background: color }}
                        />
                      </div>
                      <p className="mt-0.5 font-medium text-text-primary">{pct}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {error && <p className="text-xs text-accent-danger">{error}</p>}
            <Button type="button" onClick={handleAdd} disabled={isSaving} className="w-full">
              {isSaving ? "Adding…" : `Add to ${mealType}`}
            </Button>
          </div>
        )}

        {quickFood && (
          <div className="border-accent-info/30 bg-accent-info/10 mt-4 flex flex-col gap-3 rounded-control border p-4">
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
      </Card>

      <Card>
        <p className="mb-3 text-sm font-medium text-text-primary">Today&apos;s log</p>
        {todayEntries.length === 0 ? (
          <div>
            <p className="text-sm text-text-tertiary">
              Nothing logged yet today — search above to add a meal.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopyYesterday}
              disabled={isCopyingYesterday}
              className="mt-2"
            >
              {isCopyingYesterday ? "Copying…" : "Copy yesterday's meals"}
            </Button>
            {copyYesterdayError && <p className="mt-1.5 text-xs text-accent-danger">{copyYesterdayError}</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {grouped
              .filter((g) => g.entries.length > 0)
              .map((g) => {
                const groupCalories = g.entries.reduce((sum, e) => sum + e.calories, 0);
                return (
                  <div key={g.value}>
                    <div className="mb-2 flex items-baseline justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                        {g.label}
                      </p>
                      <p className="text-xs font-semibold text-text-secondary">
                        {Math.round(groupCalories)} cal
                      </p>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {g.entries.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-center justify-between gap-3 rounded-control bg-surface-raised px-3 py-2"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {entry.imageUrl ? (
                              <Image
                                src={entry.imageUrl}
                                alt=""
                                width={36}
                                height={36}
                                className="h-9 w-9 shrink-0 rounded-lg object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="h-9 w-9 shrink-0 rounded-lg bg-border" aria-hidden />
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-sm text-text-primary">{entry.foodName}</p>
                              <p className="text-xs text-text-tertiary">
                                {Math.round(entry.servingGrams)}g · {Math.round(entry.calories)} kcal
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleRequestDelete(entry)}
                            className="touch-target focus-ring shrink-0 rounded-control px-2 text-xs text-text-tertiary hover:text-accent-danger"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
          </div>
        )}
      </Card>

      <Modal
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Remove this entry?"
        description={
          pendingDelete ? `${pendingDelete.foodName} · ${Math.round(pendingDelete.calories)} kcal` : undefined
        }
      >
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Removing…" : "Remove"}
          </Button>
        </div>
      </Modal>
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
            className="control flex shrink-0 items-center gap-1.5 border border-border bg-surface-raised py-1.5 pl-3 pr-1.5"
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
