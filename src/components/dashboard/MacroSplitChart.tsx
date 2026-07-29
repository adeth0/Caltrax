"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";

interface MacroSplitChartProps {
  proteinG: number;
  carbsG: number;
  fatG: number;
}

// Standard Atwater factors -- kcal per gram.
const KCAL_PER_G_PROTEIN = 4;
const KCAL_PER_G_CARBS = 4;
const KCAL_PER_G_FAT = 9;

export function MacroSplitChart({ proteinG, carbsG, fatG }: MacroSplitChartProps) {
  const proteinKcal = proteinG * KCAL_PER_G_PROTEIN;
  const carbsKcal = carbsG * KCAL_PER_G_CARBS;
  const fatKcal = fatG * KCAL_PER_G_FAT;
  const totalKcal = proteinKcal + carbsKcal + fatKcal;

  const data = [
    { name: "Protein", value: proteinKcal, colorVar: "var(--macro-protein)" },
    { name: "Carbs", value: carbsKcal, colorVar: "var(--macro-carbs)" },
    { name: "Fat", value: fatKcal, colorVar: "var(--macro-fat)" },
  ];

  const hasData = totalKcal > 0;

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Calorie split</p>
      <div className="label-rule" />
      <div className="label-rule-thin" />
      {hasData ? (
        <div className="flex items-center gap-4">
          <div className="relative h-32 w-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="68%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.colorVar} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-lg font-bold tabular-nums text-text-primary">
                {Math.round(totalKcal)}
              </span>
              <span className="text-[10px] text-text-tertiary">kcal</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 text-text-secondary">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.colorVar }} />
                  {entry.name}
                </span>
                <span className="font-semibold tabular-nums text-text-primary">
                  {totalKcal > 0 ? Math.round((entry.value / totalKcal) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-tertiary">Log a meal to see today&apos;s calorie split.</p>
      )}
    </Card>
  );
}
