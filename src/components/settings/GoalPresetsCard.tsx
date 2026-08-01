"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookmarkPlus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  activateGoalPresetAction,
  deleteGoalPresetAction,
  saveGoalPresetAction,
  type GoalPresetInput,
} from "@/app/(app)/settings/goalPresetActions";

export interface GoalPresetSummary {
  id: string;
  name: string;
}

export function GoalPresetsCard({
  presets,
  currentSettings,
}: {
  presets: GoalPresetSummary[];
  currentSettings: GoalPresetInput;
}) {
  const router = useRouter();
  const [showSave, setShowSave] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isActivating, startActivating] = useTransition();
  const [activatedName, setActivatedName] = useState<string | null>(null);

  function handleSave() {
    if (!presetName.trim()) {
      setError("Enter a name for this preset");
      return;
    }
    setError(null);
    startSaving(async () => {
      try {
        await saveGoalPresetAction({ ...currentSettings, name: presetName });
        setPresetName("");
        setShowSave(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't save that preset — try again.");
      }
    });
  }

  function handleActivate(preset: GoalPresetSummary) {
    startActivating(async () => {
      await activateGoalPresetAction(preset.id);
      setActivatedName(preset.name);
      router.refresh();
    });
  }

  function handleDelete(presetId: string) {
    startActivating(async () => {
      await deleteGoalPresetAction(presetId);
      router.refresh();
    });
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-primary">Goal presets</p>
        <button
          type="button"
          onClick={() => setShowSave((v) => !v)}
          className="control focus-ring touch-target flex items-center gap-1 text-xs font-medium text-accent-info hover:underline"
        >
          <BookmarkPlus className="h-3.5 w-3.5" />
          Save current
        </button>
      </div>
      <p className="mt-1 text-xs text-text-tertiary">
        Save your current goal, activity level, diet, and target weight as a named preset (e.g.
        &quot;Cutting&quot; or &quot;Bulking&quot;), then switch back with one tap whenever your approach
        changes.
      </p>

      {showSave && (
        <div className="mt-3 flex items-center gap-2 rounded-control bg-surface-raised p-2.5">
          <Input
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="e.g. Cutting"
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-accent-danger">{error}</p>}

      {presets.length === 0 ? (
        <p className="mt-3 text-sm text-text-tertiary">No presets saved yet.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-1.5">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between gap-2 rounded-control bg-surface-raised px-3 py-2"
            >
              <p className="text-sm font-medium text-text-primary">{preset.name}</p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => handleActivate(preset)}
                  disabled={isActivating}
                >
                  Activate
                </Button>
                <button
                  type="button"
                  onClick={() => handleDelete(preset.id)}
                  disabled={isActivating}
                  aria-label={`Delete ${preset.name}`}
                  className="touch-target focus-ring text-text-tertiary hover:text-accent-danger"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activatedName && (
        <p className="mt-2 text-xs text-accent-success">
          &quot;{activatedName}&quot; activated — your goals have been updated.
        </p>
      )}
    </Card>
  );
}
