"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeightTrendCard } from "@/components/dashboard/WeightTrendCard";
import { HydrationCard } from "@/components/dashboard/HydrationCard";
import { deleteWeightLogAction, logWaterAction, logWeightAction } from "@/app/(app)/progress/actions";

export interface WeightPointRow {
  date: string;
  weightKg: number;
  id: string;
}

interface ProgressClientProps {
  weightPoints: WeightPointRow[];
  goalWeightKg?: number;
  waterConsumedMl: number;
  waterTargetMl: number;
}

export function ProgressClient({
  weightPoints,
  goalWeightKg,
  waterConsumedMl,
  waterTargetMl,
}: ProgressClientProps) {
  const router = useRouter();
  const [weightInput, setWeightInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSavingWeight, startSavingWeight] = useTransition();
  const [isSavingWater, startSavingWater] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  function handleLogWeight() {
    const value = Number(weightInput);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid weight in kg");
      return;
    }
    setError(null);
    startSavingWeight(async () => {
      try {
        await logWeightAction(value);
        setWeightInput("");
        router.refresh();
      } catch {
        setError("Couldn't save that — try again.");
      }
    });
  }

  function handleAddWater(ml: number) {
    startSavingWater(async () => {
      await logWaterAction(ml);
      router.refresh();
    });
  }

  function handleDeleteWeight(id: string) {
    startDeleting(async () => {
      await deleteWeightLogAction(id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <GlassCard>
        <p className="mb-3 text-sm font-medium text-text-primary">Log today&apos;s weight</p>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder="e.g. 81.4"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="max-w-[140px]"
          />
          <span className="text-sm text-text-tertiary">kg</span>
          <Button type="button" onClick={handleLogWeight} disabled={isSavingWeight} className="ml-auto">
            {isSavingWeight ? "Saving…" : "Log"}
          </Button>
        </div>
        {error && <p className="mt-2 text-xs text-accent-danger">{error}</p>}
      </GlassCard>

      {weightPoints.length > 0 ? (
        <WeightTrendCard
          points={weightPoints.map((p) => ({ date: p.date, weightKg: p.weightKg }))}
          goalWeightKg={goalWeightKg}
        />
      ) : (
        <GlassCard>
          <p className="text-sm text-text-tertiary">
            No weigh-ins yet — log your first one above to start your trend.
          </p>
        </GlassCard>
      )}

      <HydrationCard consumedMl={waterConsumedMl} targetMl={waterTargetMl} onAdd={handleAddWater} />
      {isSavingWater && <p className="-mt-2 text-xs text-text-tertiary">Saving…</p>}

      {weightPoints.length > 0 && (
        <GlassCard>
          <p className="mb-3 text-sm font-medium text-text-primary">Weigh-in history</p>
          <ul className="flex flex-col gap-2">
            {[...weightPoints]
              .reverse()
              .slice(0, 10)
              .map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-control bg-white/5 px-3 py-2"
                >
                  <span className="text-sm text-text-secondary">{p.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-primary">{p.weightKg.toFixed(1)} kg</span>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDeleteWeight(p.id)}
                      className="touch-target focus-ring rounded-control px-2 text-xs text-text-tertiary hover:text-accent-danger"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
