"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { progressStatus, remaining } from "@/lib/goalEngine";

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

/**
 * The dashboard's hero widget. Apple Fitness/Health convention: the
 * biggest number on the screen is "what's left to do today", not a raw
 * total -- that's the framing MyFitnessPal/MacroFactor users already
 * understand, so we keep it. The presentation itself -- eyebrow, bold
 * rule, bold-then-thin double rule, big tabular number -- is the app's
 * signature, borrowed from a real nutrition facts label rather than the
 * circular progress ring most fitness apps default to.
 */
export function CaloriesRemainingCard({ target, consumed, burned }: CaloriesRemainingCardProps) {
  const netTarget = target + burned;
  const left = remaining(netTarget, consumed);
  const status = progressStatus(consumed, netTarget);

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Calories remaining</p>
      <div className="label-rule" />
      <div className="label-rule-thin" />
      <p
        className={cn(
          "font-display text-5xl font-black tabular-nums tracking-tight",
          STATUS_TEXT_CLASS[status]
        )}
      >
        {left.toLocaleString()} <span className="text-base font-medium text-text-secondary">kcal</span>
      </p>
      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-secondary">
        <div>
          <dt className="inline">Goal </dt>
          <dd className="inline font-semibold tabular-nums text-text-primary">{target.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="inline">Food </dt>
          <dd className="inline font-semibold tabular-nums text-text-primary">{consumed.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="inline">Exercise </dt>
          <dd className="inline font-semibold tabular-nums text-text-primary">+{burned.toLocaleString()}</dd>
        </div>
      </dl>
    </Card>
  );
}
