"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logWeightAction } from "@/app/(app)/progress/actions";

export function QuickWeightModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  function handleSave() {
    const value = Number(weight);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid weight");
      return;
    }
    setError(null);
    startSaving(async () => {
      try {
        await logWeightAction(value);
        setWeight("");
        onOpenChange(false);
        router.refresh();
      } catch {
        setError("Couldn't save that — try again.");
      }
    });
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Log weight">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="decimal"
          step="0.1"
          placeholder="e.g. 81.4"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          autoFocus
        />
        <span className="text-sm text-text-tertiary">kg</span>
      </div>
      {error && <p className="mt-2 text-xs text-accent-danger">{error}</p>}
      <Button type="button" onClick={handleSave} disabled={isSaving} className="mt-4 w-full">
        {isSaving ? "Saving…" : "Save"}
      </Button>
    </Modal>
  );
}
