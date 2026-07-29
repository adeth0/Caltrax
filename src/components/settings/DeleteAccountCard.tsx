"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";
import { deleteAccountAction } from "@/app/(app)/settings/actions";

const CONFIRM_TEXT = "DELETE";

/**
 * Requires typing "DELETE" verbatim before the button even becomes
 * clickable -- this is the app's single most destructive, irreversible
 * action (wipes every table tied to the account plus the auth user
 * itself), so it gets a stronger confirmation than the app's usual
 * confirm-modal pattern used for removing a single meal entry or recipe.
 */
export function DeleteAccountCard() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, startDeleting] = useTransition();

  const canConfirm = confirmText === CONFIRM_TEXT;

  function handleDelete() {
    setError(null);
    startDeleting(async () => {
      try {
        await deleteAccountAction();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong deleting your account.");
      }
    });
  }

  return (
    <Card className="border-accent-danger/30">
      <p className="text-sm font-medium text-accent-danger">Delete account</p>
      <p className="mt-1 text-xs text-text-tertiary">
        Permanently deletes your account and every piece of data tied to it — meal history, weight logs,
        recipes, connected devices, achievements, everything. This cannot be undone.
      </p>
      <Button
        type="button"
        variant="secondary"
        className="mt-3 text-accent-danger"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Delete my account
      </Button>

      <Modal
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setConfirmText("");
            setError(null);
          }
        }}
        title="Delete your account?"
        description="This permanently deletes everything — there is no way to recover it afterwards."
      >
        <div className="flex flex-col gap-3">
          <label className="text-sm text-text-secondary">
            Type <span className="font-semibold text-text-primary">{CONFIRM_TEXT}</span> to confirm:
          </label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_TEXT}
            autoComplete="off"
          />
          {error && <p className="text-sm text-accent-danger">{error}</p>}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              disabled={!canConfirm || isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting…" : "Permanently delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
