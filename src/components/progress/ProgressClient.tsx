"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";
import { WeightTrendCard } from "@/components/dashboard/WeightTrendCard";
import { HydrationCard } from "@/components/dashboard/HydrationCard";
import { deleteWeightLogAction, logWaterAction, logWeightAction } from "@/app/(app)/progress/actions";
import { lbsToKg } from "@/lib/units";

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
  weightUnit?: "kg" | "lbs";
}

export function ProgressClient({
  weightPoints,
  goalWeightKg,
  waterConsumedMl,
  waterTargetMl,
  weightUnit = "kg",
}: ProgressClientProps) {
  const router = useRouter();
  const [weightInput, setWeightInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSavingWeight, startSavingWeight] = useTransition();
  const [isSavingWater, startSavingWater] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<WeightPointRow | null>(null);

  function handleLogWeight() {
    const value = Number(weightInput);
    if (!Number.isFinite(value) || value <= 0) {
      setError(`Enter a valid weight in ${weightUnit}`);
      return;
    }
    const valueKg = weightUnit === "lbs" ? lbsToKg(value) : value;
    setError(null);
    startSavingWeight(async () => {
      try {
        await logWeightAction(valueKg);
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
      setPendingDelete(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <p className="mb-3 text-sm font-medium text-text-primary">Log today&apos;s weight</p>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder={weightUnit === "lbs" ? "e.g. 179.5" : "e.g. 81.4"}
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="max-w-[140px]"
          />
          <span className="text-sm text-text-tertiary">{weightUnit}</span>
          <Button type="button" onClick={handleLogWeight} disabled={isSavingWeight} className="ml-auto">
            {isSavingWeight ? "Saving…" : "Log"}
          </Button>
        </div>
        {error && <p className="mt-2 text-xs text-accent-danger">{error}</p>}
      </Card>

      {weightPoints.length > 0 ? (
        <WeightTrendCard
          points={weightPoints.map((p) => ({ date: p.date, weightKg: p.weightKg }))}
          goalWeightKg={goalWeightKg}
          weightUnit={weightUnit}
        />
      ) : (
        <Card>
          <p className="text-sm text-text-tertiary">
            No weigh-ins yet — log your first one above to start your trend.
          </p>
        </Card>
      )}

      <HydrationCard consumedMl={waterConsumedMl} targetMl={waterTargetMl} onAdd={handleAddWater} />
      {isSavingWater && <p className="-mt-2 text-xs text-text-tertiary">Saving…</p>}

      {weightPoints.length > 0 && (
        <Card>
          <p className="mb-3 text-sm font-medium text-text-primary">Weigh-in history</p>
          <ul className="flex flex-col gap-2">
            {[...weightPoints]
              .reverse()
              .slice(0, 10)
              .map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-control bg-surface-raised px-3 py-2"
                >
                  <span className="text-sm text-text-secondary">{p.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-primary">{p.weightKg.toFixed(1)} kg</span>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setPendingDelete(p)}
                      className="touch-target focus-ring rounded-control px-2 text-xs text-text-tertiary hover:text-accent-danger"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </Card>
      )}

      <Modal
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Remove this weigh-in?"
        description={
          pendingDelete ? `${pendingDelete.date} · ${pendingDelete.weightKg.toFixed(1)} kg` : undefined
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
            disabled={isDeleting}
            onClick={() => pendingDelete && handleDeleteWeight(pendingDelete.id)}
          >
            {isDeleting ? "Removing…" : "Remove"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
