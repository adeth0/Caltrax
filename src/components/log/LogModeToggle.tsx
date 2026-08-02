"use client";

import { useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  WorkoutLogClient,
  type ExerciseOption,
  type RoutineOption,
  type TodayWorkoutSetRow,
} from "./WorkoutLogClient";

interface LogModeToggleProps {
  /** The already-rendered meal-logging UI, passed through rather than re-fetching its data here. */
  mealSlot: ReactNode;
  exercises: ExerciseOption[];
  todaySets: TodayWorkoutSetRow[];
  routines: RoutineOption[];
}

export function LogModeToggle({ mealSlot, exercises, todaySets, routines }: LogModeToggleProps) {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"meal" | "workout">(
    searchParams.get("mode") === "workout" ? "workout" : "meal"
  );

  return (
    <div>
      <div className="mb-4 flex gap-2 rounded-control bg-surface-raised p-1">
        {(
          [
            { value: "meal", label: "Meal" },
            { value: "workout", label: "Workout" },
          ] as const
        ).map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={cn(
              "control focus-ring touch-target flex-1 px-3 py-2 text-sm font-medium transition-colors",
              mode === m.value
                ? "bg-brand text-brand-foreground"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "meal" ? (
        mealSlot
      ) : (
        <WorkoutLogClient exercises={exercises} todaySets={todaySets} routines={routines} />
      )}
    </div>
  );
}
