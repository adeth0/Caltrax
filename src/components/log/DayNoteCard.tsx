"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { NotebookPen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { saveDayNoteAction } from "@/app/(app)/log/dayNoteActions";

export function DayNoteCard({ initialNote }: { initialNote: string | null }) {
  const router = useRouter();
  const [note, setNote] = useState(initialNote ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, startSaving] = useTransition();

  function handleSave() {
    startSaving(async () => {
      await saveDayNoteAction(note);
      setIsEditing(false);
      router.refresh();
    });
  }

  if (!isEditing && !initialNote) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="control focus-ring touch-target flex w-full items-center gap-2 rounded-control border border-dashed border-border bg-surface-raised px-3 py-2.5 text-sm text-text-tertiary hover:bg-border-strong"
      >
        <NotebookPen className="h-4 w-4" />
        Add a note about today
      </button>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2">
        <NotebookPen className="h-4 w-4 text-text-tertiary" />
        <p className="text-sm font-semibold text-text-primary">Today&apos;s note</p>
      </div>
      {isEditing ? (
        <>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Travelling today, ate at restaurants for every meal"
            rows={3}
            className="control focus-ring mt-2 w-full resize-none rounded-control border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
          />
          <div className="mt-2 flex gap-2">
            <Button type="button" size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setNote(initialNote ?? "");
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="control focus-ring mt-1.5 w-full rounded-control text-left text-sm text-text-secondary hover:text-text-primary"
        >
          {note}
        </button>
      )}
    </Card>
  );
}
