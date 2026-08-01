"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { InsightsCard } from "@/components/progress/InsightsCard";
import { MeasurementsCard, type LatestMeasurement } from "@/components/progress/MeasurementsCard";
import { ProgressPhotosClient, type ProgressPhotoRow } from "@/components/progress/ProgressPhotosClient";
import { MicronutrientsCard } from "@/components/progress/MicronutrientsCard";
import { ProgressClient, type WeightPointRow } from "@/components/progress/ProgressClient";
import { ReportsClient } from "@/components/progress/ReportsClient";
import { AchievementsGrid, type UnlockedInfo } from "@/components/progress/AchievementsGrid";
import {
  WorkoutHistoryClient,
  type LoggedExerciseOption,
  type WorkoutSessionRow,
} from "@/components/progress/WorkoutHistoryClient";
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
  workoutSessions: WorkoutSessionRow[];
  loggedExercises: LoggedExerciseOption[];
  latestMeasurements: LatestMeasurement[];
  progressPhotos: ProgressPhotoRow[];
  weightUnit?: "kg" | "lbs";
}

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "workouts", label: "Workouts" },
  { value: "photos", label: "Photos" },
  { value: "reports", label: "Reports" },
  { value: "achievements", label: "Achievements" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export function ProgressTabs(props: ProgressTabsProps) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto rounded-control bg-surface-raised p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "control focus-ring touch-target shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors",
              tab === t.value
                ? "bg-brand text-brand-foreground"
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
            weightUnit={props.weightUnit}
          />
          <MicronutrientsCard
            intake={props.micronutrientIntake}
            sex={props.sex}
            hasLoggedToday={props.hasLoggedToday}
          />
          <MeasurementsCard latestMeasurements={props.latestMeasurements} />
        </div>
      )}

      {tab === "workouts" && (
        <WorkoutHistoryClient
          workoutSessions={props.workoutSessions}
          loggedExercises={props.loggedExercises}
        />
      )}

      {tab === "photos" && <ProgressPhotosClient photos={props.progressPhotos} />}

      {tab === "reports" && <ReportsClient />}

      {tab === "achievements" && <AchievementsGrid unlocked={props.unlockedAchievements} />}
    </div>
  );
}
