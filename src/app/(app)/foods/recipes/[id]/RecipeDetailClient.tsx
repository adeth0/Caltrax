"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Bookmark, BookmarkCheck, Clock, ShoppingCart, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillSelect } from "@/components/ui/PillSelect";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils";
import { logRecipeAction, rateRecipeAction, toggleSaveRecipeAction } from "@/app/(app)/foods/actions";
import { addRecipeToShoppingListAction } from "@/app/(app)/shopping-list/actions";
import { toggleRecipeInCollectionAction } from "@/app/(app)/foods/collectionActions";
import { CATEGORY_META, type MealCategoryValue } from "@/components/recipes/recipeCategoryMeta";
import type { MealType } from "@/types";

// A recipe's meal-time category isn't the same set of values as the
// logging system's MealType (which only has 4 options, no brunch/tea) --
// this is just a sensible default for the "add to log" picker, always
// overridable before submitting.
const CATEGORY_TO_LOG_DEFAULT: Record<MealCategoryValue, MealType> = {
  BREAKFAST: "breakfast",
  BRUNCH: "lunch",
  LUNCH: "lunch",
  TEA: "dinner",
  SNACK: "snack",
};

interface RecipeDetailIngredient {
  id: string;
  label: string;
}

interface RecipeDetailStep {
  id: string;
  order: number;
  content: string;
  durationSeconds: number | null;
}

export interface RecipeDetailData {
  id: string;
  name: string;
  description: string | null;
  category: MealCategoryValue | null;
  imageUrl: string | null;
  servings: number;
  prepMinutes: number | null;
  cookMinutes: number | null;
  isCommunityRecipe: boolean;
  canSave: boolean;
  ingredients: RecipeDetailIngredient[];
  steps: RecipeDetailStep[];
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  averageRating: number | null;
  ratingCount: number;
  myRating: number | null;
  isSaved: boolean;
}

function StepTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  function start() {
    setRemaining(seconds);
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const label = mins > 0 ? `${mins}m${secs > 0 ? ` ${secs}s` : ""}` : `${secs}s`;

  if (remaining === null) {
    return (
      <button
        type="button"
        onClick={start}
        className="control focus-ring touch-target mt-2 inline-flex items-center gap-1.5 border border-border bg-surface-raised px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-border-strong"
      >
        <Clock className="h-3.5 w-3.5" />
        Start {label} timer
      </button>
    );
  }

  const rMins = Math.floor(remaining / 60);
  const rSecs = remaining % 60;
  return (
    <div className="bg-brand/15 mt-2 inline-flex items-center gap-1.5 rounded-control px-3 py-1.5 text-xs font-semibold tabular-nums text-brand">
      <Clock className="h-3.5 w-3.5" />
      {rMins}:{rSecs.toString().padStart(2, "0")}
    </div>
  );
}

export interface CollectionOption {
  id: string;
  name: string;
  containsThisRecipe: boolean;
}

