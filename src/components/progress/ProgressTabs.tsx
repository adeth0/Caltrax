"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { InsightsCard } from "@/components/progress/InsightsCard";
import { MicronutrientsCard } from "@/components/progress/MicronutrientsCard";
import { ProgressClient, type WeightPointRow } from "@/components/progress/ProgressClient";
import { ReportsClient } from "@/components/progress/ReportsClient";
import { AchievementsGrid, type UnlockedInfo } from "@/components/progress/AchievementsGrid";
import type { MicronutrientIntake } from "@/lib/micronutrients";
import type { Sex } from "@/types";

interface ProgressTabsProps {
  weightPoints: WeightPointRow[];
  goalWeightKg?: number;
  waterConsumedMl: number;
  waterTargetMl: number;
  micronutrientIntake: MicronutrientIntake;
  sex: Sex;
  hasLoggedToday: boolean;
  unlockedAchievements: UnlockedInfo[];
}

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "reports", label: "Reports" },
  { value: "achievements", label: "Achievements" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export function ProgressTabs(props: ProgressTabsProps) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div>
      <div className="mb-4 flex gap-2 rounded-control bg-white/5 p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "control focus-ring touch-target flex-1 px-3 py-2 text-sm font-medium transition-colors",
              tab === t.value
                ? "bg-accent-info/20 text-accent-info"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <InsightsCard />
          <ProgressClient
            weightPoints={props.weightPoints}
            goalWeightKg={props.goalWeightKg}
            waterConsumedMl={props.waterConsumedMl}
            waterTargetMl={props.waterTargetMl}
          />
          <MicronutrientsCard
            intake={props.micronutrientIntake}
            sex={props.sex}
            hasLoggedToday={props.hasLoggedToday}
          />
        </div>
      )}

      {tab === "reports" && <ReportsClient />}

      {tab === "achievements" && <AchievementsGrid unlocked={props.unlockedAchievements} />}
    </div>
  );
}
