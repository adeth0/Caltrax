"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { logCustomFoodAction, recognizeMealPhotoAction } from "@/app/(app)/log/actions";
import type { RecognizedFoodItem } from "@/lib/ai/mealRecognition";
import type { MealType } from "@/types";

interface EditableItem extends RecognizedFoodItem {
  include: boolean;
}

/** Resizes to a max 1024px edge JPEG and returns base64 (no data: prefix) — keeps the API payload small and fast. */
async function downscaleToJpegBase64(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1024;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  return dataUrl.split(",")[1] ?? "";
}

interface MealPhotoCaptureProps {
  mealType: MealType;
  onDone: () => void;
}

export function MealPhotoCapture({ mealType, onDone }: MealPhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [items, setItems] = useState<EditableItem[] | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isSaving, startSaving] = useTransition();

  function reset() {
    setPreviewUrl(null);
    setItems(null);
    setNotes(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    setItems(null);

    startAnalyzing(async () => {
      try {
        const base64 = await downscaleToJpegBase64(file);
        const result = await recognizeMealPhotoAction(base64, "image/jpeg");
        setItems(result.items.map((item) => ({ ...item, include: true })));
        setNotes(result.notes ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't analyze that photo.");
      }
    });
  }

  function updateItem(index: number, patch: Partial<EditableItem>) {
    setItems((prev) => (prev ? prev.map((it, i) => (i === index ? { ...it, ...patch } : it)) : prev));
  }

  function handleSave() {
    if (!items) return;
    const toSave = items.filter((i) => i.include);
    if (toSave.length === 0) {
      setError("Select at least one item to log");
      return;
    }
    startSaving(async () => {
      try {
        for (const item of toSave) {
          await logCustomFoodAction({
            name: item.name,
            caloriesPer100g: item.caloriesPer100g,
            proteinPer100g: item.proteinPer100g,
            carbsPer100g: item.carbsPer100g,
            fatPer100g: item.fatPer100g,
            servingGrams: item.estimatedGrams,
            mealType,
          });
        }
        reset();
        onDone();
      } catch {
        setError("Couldn't save those items — try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewUrl && (
        <Button type="button" variant="glass" onClick={() => fileInputRef.current?.click()}>
          📷 Snap a meal photo
        </Button>
      )}

      {previewUrl && (
        <GlassCard>
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Meal preview" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              {isAnalyzing && <p className="text-sm text-text-tertiary">Analyzing photo…</p>}
              {error && <p className="text-sm text-accent-danger">{error}</p>}
              {notes && !isAnalyzing && <p className="text-xs text-text-tertiary">{notes}</p>}
            </div>
            <button
              type="button"
              onClick={reset}
              className="touch-target focus-ring shrink-0 text-xs text-text-tertiary hover:text-text-secondary"
            >
              Cancel
            </button>
          </div>

          {items && items.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              {items.map((item, index) => {
                const kcal = Math.round((item.caloriesPer100g * item.estimatedGrams) / 100);
                return (
                  <div key={index} className="flex items-center gap-3 rounded-control bg-white/5 p-3">
                    <input
                      type="checkbox"
                      checked={item.include}
                      onChange={(e) => updateItem(index, { include: e.target.checked })}
                      className="touch-target h-5 w-5 shrink-0 accent-accent-info"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary">{item.name}</p>
                      <p className="text-xs text-text-tertiary">{kcal} kcal</p>
                    </div>
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={item.estimatedGrams}
                      onChange={(e) => updateItem(index, { estimatedGrams: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                    <span className="text-xs text-text-tertiary">g</span>
                  </div>
                );
              })}

              <Button type="button" onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? "Adding…" : `Add to ${mealType}`}
              </Button>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