export function RecipeDetailClient({
  recipe,
  collections,
}: {
  recipe: RecipeDetailData;
  collections: CollectionOption[];
}) {
  const [mealType, setMealType] = useState<MealType>(
    recipe.category ? CATEGORY_TO_LOG_DEFAULT[recipe.category] : "lunch"
  );
  const [servingsEaten, setServingsEaten] = useState(String(1));
  const [isLogging, startLogging] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [saved, setSaved] = useState(recipe.isSaved);
  const [myRating, setMyRating] = useState(recipe.myRating);
  const [logError, setLogError] = useState<string | null>(null);
  const [shoppingListAdded, setShoppingListAdded] = useState(false);
  const [isAddingToList, startAddingToList] = useTransition();
  const [logSuccess, setLogSuccess] = useState(false);
  const [collectionMembership, setCollectionMembership] = useState(
    () => new Map(collections.map((c) => [c.id, c.containsThisRecipe]))
  );
  const [isTogglingCollection, startTogglingCollection] = useTransition();

  const meta = recipe.category ? CATEGORY_META[recipe.category] : null;
  const totalMinutes = (recipe.prepMinutes ?? 0) + (recipe.cookMinutes ?? 0);

  function handleLog() {
    setLogError(null);
    setLogSuccess(false);
    const servings = Number(servingsEaten);
    if (!Number.isFinite(servings) || servings <= 0) {
      setLogError("Enter a valid number of servings");
      return;
    }
    startLogging(async () => {
      try {
        await logRecipeAction(recipe.id, mealType, servings);
        setLogSuccess(true);
      } catch (err) {
        setLogError(err instanceof Error ? err.message : "Couldn't log this recipe");
      }
    });
  }

  function handleRate(stars: number) {
    setMyRating(stars); // optimistic
    startTransitionSafely(() => rateRecipeAction(recipe.id, stars));
  }

  function handleToggleSave() {
    setSaved((s) => !s); // optimistic
    startSaving(async () => {
      await toggleSaveRecipeAction(recipe.id);
    });
  }

  function handleAddToShoppingList() {
    setShoppingListAdded(false);
    startAddingToList(async () => {
      await addRecipeToShoppingListAction(recipe.id);
      setShoppingListAdded(true);
    });
  }

  function handleToggleCollection(collectionId: string) {
    // Optimistic -- flip immediately, since this is a low-stakes toggle
    // and waiting for the round-trip would make the UI feel sluggish for
    // something this simple.
    setCollectionMembership((prev) => {
      const next = new Map(prev);
      next.set(collectionId, !prev.get(collectionId));
      return next;
    });
    startTogglingCollection(async () => {
      await toggleRecipeInCollectionAction(collectionId, recipe.id);
    });
  }

  // Small helper so the optimistic rating update doesn't need its own
  // useTransition boilerplate duplicated -- fire and forget, the server
  // action's revalidatePath keeps things in sync on next navigation.
  function startTransitionSafely(fn: () => Promise<unknown>) {
    void fn();
  }

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <BackButton className="mb-3" />

      {recipe.imageUrl ? (
        <Image
          src={recipe.imageUrl}
          alt=""
          width={640}
          height={360}
          unoptimized
          className="h-48 w-full rounded-card object-cover"
        />
      ) : (
        meta && (
          <div className="flex h-40 w-full items-center justify-center rounded-card bg-surface-raised">
            <meta.icon className={cn("h-12 w-12", meta.colorClass)} strokeWidth={1.5} />
          </div>
        )
      )}

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">{recipe.name}</h1>
          {recipe.description && <p className="mt-1 text-sm text-text-secondary">{recipe.description}</p>}
        </div>
        {recipe.canSave && (
          <button
            type="button"
            onClick={handleToggleSave}
            disabled={isSaving}
            aria-label={saved ? "Remove from My Recipes" : "Save to My Recipes"}
            className="touch-target focus-ring control shrink-0 border border-border bg-surface-raised p-2.5 hover:bg-border-strong"
          >
            {saved ? (
              <BookmarkCheck className="h-5 w-5 text-brand" />
            ) : (
              <Bookmark className="h-5 w-5 text-text-tertiary" />
            )}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
        {totalMinutes > 0 && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {totalMinutes} min
          </span>
        )}
        <span>
          {recipe.servings} serving{recipe.servings === 1 ? "" : "s"}
        </span>
        {meta && <span className={meta.colorClass}>{meta.label}</span>}
      </div>

      {recipe.isCommunityRecipe && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                aria-label={`Rate ${star} stars`}
                className="touch-target focus-ring"
              >
                <Star
                  className={cn(
                    "h-5 w-5",
                    (myRating ?? 0) >= star ? "fill-accent-warning text-accent-warning" : "text-text-tertiary"
                  )}
                />
              </button>
            ))}
          </div>
          {recipe.averageRating !== null && (
            <span className="text-xs text-text-tertiary">
              {recipe.averageRating.toFixed(1)} average · {recipe.ratingCount} rating
              {recipe.ratingCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
      )}

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Per serving</p>
        <div className="label-rule" />
        <div className="label-rule-thin" />
        <p className="font-display text-3xl font-black tabular-nums text-text-primary">
          {recipe.caloriesPerServing} <span className="text-sm font-medium text-text-secondary">kcal</span>
        </p>
        <div className="mt-2 flex gap-4 text-sm text-text-secondary">
          <span>
            Protein <b className="font-semibold text-text-primary">{recipe.proteinPerServing}g</b>
          </span>
          <span>
            Carbs <b className="font-semibold text-text-primary">{recipe.carbsPerServing}g</b>
          </span>
          <span>
            Fat <b className="font-semibold text-text-primary">{recipe.fatPerServing}g</b>
          </span>
        </div>
      </Card>

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-primary">Ingredients</p>
          <button
            type="button"
            onClick={handleAddToShoppingList}
            disabled={isAddingToList}
            className="control focus-ring touch-target flex items-center gap-1.5 text-xs font-medium text-accent-info hover:underline"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isAddingToList ? "Adding…" : shoppingListAdded ? "Added!" : "Add to shopping list"}
          </button>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {recipe.ingredients.map((ing) => (
            <li key={ing.id} className="text-sm text-text-secondary">
              {ing.label}
            </li>
          ))}
        </ul>
      </Card>

      {collections.length > 0 ? (
        <Card className="mt-4">
          <p className="text-sm font-semibold text-text-primary">Collections</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {collections.map((c) => {
              const inCollection = collectionMembership.get(c.id) ?? false;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleToggleCollection(c.id)}
                  disabled={isTogglingCollection}
                  className={cn(
                    "control focus-ring touch-target rounded-full px-3 py-1.5 text-xs font-medium",
                    inCollection
                      ? "bg-brand text-brand-foreground"
                      : "bg-surface-raised text-text-secondary hover:bg-border-strong"
                  )}
                >
                  {inCollection ? "✓ " : "+ "}
                  {c.name}
                </button>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="mt-4">
          <p className="text-sm font-semibold text-text-primary">Collections</p>
          <p className="mt-1 text-xs text-text-tertiary">
            Create a collection from My Recipes to start grouping recipes like this one together.
          </p>
        </Card>
      )}

      {recipe.steps.length > 0 && (
        <Card className="mt-4">
          <p className="text-sm font-semibold text-text-primary">Method</p>
          <ol className="mt-2 flex flex-col gap-4">
            {recipe.steps.map((step) => (
              <li key={step.id} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-text-primary">
                  {step.order}
                </span>
                <div>
                  <p className="text-sm text-text-secondary">{step.content}</p>
                  {step.durationSeconds && <StepTimer seconds={step.durationSeconds} />}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <Card className="mt-4">
        <p className="text-sm font-semibold text-text-primary">Add to log</p>
        <div className="mt-3 flex flex-col gap-3">
          <PillSelect
            name="mealType"
            value={mealType}
            onChange={(v) => setMealType(v as MealType)}
            columns={4}
            options={[
              { value: "breakfast", label: "Breakfast" },
              { value: "lunch", label: "Lunch" },
              { value: "dinner", label: "Dinner" },
              { value: "snack", label: "Snack" },
            ]}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-secondary">Servings eaten</label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.5"
              min={0.5}
              value={servingsEaten}
              onChange={(e) => setServingsEaten(e.target.value)}
              className="w-24"
            />
          </div>
          {logError && <p className="text-sm text-accent-danger">{logError}</p>}
          {logSuccess && <p className="text-sm text-accent-success">Added to your log.</p>}
          <Button type="button" onClick={handleLog} disabled={isLogging}>
            {isLogging ? "Adding…" : "Add to log"}
          </Button>
        </div>
      </Card>
    </main>
  );
}
