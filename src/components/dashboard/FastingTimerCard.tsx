"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Timer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { endFastAction, startFastAction } from "@/app/(app)/dashboard/fastingActions";

export interface ActiveFast {
  id: string;
  startedAt: string; // ISO string
  targetHours: number | null;
}

export interface CompletedFast {
  id: string;
  durationHours: number;
  date: string;
}

const TARGET_PRESETS = [12, 14, 16, 18, 20, 24];

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function FastingTimerCard({
  activeFast,
  recentFasts,
}: {
  activeFast: ActiveFast | null;
  recentFasts: CompletedFast[];
}) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const [targetHours, setTargetHours] = useState(16);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!activeFast) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeFast]);

  function handleStart() {
    startTransition(async () => {
      await startFastAction(targetHours);
      router.refresh();
    });
  }

  function handleEnd() {
    if (!activeFast) return;
    startTransition(async () => {
      await endFastAction(activeFast.id);
      router.refresh();
    });
  }

  if (!activeFast) {
    return (
      <Card>
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-text-tertiary" />
          <p className="text-sm font-semibold text-text-primary">Fasting</p>
        </div>
        <p className="mt-1 text-xs text-text-tertiary">Not currently fasting.</p>
        <div className="mt-3 flex gap-1.5">
          {TARGET_PRESETS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setTargetHours(h)}
              className={cn(
                "control focus-ring touch-target flex-1 rounded-control py-2 text-sm font-medium",
                targetHours === h
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface-raised text-text-secondary hover:bg-border-strong"
              )}
            >
              {h}h
            </button>
          ))}
        </div>
        <Button type="button" onClick={handleStart} disabled={isPending} className="mt-3 w-full">
          {isPending ? "Starting…" : `Start a ${targetHours}h fast`}
        </Button>
      </Card>
    );
  }

  const elapsedMs = now - new Date(activeFast.startedAt).getTime();
  const targetMs = (activeFast.targetHours ?? 16) * 3600 * 1000;
  const progressPct = Math.min(100, (elapsedMs / targetMs) * 100);
  const reachedTarget = elapsedMs >= targetMs;

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-accent-info" />
        <p className="text-sm font-semibold text-text-primary">Fasting</p>
      </div>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums text-text-primary">
        {formatElapsed(elapsedMs)}
      </p>
      <p className="mt-0.5 text-xs text-text-tertiary">
        {reachedTarget
          ? `Target of ${activeFast.targetHours}h reached — great work.`
          : `Aiming for ${activeFast.targetHours ?? 16}h`}
      </p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            reachedTarget ? "bg-accent-success" : "bg-brand"
          )}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={handleEnd}
        disabled={isPending}
        className="mt-3 w-full"
      >
        {isPending ? "Ending…" : "End fast"}
      </Button>

      {recentFasts.length > 0 && (
        <div className="mt-3 border-t border-border pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Recent</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {recentFasts.map((f) => (
              <span
                key={f.id}
                className="rounded-full bg-surface-raised px-2.5 py-1 text-xs text-text-secondary"
              >
                {f.date}: {f.durationHours}h
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
