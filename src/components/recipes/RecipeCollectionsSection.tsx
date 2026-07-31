"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CuratedRecipeCard, type CuratedRecipeSummary } from "./CuratedRecipeCard";
import {
  createRecipeCollectionAction,
  deleteRecipeCollectionAction,
} from "@/app/(app)/foods/collectionActions";

export interface RecipeCollectionSummary {
  id: string;
  name: string;
  recipes: CuratedRecipeSummary[];
}

export function RecipeCollectionsSection({ collections }: { collections: RecipeCollectionSummary[] }) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  function handleCreate() {
    if (!name.trim()) {
      setError("Enter a name for this collection");
      return;
    }
    setError(null);
    startSaving(async () => {
      try {
        await createRecipeCollectionAction(name);
        setName("");
        setShowCreate(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't create that collection — try again.");
      }
    });
  }

  function handleDelete(collectionId: string) {
    startDeleting(async () => {
      await deleteRecipeCollectionAction(collectionId);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Collections</p>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="control focus-ring touch-target flex items-center gap-1 text-xs font-medium text-accent-info hover:underline"
        >
          <FolderPlus className="h-3.5 w-3.5" />
          New collection
        </button>
      </div>

      {showCreate && (
        <Card className="mb-3">
          <div className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meal Prep Sunday"
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={handleCreate} disabled={isSaving}>
              {isSaving ? "Saving…" : "Create"}
            </Button>
          </div>
          {error && <p className="mt-1.5 text-xs text-accent-danger">{error}</p>}
        </Card>
      )}

      {collections.length === 0 ? (
        <p className="text-sm text-text-tertiary">
          No collections yet — group recipes together from any recipe&apos;s page.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {collections.map((collection) => (
            <div key={collection.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-semibold text-text-primary">
                  {collection.name} ({collection.recipes.length})
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(collection.id)}
                  disabled={isDeleting}
                  aria-label={`Delete ${collection.name}`}
                  className="touch-target focus-ring text-text-tertiary hover:text-accent-danger"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {collection.recipes.length === 0 ? (
                <p className="text-xs text-text-tertiary">Empty — add a recipe to this collection.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {collection.recipes.map((recipe) => (
                    <CuratedRecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
