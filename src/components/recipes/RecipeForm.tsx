"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Camera, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillSelect } from "@/components/ui/PillSelect";
import { FoodSearchBox } from "@/components/food/FoodSearchBox";
import { createRecipeAction } from "@/app/(app)/foods/actions";
import { searchFoodsAction } from "@/app/(app)/log/actions";
import { downscaleToJpegBase64 } from "@/lib/imageDownscale";
import type { MealCategoryValue } from "@/components/recipes/recipeCategoryMeta";
import type { FoodItem } from "@/types";

interface DraftItem {
  food: FoodItem;
  grams: string;
}

interface DraftStep {
  content: string;
  minutes: string;
}

interface RecipeFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS: { value: MealCategoryValue; label: string }[] = [
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "BRUNCH", label: "Brunch" },
  { value: "LUNCH", label: "Lunch" },
  { value: "TEA", label: "Tea" },
  { value: "SNACK", label: "Snack" },
];

export function RecipeForm({ onSaved, onCancel }: RecipeFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MealCategoryValue>("LUNCH");
  const [servings, setServings] = useState("4");
  const [prepMinutes, setPrepMinutes] = useState("");
  const [cookMinutes, setCookMinutes] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [steps, setSteps] = useState<DraftStep[]>([{ content: "", minutes: "" }]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
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

  function updateStep(index: number, field: keyof DraftStep, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, { content: "", minutes: "" }]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const base64 = await downscaleToJpegBase64(file);
      setPhotoBase64(base64);
    } catch {
      setError("Couldn't process that photo — try a different one.");
    }
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
        await createRecipeAction({
          name: name.trim(),
          description: description.trim() || undefined,
          category,
          servings: servingsNum,
          prepMinutes: prepMinutes ? Number(prepMinutes) : undefined,
          cookMinutes: cookMinutes ? Number(cookMinutes) : undefined,
          items: parsedItems,
          steps: steps
            .filter((s) => s.content.trim())
            .map((s) => ({
              content: s.content,
              durationSeconds: s.minutes ? Number(s.minutes) * 60 : undefined,
            })),
          isPublished,
          imageBase64: photoBase64 ?? undefined,
          imageMediaType: photoBase64 ? "image/jpeg" : undefined,
        });
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
    <Card>
      <p className="mb-4 text-sm font-semibold text-text-primary">New recipe</p>
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Photo (optional)</label>
          {previewUrl ? (
            <div className="relative">
              <Image
                src={previewUrl}
                alt=""
                width={400}
                height={200}
                unoptimized
                className="h-40 w-full rounded-control object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setPhotoBase64(null);
                }}
                className="touch-target focus-ring bg-base/80 absolute right-2 top-2 rounded-full p-1.5"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4 text-text-primary" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="control focus-ring touch-target flex h-32 w-full items-center justify-center gap-2 border border-dashed border-border bg-surface-raised text-sm text-text-tertiary hover:bg-border-strong"
            >
              <Camera className="h-5 w-5" />
              Add a photo
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <Input placeholder="Recipe name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea
          placeholder="Short description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="control focus-ring w-full resize-none border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary"
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Category</label>
          <PillSelect
            name="category"
            value={category}
            onChange={(v) => setCategory(v as MealCategoryValue)}
            columns={3}
            options={CATEGORY_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Servings</label>
            <Input
              type="number"
              inputMode="decimal"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Prep (min)</label>
            <Input
              type="number"
              inputMode="numeric"
              value={prepMinutes}
              onChange={(e) => setPrepMinutes(e.target.value)}
              placeholder="—"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Cook (min)</label>
            <Input
              type="number"
              inputMode="numeric"
              value={cookMinutes}
              onChange={(e) => setCookMinutes(e.target.value)}
              placeholder="—"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Ingredients</p>
          {items.length > 0 && (
            <ul className="mb-2 flex flex-col gap-2">
              {items.map((item, index) => (
                <li
                  key={`${item.food.id}-${index}`}
                  className="flex items-center gap-2 rounded-control bg-surface-raised px-3 py-2"
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
            <p className="mb-2 text-xs text-text-tertiary">
              ≈ {Math.round(totalCalories)} kcal total · {Math.round(totalCalories / Number(servings || 1))}{" "}
              kcal/serving
            </p>
          )}
          <FoodSearchBox onSelect={handleAddIngredient} searchAction={searchFoodsAction} />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Method</p>
          <div className="flex flex-col gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <span className="mt-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-text-primary">
                  {index + 1}
                </span>
                <div className="flex flex-1 flex-col gap-1.5">
                  <textarea
                    placeholder="Describe this step…"
                    value={step.content}
                    onChange={(e) => updateStep(index, "content", e.target.value)}
                    rows={2}
                    className="control focus-ring w-full resize-none border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Timer (min, optional)"
                      value={step.minutes}
                      onChange={(e) => updateStep(index, "minutes", e.target.value)}
                      className="w-40 text-xs"
                    />
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="touch-target focus-ring text-xs text-text-tertiary hover:text-accent-danger"
                      >
                        Remove step
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="control focus-ring touch-target flex items-center gap-1.5 self-start px-2 py-1.5 text-xs font-medium text-accent-info hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Add step
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2.5 rounded-control bg-surface-raised p-3">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
          />
          <span className="text-sm text-text-secondary">
            Share this recipe publicly in <b className="text-text-primary">User Recipes &amp; Meals</b> for
            everyone to find and rate. Leave unchecked to keep it just for you.
          </span>
        </label>

        {error && <p className="text-xs text-accent-danger">{error}</p>}

        <div className="flex gap-2">
          <Button type="button" onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? "Saving…" : "Save recipe"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
}
