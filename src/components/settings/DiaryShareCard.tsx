"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Share2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { generateDiaryShareAction, revokeDiaryShareAction } from "@/app/(app)/settings/diaryShareActions";

export function DiaryShareCard({ initialToken }: { initialToken: string | null }) {
  const router = useRouter();
  const [token, setToken] = useState(initialToken);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const shareUrl = token && typeof window !== "undefined" ? `${window.location.origin}/shared/${token}` : "";

  function handleGenerate() {
    startTransition(async () => {
      const { token: newToken } = await generateDiaryShareAction();
      setToken(newToken);
      setCopied(false);
      router.refresh();
    });
  }

  function handleRevoke() {
    startTransition(async () => {
      await revokeDiaryShareAction();
      setToken(null);
      router.refresh();
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Share2 className="h-4 w-4 text-text-tertiary" />
        <p className="text-sm font-medium text-text-primary">Share my diary</p>
      </div>
      <p className="mt-1 text-xs text-text-tertiary">
        Generate a read-only link showing today&apos;s calories, macros, and meals — for a coach, trainer, or
        friend. No account needed on their end. Nothing else about your account (weight, photos, settings) is
        visible through this link.
      </p>

      {token ? (
        <>
          <div className="mt-3 flex items-center gap-2 rounded-control bg-surface-raised px-3 py-2.5">
            <p className="min-w-0 flex-1 truncate text-xs text-text-secondary">{shareUrl}</p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy share link"
              className="touch-target focus-ring shrink-0 text-text-tertiary hover:text-text-primary"
            >
              {copied ? <Check className="h-4 w-4 text-accent-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={handleGenerate} disabled={isPending}>
              {isPending ? "Working…" : "Generate new link"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="text-accent-danger"
              onClick={handleRevoke}
              disabled={isPending}
            >
              Revoke
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-text-tertiary">
            Generating a new link immediately disables this one for anyone who already has it.
          </p>
        </>
      ) : (
        <Button type="button" size="sm" onClick={handleGenerate} disabled={isPending} className="mt-3">
          {isPending ? "Creating…" : "Create share link"}
        </Button>
      )}
    </Card>
  );
}
