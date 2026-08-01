"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronLeft, Search, Star, X } from "lucide-react";
import { getFoodCategoryVisual } from "@/lib/foodCategoryVisuals";
import type { FoodItem } from "@/types";

export interface QuickPickFood {
  id: string;
  name: string;
  caloriesPer100g: number;
  isFavourite?: boolean;
}

interface FoodSearchBoxProps {
  onSelect: (food: FoodItem) => void;
  searchAction: (query: string) => Promise<FoodItem[]>;
  placeholder?: string;
  /**
   * Recent/favourite foods shown as an immediate, horizontally-scrolling
   * row the moment the picker opens, before any typing -- so it opens
   * onto something populated and tap-ready rather than a blank "start
   * typing" prompt, which read as too form-like/empty on first open.
   * Optional since not every caller of this component has this data
   * (e.g. a recipe-ingredient search has no "recent meals eaten"
   * concept) -- decoupled from any specific caller's own data shape on
   * purpose, so this stays reusable.
   */
  quickPicks?: QuickPickFood[];
  onSelectQuickPick?: (id: string) => void;
}

/**
 * Debounced (350ms) search-as-you-type, backed by a server action.
 * Opens as a full-screen picker overlay rather than an inline list --
 * every result gets a large, consistent category icon badge (from
 * getFoodCategoryVisual) so results look intentional even when a food
 * has no real photo, which is the common case for locally-seeded
 * foods. Kept dumb on selection handling on purpose -- what happens
 * when a result is tapped is entirely up to the caller, so /log and
 * /foods can each wire it to a different next step.
 */
export function FoodSearchBox({
  onSelect,
  searchAction,
  placeholder,
  quickPicks,
  onSelectQuickPick,
}: FoodSearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        try {
          const found = await searchAction(query);
          setResults(found);
        } catch {
          setResults([]);
        } finally {
          setHasSearched(true);
        }
      });
    }, 350);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function handleQueryChange(next: string) {
    setQuery(next);
    if (next.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
    }
  }

  function handleSelect(food: FoodItem) {
    onSelect(food);
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setHasSearched(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="control focus-ring touch-target flex w-full items-center gap-2.5 rounded-control border border-border bg-surface-raised px-4 py-3 text-left text-text-tertiary"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate text-sm">{placeholder ?? 'Search foods, e.g. "chicken breast"'}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-base">
          <div
            className="flex items-center gap-2 border-b border-border p-3"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close search"
              className="touch-target focus-ring control flex shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-surface-raised hover:text-text-primary"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input
                ref={inputRef}
                type="search"
                inputMode="search"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={placeholder ?? 'Search foods, e.g. "chicken breast"'}
                autoComplete="off"
                className="control focus-ring w-full rounded-control border border-border bg-surface-raised py-2.5 pl-9 pr-9 text-sm text-text-primary placeholder:text-text-tertiary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleQueryChange("")}
                  aria-label="Clear search"
                  className="touch-target focus-ring absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center text-text-tertiary hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {isPending && <p className="p-3 text-sm text-text-tertiary">Searching…</p>}

            {!isPending && hasSearched && results.length === 0 && (
              <p className="p-3 text-sm text-text-tertiary">
                No results for &ldquo;{query}&rdquo;. Try a simpler or more generic term.
              </p>
            )}

            {!isPending && !hasSearched && (
              <div>
                {quickPicks && quickPicks.length > 0 ? (
                  <>
                    <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Recent &amp; favourites
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {quickPicks.map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          onClick={() => onSelectQuickPick?.(food.id)}
                          className="control focus-ring flex shrink-0 flex-col items-center gap-1.5 rounded-control bg-surface-raised px-3 py-2.5"
                        >
                          <div className="bg-brand/15 flex h-11 w-11 items-center justify-center rounded-full text-brand">
                            {food.isFavourite ? (
                              <Star className="h-5 w-5 fill-current" />
                            ) : (
                              <Search className="h-5 w-5" />
                            )}
                          </div>
                          <span className="max-w-[80px] truncate text-xs font-medium text-text-primary">
                            {food.name}
                          </span>
                          <span className="text-[11px] text-text-tertiary">
                            {Math.round(food.caloriesPer100g)} kcal
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="p-3 text-sm text-text-tertiary">Start typing to search foods.</p>
                )}
              </div>
            )}

            {!isPending && results.length > 0 && (
              <ul className="flex flex-col gap-1">
                {results.map((food) => {
                  const visual = getFoodCategoryVisual(food.category);
                  const Icon = visual.icon;
                  return (
                    <li key={food.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(food)}
                        className="control focus-ring flex w-full items-center gap-3 rounded-control px-2 py-2.5 text-left transition-colors hover:bg-surface-raised"
                      >
                        {food.imageUrl ? (
                          <Image
                            src={food.imageUrl}
                            alt=""
                            width={52}
                            height={52}
                            className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div
                            className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ${visual.colorClasses}`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-semibold text-text-primary">{food.name}</p>
                          <p className="truncate text-sm text-text-tertiary">
                            {food.brand ? `${food.brand} · ` : ""}
                            {Math.round(food.caloriesPer100g)} kcal / 100g
                          </p>
                        </div>
                        <div className="shrink-0 text-right text-xs text-text-secondary">
                          <p>{Math.round(food.proteinPer100g)}g P</p>
                          <p>{Math.round(food.carbsPer100g)}g C</p>
                          <p>{Math.round(food.fatPer100g)}g F</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
