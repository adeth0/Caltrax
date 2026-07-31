"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProgressPhotoAction, deleteProgressPhotoAction } from "@/app/(app)/progress/photoActions";
import { downscaleToJpegBase64 } from "@/lib/imageDownscale";

export interface ProgressPhotoRow {
  id: string;
  imageUrl: string;
  note: string | null;
  date: string;
}

export function ProgressPhotosClient({ photos }: { photos: ProgressPhotoRow[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, startProcessing] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  function reset() {
    setPreviewUrl(null);
    setPhotoBase64(null);
    setNote("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));

    startProcessing(async () => {
      try {
        const base64 = await downscaleToJpegBase64(file);
        setPhotoBase64(base64);
      } catch {
        setError("Couldn't process that photo — try another.");
      }
    });
  }

  function handleSave() {
    if (!photoBase64) return;
    startSaving(async () => {
      try {
        await addProgressPhotoAction(photoBase64, "image/jpeg", note.trim() || null);
        reset();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't save that photo — try again.");
      }
    });
  }

  function handleDelete(id: string) {
    startDeleting(async () => {
      await deleteProgressPhotoAction(id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {!previewUrl && (
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <Camera className="h-4 w-4" />
            Add a progress photo
          </Button>
        )}

        {previewUrl && (
          <div>
            <div className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Progress photo preview"
                className="h-24 w-24 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <label className="mb-1 block text-xs text-text-secondary">Note (optional)</label>
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. 8 weeks in" />
              </div>
              <button
                type="button"
                onClick={reset}
                className="touch-target focus-ring shrink-0 text-xs text-text-tertiary hover:text-text-secondary"
              >
                Cancel
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-accent-danger">{error}</p>}
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isProcessing || !photoBase64}
              className="mt-3 w-full"
            >
              {isProcessing ? "Processing…" : isSaving ? "Saving…" : "Save photo"}
            </Button>
          </div>
        )}
      </Card>

      {photos.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-tertiary">
          No progress photos yet — add your first one above to start a visual timeline.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="overflow-hidden rounded-control bg-surface-raised">
              <div className="relative aspect-square w-full">
                <Image
                  src={photo.imageUrl}
                  alt={photo.note ?? photo.date}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  disabled={isDeleting}
                  aria-label={`Delete photo from ${photo.date}`}
                  className="touch-target focus-ring absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-text-primary">{photo.date}</p>
                {photo.note && <p className="truncate text-xs text-text-tertiary">{photo.note}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
