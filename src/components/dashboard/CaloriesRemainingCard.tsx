"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { progressStatus, remaining } from "@/lib/goalEngine";

const STATUS_TEXT_CLASS: Record<ReturnType<typeof progressStatus>, string> = {
  info: "text-brand",
  success: "text-accent-success",
  warning: "text-accent-warning",
  danger: "text-accent-danger",
};

interface CaloriesRemainingCardProps {
  target: number;
  consumed: number;
  burned: number;
}

/**
 * The dashboard's hero widget -- deliberately matching the classic
 * "calories remaining" layout: a big, bold number with its label
 * beside it, and a horizontal Goal/Food/Exercise/Net breakdown row
 * underneath, rather than a circular progress ring. This is a specific
 * style choice the person asked for directly, referencing exact
 * screenshots of that layout -- not a generic "modern nutrition app"
 * assumption this component used previously.
 */
export function CaloriesRemainingCard({ target, consumed, burned }: CaloriesRemainingCardProps) {
  const netTarget = target + burned;
  const left = remaining(netTarget, consumed);
  const status = progressStatus(consumed, netTarget);

  return (
    <Card>
      <div className="flex items-baseline gap-3">
        <p
          className={cn(
            "font-display text-4xl font-black tabular-nums tracking-tight",
            STATUS_TEXT_CLASS[status]
          )}
        >
          {left.toLocaleString()}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Calories remaining
        </p>
      </div>

      <div className="mt-4 grid grid-cols-4 divide-x divide-border rounded-control bg-surface-raised px-2 py-3">
        <div className="px-2 text-center">
          <p className="text-[11px] text-text-tertiary">Goal</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-text-primary">
            {target.toLocaleString()}
          </p>
        </div>
        <div className="px-2 text-center">
          <p className="text-[11px] text-text-tertiary">Food</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-text-primary">
            +{consumed.toLocaleString()}
          </p>
        </div>
        <div className="px-2 text-center">
          <p className="text-[11px] text-text-tertiary">Exercise</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-text-primary">
            -{burned.toLocaleString()}
          </p>
        </div>
        <div className="bg-brand/15 rounded-r-control px-2 text-center">
          <p className="text-[11px] text-text-tertiary">Net</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-brand">
            {(consumed - burned).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
