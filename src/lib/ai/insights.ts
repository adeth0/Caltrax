import { z } from "zod";
import { callClaude, parseJSONResponse } from "./client";

const insightsResponseSchema = z.object({
  headline: z.string().min(1).max(140),
  observations: z.array(z.string().min(1).max(220)).min(1).max(6),
  suggestion: z.string().min(1).max(280),
});

export type InsightsResult = z.infer<typeof insightsResponseSchema>;

export interface InsightsStats {
  periodLabel: string;
  daysWithLogs: number;
  totalDaysInPeriod: number;
  avgCalories: number;
  targetCalories: number;
  avgProteinG: number;
  targetProteinG: number;
  avgCarbsG: number;
  avgFatG: number;
  avgWaterMl: number;
  targetWaterMl: number;
  weightChangeKg: number | null;
  primaryGoal: string;
}

const SYSTEM_PROMPT = `You are a supportive, evidence-based nutrition coach embedded in a calorie-tracking app.
You'll be given aggregated stats for a user's recent logging period. Write a short, encouraging,
non-judgmental summary grounded ONLY in the numbers provided — never invent data you weren't given.

Respond with ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:
{
  "headline": "string, one short sentence capturing the main takeaway",
  "observations": ["string", ...], // 2-4 specific, numeric, non-judgmental observations
  "suggestion": "string, one concrete, actionable, low-pressure suggestion for the next period"
}

Tone: warm, factual, never shaming about surplus/deficit or missed logs. If logging was sparse,
say so plainly and note the numbers are a partial picture rather than guessing what's missing.`;

export async function generateInsights(stats: InsightsStats): Promise<InsightsResult> {
  const raw = await callClaude({
    system: SYSTEM_PROMPT,
    text: `Stats for ${stats.periodLabel}:\n${JSON.stringify(stats, null, 2)}`,
    maxTokens: 700,
  });

  const parsed = parseJSONResponse<unknown>(raw);
  return insightsResponseSchema.parse(parsed);
}
