"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { logWaterAction } from "@/app/(app)/progress/actions";

const PRESETS = [250, 500, 750];

export function QuickWaterModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();

  function handleAdd(amountMl: number) {
    startSaving(async () => {
      await logWaterAction(amountMl);
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Log water">
      <div className="flex gap-2">
        {PRESETS.map((amount) => (
          <Button
            key={amount}
            type="button"
            variant="secondary"
            disabled={isSaving}
            onClick={() => handleAdd(amount)}
            className="flex-1"
          >
            +{amount}ml
          </Button>
        ))}
      </div>
    </Modal>
  );
}
