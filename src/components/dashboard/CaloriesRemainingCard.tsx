"use client";

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

const RADIUS = 78;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The dashboard's hero widget -- a circular progress ring around
 * "calories remaining today", the convention most nutrition-tracking
 * app users already recognise at a glance. The ring shows how much of
 * today's calorie budget has been used so far; the big number in the
 * centre is what's left, matching the same "what's left to do today"
 * framing this card always used, just with the ring as the visual
 * anchor now instead of a text-only layout.
 */
export function CaloriesRemainingCard({ target, consumed, burned }: CaloriesRemainingCardProps) {
  const netTarget = target + burned;
  const left = remaining(netTarget, consumed);
  const status = progressStatus(consumed, netTarget);
  const usedFraction = netTarget > 0 ? Math.min(1, Math.max(0, consumed / netTarget)) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - usedFraction);

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Calories remaining</p>

      <div className="mt-3 flex items-center justify-center">
        <div className="relative h-[200px] w-[200px]">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke="var(--surface-raised)"
              strokeWidth="14"
            />
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={STATUS_RING_COLOR[status]}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className={cn(
                "font-display text-4xl font-black tabular-nums tracking-tight",
                STATUS_TEXT_CLASS[status]
              )}
            >
              {left.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-text-tertiary">kcal left</p>
          </div>
        </div>
      </div>

      <dl className="mt-4 flex justify-center gap-x-6 gap-y-1 text-sm text-text-secondary">
        <div className="text-center">
          <dt className="text-xs text-text-tertiary">Goal</dt>
          <dd className="font-semibold tabular-nums text-text-primary">{target.toLocaleString()}</dd>
        </div>
        <div className="text-center">
          <dt className="text-xs text-text-tertiary">Food</dt>
          <dd className="font-semibold tabular-nums text-text-primary">{consumed.toLocaleString()}</dd>
        </div>
        <div className="text-center">
          <dt className="text-xs text-text-tertiary">Exercise</dt>
          <dd className="font-semibold tabular-nums text-text-primary">+{burned.toLocaleString()}</dd>
        </div>
      </dl>
    </Card>
  );
}
