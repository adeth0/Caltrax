"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import {
  getExerciseProgressAction,
  type ExerciseProgressPoint,
} from "@/app/(app)/progress/workoutHistoryActions";

export interface WorkoutSessionRow {
  id: string;
  date: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: { setNumber: number; reps: number; weightKg: number | null }[];
  }[];
}

export interface LoggedExerciseOption {
  id: string;
  name: string;
}

interface WorkoutHistoryClientProps {
  workoutSessions: WorkoutSessionRow[];
  loggedExercises: LoggedExerciseOption[];
}

export function WorkoutHistoryClient({ workoutSessions, loggedExercises }: WorkoutHistoryClientProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(loggedExercises[0]?.id ?? "");
  const [progressPoints, setProgressPoints] = useState<ExerciseProgressPoint[]>([]);
  const [isLoading, startLoading] = useTransition();
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  function fetchProgress(exerciseId: string) {
    startLoading(async () => {
      const points = await getExerciseProgressAction(exerciseId);
      setProgressPoints(points);
    });
  }

  function handleSelectExercise(exerciseId: string) {
    setSelectedExerciseId(exerciseId);
    fetchProgress(exerciseId);
  }

  useEffect(() => {
    if (selectedExerciseId) fetchProgress(selectedExerciseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately runs once on mount only, to load the initial exercise's progress
  }, []);

  const usesWeight = progressPoints.some((p) => p.weightKg !== null);

  return (
    <div className="flex flex-col gap-4">
      {loggedExercises.length > 0 && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Track an exercise
          </p>
          <select
            value={selectedExerciseId}
            onChange={(e) => handleSelectExercise(e.target.value)}
            className="control focus-ring mt-2 w-full rounded-control border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary"
          >
            {loggedExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {isLoading ? (
            <p className="mt-3 text-sm text-text-tertiary">Loading…</p>
          ) : progressPoints.length < 2 ? (
            <p className="mt-3 text-sm text-text-tertiary">
              Log this exercise on a couple more days to see a trend here.
            </p>
          ) : (
            <div className="mt-3 h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressPoints} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
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
                    dataKey={usesWeight ? "weightKg" : "reps"}
                    stroke="var(--brand)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="mt-2 text-xs text-text-tertiary">
            {usesWeight ? "Best weight lifted per session" : "Best reps per session (bodyweight exercise)"}
          </p>
        </Card>
      )}

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Workout history</p>
        {workoutSessions.length === 0 ? (
          <p className="mt-2 text-sm text-text-tertiary">
            No workouts logged yet — head to Log and switch to the Workout tab.
          </p>
        ) : (
          <div className="mt-2 flex flex-col gap-1.5">
            {workoutSessions.map((session) => {
              const isExpanded = expandedSessionId === session.id;
              const totalSets = session.exercises.reduce((sum, e) => sum + e.sets.length, 0);
              return (
                <div key={session.id} className="rounded-control bg-surface-raised">
                  <button
                    type="button"
                    onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                    className="control focus-ring touch-target flex w-full items-center justify-between px-3 py-2.5 text-left"
                  >
                    <span className="text-sm font-medium text-text-primary">{session.date}</span>
                    <span className="flex items-center gap-2 text-xs text-text-tertiary">
                      {session.exercises.length} exercise{session.exercises.length === 1 ? "" : "s"} ·{" "}
                      {totalSets} set{totalSets === 1 ? "" : "s"}
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="flex flex-col gap-3 border-t border-border px-3 py-3">
                      {session.exercises.map((ex) => (
                        <div key={ex.exerciseId}>
                          <p className="text-sm font-semibold text-text-primary">{ex.exerciseName}</p>
                          <p className="text-xs text-text-tertiary">
                            {ex.sets
                              .map((s) => `${s.reps}${s.weightKg !== null ? ` @ ${s.weightKg}kg` : ""}`)
                              .join(" · ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
