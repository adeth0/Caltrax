"use client";

import { useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateInsightsAction } from "@/app/(app)/progress/actions";
import type { InsightsResult } from "@/lib/ai/insights";

export function InsightsCard() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [result, setResult] = useState<InsightsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, startGenerating] = useTransition();

  function handleGenerate() {
    setError(null);
    startGenerating(async () => {
      try {
        const insights = await generateInsightsAction(period);
        setResult(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't generate insights.");
      }
    });
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text-primary">AI insights</p>
        <div className="flex gap-1 rounded-control bg-white/5 p-1">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPeriod(p);
                setResult(null);
              }}
              className={cn(
                "touch-target control px-3 py-1 text-xs font-medium transition-colors",
                period === p
                  ? "bg-accent-info/20 text-accent-info"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {p === "week" ? "7 days" : "30 days"}
            </button>
          ))}
        </div>
      </div>

      {!result && !isGenerating && (
        <Button type="button" onClick={handleGenerate} className="mt-4 w-full">
          Generate insights
        </Button>
      )}

      {isGenerating && <p className="mt-4 text-sm text-text-tertiary">Analyzing your recent logs…</p>}

      {error && <p className="mt-3 text-sm text-accent-danger">{error}</p>}

      {result && !isGenerating && (
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-base font-medium text-text-primary">{result.headline}</p>
          <ul className="flex flex-col gap-1.5">
            {result.observations.map((obs, i) => (
              <li key={i} className="flex gap-2 text-sm text-text-secondary">
                <span className="text-text-tertiary">•</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-control bg-accent-info/10 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-info">Suggestion</p>
            <p className="mt-1 text-sm text-text-secondary">{result.suggestion}</p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="touch-target focus-ring self-start text-xs text-text-tertiary hover:text-text-secondary"
          >
            Regenerate
          </button>
        </div>
      )}
    </GlassCard>
  );
}
