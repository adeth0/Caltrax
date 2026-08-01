"use client";

import { Flag, Flame, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { progressStatus, remaining } from "@/lib/goalEngine";

const STATUS_RING_COLOR: Record<ReturnType<typeof progressStatus>, string> = {
  info: "var(--brand)",
  success: "var(--accent-success)",
  warning: "var(--accent-warning)",
  danger: "var(--accent-danger)",
};

const STATUS_TEXT_CLASS: Record<ReturnType<typeof progressStatus>, string> = {
  info: "text-text-primary",
  success: "text-accent-success",
  warning: "text-accent-warning",
  danger: "text-accent-danger",
};

interface CaloriesRemainingCardProps {
  target: number;
  consumed: number;
  burned: number;
}

const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Reverted back to a ring, per a direct instruction to match the
 * current MyFitnessPal dashboard specifically (not the classic diary
 * layout this component used one round ago) -- ring on the left, a
 * stacked Base Goal / Food / Exercise list with icons on the right,
 * same layout as the reference screenshot, in this app's yellow theme
 * instead of MFP's blue.
 */
export function CaloriesRemainingCard({ target, consumed, burned }: CaloriesRemainingCardProps) {
  const netTarget = target + burned;
  const left = remaining(netTarget, consumed);
  const status = progressStatus(consumed, netTarget);
  const usedFraction = netTarget > 0 ? Math.min(1, Math.max(0, consumed / netTarget)) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - usedFraction);

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Calories</p>
      <p className="mt-0.5 text-[11px] text-text-tertiary">Remaining = Goal - Food + Exercise</p>

      <div className="mt-3 flex items-center gap-5">
        <div className="relative h-40 w-40 shrink-0">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="var(--surface-raised)" strokeWidth="12" />
            <circle
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke={STATUS_RING_COLOR[status]}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className={cn(
                "font-display text-3xl font-black tabular-nums tracking-tight",
                STATUS_TEXT_CLASS[status]
              )}
            >
              {left.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-text-tertiary">Remaining</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Flag className="h-4 w-4 shrink-0 text-text-tertiary" />
            <div>
              <p className="text-[11px] text-text-tertiary">Base Goal</p>
              <p className="text-sm font-semibold tabular-nums text-text-primary">
                {target.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Utensils className="h-4 w-4 shrink-0 text-text-tertiary" />
            <div>
              <p className="text-[11px] text-text-tertiary">Food</p>
              <p className="text-sm font-semibold tabular-nums text-text-primary">
                {consumed.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Flame className="h-4 w-4 shrink-0 text-text-tertiary" />
            <div>
              <p className="text-[11px] text-text-tertiary">Exercise</p>
              <p className="text-sm font-semibold tabular-nums text-text-primary">
                {burned.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
