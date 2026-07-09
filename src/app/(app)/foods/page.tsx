"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { FoodSearchBox } from "@/components/food/FoodSearchBox";
import { searchFoodsAction } from "@/app/(app)/log/actions";
import type { FoodItem } from "@/types";

const MICRO_ROWS: { key: keyof FoodItem; label: string; unit: string }[] = [
  { key: "fibrePer100g", label: "Fibre", unit: "g" },
  { key: "sugarPer100g", label: "Sugar", unit: "g" },
  { key: "sodiumMgPer100g", label: "Sodium", unit: "mg" },
];

export default function FoodsPage() {
  const [selected, setSelected] = useState<FoodItem | null>(null);

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Foods</h1>
        <p className="text-sm text-text-tertiary">Search the Open Food Facts database.</p>
      </header>

      <GlassCard>
        <FoodSearchBox onSelect={setSelected} searchAction={searchFoodsAction} />
      </GlassCard>

      {selected && (
        <GlassCard className="mt-4">
          <div className="flex items-start gap-3">
            {selected.imageUrl ? (
              <Image
                src={selected.imageUrl}
                alt=""
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="h-14 w-14 shrink-0 rounded-lg bg-white/10" aria-hidden />
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-text-primary">{selected.name}</p>
              {selected.brand && <p className="truncate text-xs text-text-tertiary">{selected.brand}</p>}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-lg font-semibold text-text-primary">
                {Math.round(selected.caloriesPer100g)}
              </p>
              <p className="text-[10px] text-text-tertiary">kcal/100g</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-macro-protein">
                {Math.round(selected.proteinPer100g)}g
              </p>
              <p className="text-[10px] text-text-tertiary">Protein</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-macro-carbs">{Math.round(selected.carbsPer100g)}g</p>
              <p className="text-[10px] text-text-tertiary">Carbs</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-macro-fat">{Math.round(selected.fatPer100g)}g</p>
              <p className="text-[10px] text-text-tertiary">Fat</p>
            </div>
          </div>

          <dl className="mt-4 flex flex-col gap-1.5 border-t border-white/10 pt-4 text-sm">
            {MICRO_ROWS.map(({ key, label, unit }) => {
              const value = selected[key];
              if (value === undefined || value === null) return null;
              return (
                <div key={key} className="flex justify-between">
                  <dt className="text-text-tertiary">{label}</dt>
                  <dd className="text-text-secondary">
                    {Math.round(Number(value))}
                    {unit}
                  </dd>
                </div>
              );
            })}
          </dl>

          <Button asChild className="mt-4 w-full">
            <Link href="/log">Log this food</Link>
          </Button>
        </GlassCard>
      )}
    </main>
  );
}
