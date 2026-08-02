"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";

interface MacroSplitChartProps {
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
}

const COLORS = {
  carbs: "var(--macro-carbs)",
  fat: "var(--macro-fat)",
  protein: "var(--macro-protein)",
};

/** % of total calories each macro represents -- protein/carbs = 4 kcal/g, fat = 9 kcal/g. */
function macroPercents(proteinG: number, carbsG: number, fatG: number) {
  const carbsCal = carbsG * 4;
  const proteinCal = proteinG * 4;
  const fatCal = fatG * 9;
  const total = carbsCal + proteinCal + fatCal;
  if (total <= 0) return { carbs: 0, protein: 0, fat: 0 };
  return {
    carbs: Math.round((carbsCal / total) * 100),
    protein: Math.round((proteinCal / total) * 100),
    fat: Math.round((fatCal / total) * 100),
  };
}

/**
 * Macro breakdown as a pie chart with a Total/Goal comparison list --
 * matching the classic "Nutrition" tab layout directly, a specific
 * style request referencing exact screenshots, replacing this
 * component's previous horizontal-progress-bar version.
 */
export function MacroSplitChart({
  proteinG,
  carbsG,
  fatG,
  proteinTargetG,
  carbsTargetG,
  fatTargetG,
}: MacroSplitChartProps) {
  const actual = macroPercents(proteinG, carbsG, fatG);
  const goal = macroPercents(proteinTargetG, carbsTargetG, fatTargetG);
  const hasData = proteinG + carbsG + fatG > 0;

  const chartData = [
    { name: "Carbohydrates", value: hasData ? actual.carbs : 1, color: COLORS.carbs },
    { name: "Fat", value: hasData ? actual.fat : 0, color: COLORS.fat },
    { name: "Protein", value: hasData ? actual.protein : 0, color: COLORS.protein },
  ];

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Calorie breakdown</p>

      <div className="mt-3 flex items-center gap-4">
        <div className="relative h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" innerRadius={0} outerRadius="100%" stroke="none">
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {hasData && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="bg-base/70 rounded px-1.5 py-0.5 text-sm font-bold text-text-primary">
                {actual.carbs}%
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 gap-y-1.5 text-xs">
            <span className="text-text-tertiary">&nbsp;</span>
            <span className="text-right font-semibold text-text-tertiary">Total</span>
            <span className="text-right font-semibold text-text-tertiary">Goal</span>

            <span className="flex items-center gap-1.5 text-text-primary">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS.carbs }} />
              Carbohydrates
            </span>
            <span className="text-right tabular-nums text-text-primary">{actual.carbs}%</span>
            <span className="text-right tabular-nums text-text-tertiary">{goal.carbs}%</span>

            <span className="flex items-center gap-1.5 text-text-primary">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS.fat }} />
              Fat
            </span>
            <span className="text-right tabular-nums text-text-primary">{actual.fat}%</span>
            <span className="text-right tabular-nums text-text-tertiary">{goal.fat}%</span>

            <span className="flex items-center gap-1.5 text-text-primary">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS.protein }} />
              Protein
            </span>
            <span className="text-right tabular-nums text-text-primary">{actual.protein}%</span>
            <span className="text-right tabular-nums text-text-tertiary">{goal.protein}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
