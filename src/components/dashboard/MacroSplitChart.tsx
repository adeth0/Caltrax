"use client";

import { Card } from "@/components/ui/Card";

interface MacroSplitChartProps {
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
}

interface MacroRowData {
  name: string;
  consumed: number;
  target: number;
  colorVar: string;
}

function MacroRow({ name, consumed, target, colorVar }: MacroRowData) {
  const pct = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium text-text-primary">{name}</span>
        <span className="text-text-tertiary">
          <span className="font-semibold tabular-nums text-text-primary">{Math.round(consumed)}</span>
          {" / "}
          {Math.round(target)}g
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, background: colorVar }}
        />
      </div>
    </div>
  );
}

/**
 * Macro progress shown as horizontal bars against each target -- the
 * "Nutrition" view style most nutrition-tracking apps use, replacing
 * the previous donut-chart split (which only showed the proportion
 * eaten so far, not progress toward an actual target -- genuinely
 * different information, and the target-progress framing is more
 * directly useful day to day).
 */
export function MacroSplitChart({
  proteinG,
  carbsG,
  fatG,
  proteinTargetG,
  carbsTargetG,
  fatTargetG,
}: MacroSplitChartProps) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Macros</p>
      <div className="mt-3 flex flex-col gap-3">
        <MacroRow
          name="Protein"
          consumed={proteinG}
          target={proteinTargetG}
          colorVar="var(--macro-protein)"
        />
        <MacroRow name="Carbs" consumed={carbsG} target={carbsTargetG} colorVar="var(--macro-carbs)" />
        <MacroRow name="Fat" consumed={fatG} target={fatTargetG} colorVar="var(--macro-fat)" />
      </div>
    </Card>
  );
}
