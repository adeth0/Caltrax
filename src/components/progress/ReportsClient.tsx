"use client";

import { useEffect, useState, useTransition } from "react";
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { getReportAction } from "@/app/(app)/progress/actions";
import type { Report, ReportPeriod } from "@/lib/reports";

const PERIOD_OPTIONS: { value: ReportPeriod; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export function ReportsClient() {
  const [period, setPeriod] = useState<ReportPeriod>("week");
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, startLoading] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate reset when the period changes
    setError(null);
    startLoading(async () => {
      try {
        const result = await getReportAction(period);
        setReport(result);
      } catch {
        setError("Couldn't load that report — try again.");
      }
    });
  }, [period]);

  return (
    <div className="flex flex-col gap-4">
      <GlassCard>
        <div className="flex gap-1 rounded-control bg-white/5 p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPeriod(opt.value)}
              className={cn(
                "control focus-ring touch-target flex-1 px-3 py-2 text-sm font-medium transition-colors",
                period === opt.value
                  ? "bg-accent-info/20 text-accent-info"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isLoading && <p className="mt-4 text-sm text-text-tertiary">Loading…</p>}
        {error && <p className="mt-4 text-sm text-accent-danger">{error}</p>}

        {report && !isLoading && (
          <>
            <p className="mt-4 text-xs text-text-tertiary">
              Logged {report.daysWithLogs} of {report.totalDaysInPeriod} days
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat
                label="Avg calories"
                value={`${report.avgCalories}`}
                sub={`of ${report.targetCalories}`}
              />
              <Stat
                label="Avg protein"
                value={`${report.avgProteinG}g`}
                sub={`of ${report.targetProteinG}g`}
              />
              <Stat label="Avg carbs" value={`${report.avgCarbsG}g`} sub="" />
              <Stat label="Avg fat" value={`${report.avgFatG}g`} sub="" />
              <Stat
                label="Avg water"
                value={`${(report.avgWaterMl / 1000).toFixed(1)}L`}
                sub={`of ${(report.targetWaterMl / 1000).toFixed(1)}L`}
              />
              <Stat
                label="Weight change"
                value={
                  report.weightChangeKg !== null
                    ? `${report.weightChangeKg > 0 ? "+" : ""}${report.weightChangeKg}kg`
                    : "—"
                }
                sub={
                  report.startWeightKg !== null
                    ? `${report.startWeightKg} → ${report.endWeightKg}kg`
                    : "No weigh-ins"
                }
              />
            </div>

            <div className="mt-5 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.dailySeries} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.35)"
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,17,20,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <ReferenceLine
                    y={report.targetCalories}
                    stroke="rgba(255,255,255,0.25)"
                    strokeDasharray="4 4"
                  />
                  <Line type="monotone" dataKey="calories" stroke="#0A84FF" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-center text-[10px] text-text-tertiary">
              Daily calories vs target (dashed line)
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className="text-base font-semibold text-text-primary">{value}</p>
      {sub && <p className="text-[10px] text-text-tertiary">{sub}</p>}
    </div>
  );
}
