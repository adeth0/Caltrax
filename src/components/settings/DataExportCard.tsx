"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import {
  exportMealsCsvAction,
  exportMeasurementsCsvAction,
  exportWeightCsvAction,
  exportWorkoutsCsvAction,
} from "@/app/(app)/settings/exportActions";

const EXPORTS = [
  { key: "meals", label: "Meal log", action: exportMealsCsvAction, filename: "caltrax-meals.csv" },
  { key: "weight", label: "Weight history", action: exportWeightCsvAction, filename: "caltrax-weight.csv" },
  {
    key: "measurements",
    label: "Body measurements",
    action: exportMeasurementsCsvAction,
    filename: "caltrax-measurements.csv",
  },
  {
    key: "workouts",
    label: "Workout history",
    action: exportWorkoutsCsvAction,
    filename: "caltrax-workouts.csv",
  },
] as const;

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function DataExportCard() {
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleExport(exp: (typeof EXPORTS)[number]) {
    setError(null);
    setPendingKey(exp.key);
    startTransition(async () => {
      try {
        const csv = await exp.action();
        downloadCsv(csv, exp.filename);
      } catch {
        setError("Couldn't generate that file — try again.");
      } finally {
        setPendingKey(null);
      }
    });
  }

  return (
    <Card>
      <p className="text-sm font-semibold text-text-primary">Export your data</p>
      <p className="mt-1 text-xs text-text-tertiary">
        Download your own tracked data as CSV files, ready to open in a spreadsheet.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {EXPORTS.map((exp) => (
          <Button
            key={exp.key}
            type="button"
            variant="secondary"
            onClick={() => handleExport(exp)}
            disabled={isPending && pendingKey === exp.key}
            className="justify-start"
          >
            <Download className="h-4 w-4" />
            {isPending && pendingKey === exp.key ? "Preparing…" : exp.label}
          </Button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-accent-danger">{error}</p>}
    </Card>
  );
}
