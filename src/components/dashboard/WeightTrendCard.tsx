"use client";

import { Card } from "@/components/ui/Card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface WeightPoint {
  date: string; // short label, e.g. "Mon"
  weightKg: number;
}

interface WeightTrendCardProps {
  points: WeightPoint[];
  goalWeightKg?: number;
}

export function WeightTrendCard({ points, goalWeightKg }: WeightTrendCardProps) {
  const latest = points.at(-1)?.weightKg;
  const first = points[0]?.weightKg;
  const delta = latest !== undefined && first !== undefined ? latest - first : 0;

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Weight trend</p>
      <div className="label-rule" />
      <div className="label-rule-thin" />
      <div className="flex items-baseline justify-between">
        {latest !== undefined && (
          <p className="font-display text-2xl font-bold tabular-nums text-text-primary">
            {latest.toFixed(1)} <span className="text-sm font-medium text-text-secondary">kg</span>
          </p>
        )}
        {points.length > 1 && (
          <p className={`text-xs font-medium ${delta <= 0 ? "text-accent-success" : "text-accent-warning"}`}>
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)} kg this week
          </p>
        )}
      </div>
      <div className="mt-3 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <XAxis
              dataKey="date"
              stroke="var(--text-tertiary)"
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
                color: "var(--text-primary)",
              }}
            />
            <Line type="monotone" dataKey="weightKg" stroke="var(--brand)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {goalWeightKg !== undefined && (
        <p className="mt-2 text-xs text-text-tertiary">Goal: {goalWeightKg} kg</p>
      )}
    </Card>
  );
}
