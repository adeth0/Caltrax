"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { MacroRing } from "@/components/ui/MacroRing";
import { progressStatus, remaining } from "@/lib/goalEngine";

const STATUS_COLOR: Record<ReturnType<typeof progressStatus>, string> = {
  info: "#0A84FF",
  success: "#30D158",
  warning: "#FF9F0A",
  danger: "#FF453A",
};

interface CaloriesRemainingCardProps {
  target: number;
  consumed: number;
  burned: number;
}

/**
 * The dashboard's hero widget. Apple Fitness/Health convention: the
 * biggest number on the screen is "what's left to do today", not a raw
 * total — that's the framing MyFitnessPal/MacroFactor users already
 * understand, so we keep it.
 */
export function CaloriesRemainingCard({ target, consumed, burned }: CaloriesRemainingCardProps) {
  const netTarget = target + burned;
  const left = remaining(netTarget, consumed);
  const status = progressStatus(consumed, netTarget);

  return (
    <GlassCard className="flex items-center justify-between gap-6">
      <div>
        <p className="text-sm text-text-secondary">Calories remaining</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-text-primary">
          {left.toLocaleString()}
        </p>
        <dl className="mt-4 flex gap-5 text-xs text-text-tertiary">
          <div>
            <dt className="inline">Goal </dt>
            <dd className="inline text-text-secondary">{target.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="inline">Food </dt>
            <dd className="inline text-text-secondary">{consumed.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="inline">Exercise </dt>
            <dd className="inline text-text-secondary">+{burned.toLocaleString()}</dd>
          </div>
        </dl>
      </div>
      <MacroRing
        label="Today"
        value={consumed}
        target={netTarget}
        unit=""
        color={STATUS_COLOR[status]}
        size={112}
        strokeWidth={10}
      />
    </GlassCard>
  );
}
