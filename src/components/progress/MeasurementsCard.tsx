"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getMeasurementHistoryAction,
  logMeasurementAction,
  type MeasurementTypeValue,
} from "@/app/(app)/progress/measurementActions";

export interface LatestMeasurement {
  type: MeasurementTypeValue;
  valueCm: number;
  date: string;
}

const MEASUREMENT_LABELS: Record<MeasurementTypeValue, string> = {
  WAIST: "Waist",
  CHEST: "Chest",
  HIPS: "Hips",
  NECK: "Neck",
  SHOULDERS: "Shoulders",
  LEFT_ARM: "Left arm",
  RIGHT_ARM: "Right arm",
  LEFT_THIGH: "Left thigh",
  RIGHT_THIGH: "Right thigh",
  LEFT_CALF: "Left calf",
  RIGHT_CALF: "Right calf",
};

const ALL_TYPES = Object.keys(MEASUREMENT_LABELS) as MeasurementTypeValue[];

export function MeasurementsCard({ latestMeasurements }: { latestMeasurements: LatestMeasurement[] }) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<MeasurementTypeValue>("WAIST");
  const [valueCm, setValueCm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [historyType, setHistoryType] = useState<MeasurementTypeValue>(
    latestMeasurements[0]?.type ?? "WAIST"
  );
  const [history, setHistory] = useState<{ date: string; valueCm: number }[]>([]);
  const [isLoadingHistory, startLoadingHistory] = useTransition();

  function fetchHistory(type: MeasurementTypeValue) {
    startLoadingHistory(async () => {
      const points = await getMeasurementHistoryAction(type);
      setHistory(points);
    });
  }

  useEffect(() => {
    fetchHistory(historyType);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately runs once on mount only, to load the initial type's history
  }, []);

  function handleLog() {
    const num = Number(valueCm);
    if (!Number.isFinite(num) || num <= 0) {
      setError("Enter a valid measurement in cm");
      return;
    }
    setError(null);
    startSaving(async () => {
      try {
        await logMeasurementAction(selectedType, num);
        setValueCm("");
        router.refresh();
        if (selectedType === historyType) fetchHistory(historyType);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't save that measurement — try again.");
      }
    });
  }

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Body measurements</p>

      {latestMeasurements.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {latestMeasurements.map((m) => (
            <span
              key={m.type}
              className="rounded-full bg-surface-raised px-3 py-1.5 text-xs text-text-primary"
            >
              {MEASUREMENT_LABELS[m.type]}: <b>{m.valueCm}cm</b>{" "}
              <span className="text-text-tertiary">({m.date})</span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-text-secondary">Measurement</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as MeasurementTypeValue)}
            className="control focus-ring w-full rounded-control border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary"
          >
            {ALL_TYPES.map((t) => (
              <option key={t} value={t}>
                {MEASUREMENT_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">cm</label>
          <Input
            type="number"
            inputMode="decimal"
            step="0.5"
            value={valueCm}
            onChange={(e) => setValueCm(e.target.value)}
            className="w-24"
          />
        </div>
        <Button type="button" onClick={handleLog} disabled={isSaving || !valueCm}>
          {isSaving ? "Saving…" : "Log"}
        </Button>
      </div>
      {error && <p className="mt-1.5 text-xs text-accent-danger">{error}</p>}

      <div className="mt-4 border-t border-border pt-3">
        <label className="mb-1 block text-xs text-text-secondary">View trend for</label>
        <select
          value={historyType}
          onChange={(e) => {
            const type = e.target.value as MeasurementTypeValue;
            setHistoryType(type);
            fetchHistory(type);
          }}
          className="control focus-ring w-full rounded-control border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary"
        >
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>
              {MEASUREMENT_LABELS[t]}
            </option>
          ))}
        </select>

        {isLoadingHistory ? (
          <p className="mt-3 text-sm text-text-tertiary">Loading…</p>
        ) : history.length < 2 ? (
          <p className="mt-3 text-sm text-text-tertiary">
            Log this measurement a couple more times to see a trend here.
          </p>
        ) : (
          <div className="mt-3 h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
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
                <Line
                  type="monotone"
                  dataKey="valueCm"
                  stroke="var(--brand)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
