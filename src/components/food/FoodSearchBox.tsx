"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import type { FoodItem } from "@/types";

interface FoodSearchBoxProps {
  onSelect: (food: FoodItem) => void;
  searchAction: (query: string) => Promise<FoodItem[]>;
  placeholder?: string;
}

/**
 * Debounced (350ms) search-as-you-type box backed by a server action.
 * Kept dumb on purpose — selection handling (what happens when a result
 * is tapped) is entirely up to the caller so /log and /foods can each
 * wire it to a different next step.
 */
export function FoodSearchBox({ onSelect, searchAction, placeholder }: FoodSearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const found = await searchAction(query);
        setResults(found);
        setHasSearched(true);
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

  return (
    <div>
      <Input
        type="search"
        inputMode="search"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        placeholder={placeholder ?? 'Search foods, e.g. "chicken breast"'}
        autoComplete="off"
      />

      {isPending && <p className="mt-3 text-xs text-text-tertiary">Searching…</p>}

      {!isPending && hasSearched && results.length === 0 && (
        <p className="mt-3 text-xs text-text-tertiary">
          No results for &ldquo;{query}&rdquo;. Try a simpler or more generic term.
        </p>
      )}

      {!isPending && results.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {results.map((food) => (
            <li key={food.id}>
              <button
                type="button"
                onClick={() => onSelect(food)}
                className="control focus-ring flex w-full items-center gap-3 border border-white/10 bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
              >
                {food.imageUrl ? (
                  <Image
                    src={food.imageUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-white/10" aria-hidden />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{food.name}</p>
                  <p className="truncate text-xs text-text-tertiary">
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
          ))}
        </ul>
      )}
    </div>
  );
}
