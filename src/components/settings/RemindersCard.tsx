"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillSelect } from "@/components/ui/PillSelect";
import {
  createReminderAction,
  deleteReminderAction,
  toggleReminderActiveAction,
  type ReminderType,
} from "@/app/(app)/settings/actions";

const TYPE_OPTIONS: { value: ReminderType; label: string }[] = [
  { value: "meal", label: "Meal" },
  { value: "water", label: "Water" },
  { value: "exercise", label: "Exercise" },
  { value: "weight_check", label: "Weigh-in" },
  { value: "supplement", label: "Supplement" },
  { value: "custom", label: "Custom" },
];

const TYPE_LABEL: Record<ReminderType, string> = {
  meal: "Meal",
  water: "Water",
  exercise: "Exercise",
  weight_check: "Weigh-in",
  supplement: "Supplement",
  custom: "Custom",
};

export interface ReminderRow {
  id: string;
  type: ReminderType;
  label: string;
  time: string;
  active: boolean;
}

interface RemindersCardProps {
  reminders: ReminderRow[];
}

export function RemindersCard({ reminders }: RemindersCardProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<ReminderType>("meal");
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("08:00");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isBusy, startBusy] = useTransition();

  function handleCreate() {
    if (!label.trim()) {
      setError("Enter a label");
      return;
    }
    setError(null);
    startSaving(async () => {
      try {
        await createReminderAction({ type, label: label.trim(), time });
        setLabel("");
        setShowForm(false);
        router.refresh();
      } catch {
        setError("Couldn't save that reminder — try again.");
      }
    });
  }

  function handleToggle(id: string, active: boolean) {
    setBusyId(id);
    startBusy(async () => {
      await toggleReminderActiveAction(id, active);
      router.refresh();
      setBusyId(null);
    });
  }

  function handleDelete(id: string) {
    setBusyId(id);
    startBusy(async () => {
      await deleteReminderAction(id);
      router.refresh();
      setBusyId(null);
    });
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-primary">Reminders</p>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="touch-target focus-ring control px-2 text-xs text-accent-info hover:underline"
          >
            + Add
          </button>
        )}
      </div>

      {reminders.length === 0 && !showForm && (
        <p className="mt-2 text-xs text-text-tertiary">
          No reminders yet — add one for meals, water, or weigh-ins.
        </p>
      )}

      {reminders.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {reminders.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-2 rounded-control bg-white/5 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-text-primary">{r.label}</p>
                <p className="text-xs text-text-tertiary">
                  {TYPE_LABEL[r.type]} · {r.time}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  disabled={isBusy && busyId === r.id}
                  onClick={() => handleToggle(r.id, !r.active)}
                  className={`touch-target focus-ring control px-2 text-xs ${
                    r.active ? "text-accent-info" : "text-text-tertiary"
                  }`}
                >
                  {r.active ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  disabled={isBusy && busyId === r.id}
                  onClick={() => handleDelete(r.id)}
                  className="touch-target focus-ring control px-2 text-xs text-text-tertiary hover:text-accent-danger"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <div className="mt-3 flex flex-col gap-3 rounded-control border border-accent-info/30 bg-accent-info/10 p-3">
          <PillSelect
            name="reminder-type"
            value={type}
            onChange={(v) => setType(v as ReminderType)}
            columns={2}
            options={TYPE_OPTIONS}
          />
          <Input
            placeholder="Label, e.g. Log breakfast"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-secondary" htmlFor="reminder-time">
              Time
            </label>
            <Input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-32"
            />
          </div>
          {error && <p className="text-xs text-accent-danger">{error}</p>}
          <div className="flex gap-2">
            <Button type="button" onClick={handleCreate} disabled={isSaving} className="flex-1">
              {isSaving ? "Saving…" : "Save reminder"}
            </Button>
            <Button type="button" variant="glass" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
