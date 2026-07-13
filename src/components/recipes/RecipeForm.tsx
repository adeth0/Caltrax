"use client";

import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodSearchBox } from "@/components/food/FoodSearchBox";
import { createRecipeAction } from "@/app/(app)/foods/actions";
import { searchFoodsAction } from "@/app/(app)/log/actions";
import type { FoodItem } from "@/types";

interface DraftItem {
  food: FoodItem;
  grams: string;
}

interface RecipeFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

export function RecipeForm({ onSaved, onCancel }: RecipeFormProps) {
  const [name, setName] = useState("");
  const [servings, setServings] = useState("4");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  function handleAddIngredient(food: FoodItem) {
    setItems((prev) => [...prev, { food, grams: String(Math.round(food.servingSizeG ?? 100)) }]);
  }

  function updateGrams(index: number, grams: string) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, grams } : it)));
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    const servingsNum = Number(servings);
    if (!name.trim()) {
      setError("Enter a recipe name");
      return;
    }
    if (!Number.isFinite(servingsNum) || servingsNum <= 0) {
      setError("Servings must be a positive number");
      return;
    }
    if (items.length === 0) {
      setError("Add at least one ingredient");
      return;
    }
    const parsedItems = items.map((it) => ({ food: it.food, grams: Number(it.grams) }));
    if (parsedItems.some((it) => !Number.isFinite(it.grams) || it.grams <= 0)) {
      setError("Every ingredient needs a valid amount in grams");
      return;
    }

    setError(null);
    startSaving(async () => {
      try {
        await createRecipeAction({ name: name.trim(), servings: servingsNum, items: parsedItems });
        onSaved();
      } catch {
        setError("Couldn't save that recipe — try again.");
      }
    });
  }

  const totalCalories = items.reduce(
    (sum, it) => sum + (it.food.caloriesPer100g * Number(it.grams || 0)) / 100,
    0
  );

  return (
    <GlassCard>
      <p className="mb-3 text-sm font-medium text-text-primary">New recipe</p>
      <div className="flex flex-col gap-3">
        <Input placeholder="Recipe name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex items-center gap-3">
          <label className="text-sm text-text-secondary" htmlFor="recipe-servings">
            Makes
          </label>
          <Input
            id="recipe-servings"
            type="number"
            inputMode="decimal"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className="w-20"
          />
          <span className="text-sm text-text-tertiary">servings</span>
        </div>

        {items.length > 0 && (
          <ul className="flex flex-col gap-2">
            {items.map((item, index) => (
              <li
                key={`${item.food.id}-${index}`}
                className="flex items-center gap-2 rounded-control bg-white/5 px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-text-primary">{item.food.name}</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={item.grams}
                  onChange={(e) => updateGrams(index, e.target.value)}
                  className="w-20"
                />
                <span className="text-xs text-text-tertiary">g</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="touch-target focus-ring text-xs text-text-tertiary hover:text-accent-danger"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <p className="text-xs text-text-tertiary">
            ≈ {Math.round(totalCalories)} kcal total · {Math.round(totalCalories / Number(servings || 1))}{" "}
            kcal/serving
          </p>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Add ingredient
          </p>
          <FoodSearchBox onSelect={handleAddIngredient} searchAction={searchFoodsAction} />
        </div>

        {error && <p className="text-xs text-accent-danger">{error}</p>}

        <div className="flex gap-2">
          <Button type="button" onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? "Saving…" : "Save recipe"}
          </Button>
          <Button type="button" variant="glass" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
