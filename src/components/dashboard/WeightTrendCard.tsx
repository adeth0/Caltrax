"use client";

import { GlassCard } from "@/components/ui/GlassCard";
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
    <GlassCard>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-text-secondary">Weight trend</p>
        {points.length > 1 && (
          <p className={`text-xs ${delta <= 0 ? "text-accent-success" : "text-accent-warning"}`}>
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)} kg this week
          </p>
        )}
      </div>
      <div className="mt-3 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} fontSize={11} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                background: "rgba(15,17,20,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Line type="monotone" dataKey="weightKg" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {goalWeightKg !== undefined && (
        <p className="mt-2 text-xs text-text-tertiary">Goal: {goalWeightKg} kg</p>
      )}
    </GlassCard>
  );
}
