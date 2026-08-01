"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Dumbbell, Heart, Search, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getMuscleGroupColorClasses } from "@/lib/muscleGroupVisuals";
import {
  addWorkoutSetAction,
  createCustomExerciseAction,
  deleteRoutineAction,
  deleteWorkoutSetAction,
  saveRoutineFromTodayAction,
} from "@/app/(app)/log/workoutActions";

export type MuscleGroupValue =
  "CHEST" | "BACK" | "LEGS" | "SHOULDERS" | "ARMS" | "CORE" | "FULL_BODY" | "CARDIO";

export interface ExerciseOption {
  id: string;
  name: string;
  muscleGroup: MuscleGroupValue;
  equipment: string | null;
}

export interface RoutineOption {
  id: string;
  name: string;
  exercises: ExerciseOption[];
}

export interface TodayWorkoutSetRow {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number | null;
}

const MUSCLE_GROUP_LABELS: Record<MuscleGroupValue, string> = {
  CHEST: "Chest",
  BACK: "Back",
  LEGS: "Legs",
  SHOULDERS: "Shoulders",
  ARMS: "Arms",
  CORE: "Core",
  FULL_BODY: "Full body",
  CARDIO: "Cardio",
};

const FILTERS: { value: MuscleGroupValue | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "CHEST", label: "Chest" },
  { value: "BACK", label: "Back" },
  { value: "LEGS", label: "Legs" },
  { value: "SHOULDERS", label: "Shoulders" },
  { value: "ARMS", label: "Arms" },
  { value: "CORE", label: "Core" },
  { value: "FULL_BODY", label: "Full body" },
  { value: "CARDIO", label: "Cardio" },
];

interface WorkoutLogClientProps {
  exercises: ExerciseOption[];
  todaySets: TodayWorkoutSetRow[];
  routines: RoutineOption[];
}

export function WorkoutLogClient({ exercises, todaySets, routines }: WorkoutLogClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroupValue | "all">("all");
  const [selectedExercise, setSelectedExercise] = useState<ExerciseOption | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseMuscleGroup, setNewExerciseMuscleGroup] = useState<MuscleGroupValue>("FULL_BODY");
  const [newExerciseEquipment, setNewExerciseEquipment] = useState("");
  const [addExerciseError, setAddExerciseError] = useState<string | null>(null);
  const [isAddingExercise, startAddingExercise] = useTransition();
  const [customExercises, setCustomExercises] = useState<ExerciseOption[]>([]);
  const [routineName, setRoutineName] = useState("");
  const [isSavingRoutine, startSavingRoutine] = useTransition();
  const [routineError, setRoutineError] = useState<string | null>(null);
  const [showSaveRoutine, setShowSaveRoutine] = useState(false);

  const filtered = useMemo(() => {
    let list = [...exercises, ...customExercises];
    if (muscleGroup !== "all") list = list.filter((e) => e.muscleGroup === muscleGroup);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q));
    }
    return list;
  }, [exercises, customExercises, query, muscleGroup]);

  const groupedSets = useMemo(() => {
    const map = new Map<string, TodayWorkoutSetRow[]>();
    for (const set of todaySets) {
      if (!map.has(set.exerciseName)) map.set(set.exerciseName, []);
      map.get(set.exerciseName)!.push(set);
    }
    return [...map.entries()];
  }, [todaySets]);

  function handleAddSet() {
    if (!selectedExercise) return;
    const repsNum = Number(reps);
    if (!Number.isInteger(repsNum) || repsNum <= 0) {
      setError("Enter a valid number of reps");
      return;
    }
    const weightNum = weight.trim() ? Number(weight) : null;
    if (weightNum !== null && (!Number.isFinite(weightNum) || weightNum < 0)) {
      setError("Enter a valid weight, or leave it blank for bodyweight");
      return;
    }

    setError(null);
    startSaving(async () => {
      try {
        await addWorkoutSetAction(selectedExercise.id, repsNum, weightNum);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't save that set — try again.");
      }
    });
  }

  function handleDeleteSet(setId: string) {
    startDeleting(async () => {
      await deleteWorkoutSetAction(setId);
      router.refresh();
    });
  }

  function handleSaveRoutine() {
    if (!routineName.trim()) {
      setRoutineError("Enter a name for this routine");
      return;
    }
    setRoutineError(null);
    startSavingRoutine(async () => {
      try {
        await saveRoutineFromTodayAction(routineName);
        setRoutineName("");
        setShowSaveRoutine(false);
        router.refresh();
      } catch (err) {
        setRoutineError(err instanceof Error ? err.message : "Couldn't save that routine — try again.");
      }
    });
  }

  function handleDeleteRoutine(routineId: string) {
    startSavingRoutine(async () => {
      await deleteRoutineAction(routineId);
      router.refresh();
    });
  }

  function handleAddCustomExercise() {
    if (!newExerciseName.trim()) {
      setAddExerciseError("Enter a name for this exercise");
      return;
    }
    setAddExerciseError(null);
    startAddingExercise(async () => {
      try {
        const created = await createCustomExerciseAction(
          newExerciseName,
          newExerciseMuscleGroup,
          newExerciseEquipment || null
        );
        setCustomExercises((prev) => [...prev, created]);
        setSelectedExercise(created);
        setNewExerciseName("");
        setNewExerciseEquipment("");
        setShowAddExercise(false);
      } catch (err) {
        setAddExerciseError(err instanceof Error ? err.message : "Couldn't add that exercise — try again.");
      }
    });
  }

  return (
    <div>
      {routines.length > 0 && (
        <Card className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">My routines</p>
          <div className="mt-2 flex flex-col gap-2">
            {routines.map((routine) => (
              <div key={routine.id} className="rounded-control bg-surface-raised p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">{routine.name}</p>
                  <button
                    type="button"
                    onClick={() => handleDeleteRoutine(routine.id)}
                    aria-label={`Delete ${routine.name}`}
                    className="touch-target focus-ring text-text-tertiary hover:text-accent-danger"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {routine.exercises.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => {
                        setSelectedExercise(ex);
                        setError(null);
                      }}
                      className={cn(
                        "control focus-ring touch-target rounded-full px-3 py-1 text-xs font-medium",
                        selectedExercise?.id === ex.id
                          ? "bg-brand text-brand-foreground"
                          : "bg-surface text-text-secondary hover:bg-border-strong"
                      )}
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">Exercise</p>
        {selectedExercise ? (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="control focus-ring touch-target flex w-full items-center gap-3 rounded-control bg-surface-raised px-3 py-2.5 text-left"
          >
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                getMuscleGroupColorClasses(selectedExercise.muscleGroup)
              )}
            >
              {selectedExercise.muscleGroup === "CARDIO" ? (
                <Heart className="h-5 w-5" />
              ) : (
                <Dumbbell className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-primary">{selectedExercise.name}</p>
              <p className="text-xs text-text-tertiary">
                {MUSCLE_GROUP_LABELS[selectedExercise.muscleGroup]}
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium text-accent-info">Change</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="control focus-ring touch-target flex w-full items-center gap-2.5 rounded-control border border-border bg-surface-raised px-4 py-3 text-left text-text-tertiary"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="text-sm">Search exercises…</span>
          </button>
        )}
      </Card>

      {showPicker && (
        <div className="fixed inset-0 z-50 flex flex-col bg-base">
          <div className="flex items-center gap-2 border-b border-border p-3">
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              aria-label="Close exercise picker"
              className="touch-target focus-ring control flex shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-surface-raised hover:text-text-primary"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input
                type="search"
                inputMode="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exercises…"
                autoComplete="off"
                className="control focus-ring w-full rounded-control border border-border bg-surface-raised py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setMuscleGroup(f.value)}
                  className={cn(
                    "control focus-ring touch-target shrink-0 whitespace-nowrap px-3 py-1.5 text-sm font-medium",
                    muscleGroup === f.value
                      ? "bg-brand text-brand-foreground"
                      : "bg-surface-raised text-text-secondary hover:bg-border-strong"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <ul className="flex flex-col gap-1">
              {filtered.map((exercise) => (
                <li key={exercise.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedExercise(exercise);
                      setError(null);
                      setShowPicker(false);
                    }}
                    className="control focus-ring flex w-full items-center gap-3 rounded-control px-2 py-2.5 text-left transition-colors hover:bg-surface-raised"
                  >
                    <div
                      className={cn(
                        "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full",
                        getMuscleGroupColorClasses(exercise.muscleGroup)
                      )}
                    >
                      {exercise.muscleGroup === "CARDIO" ? (
                        <Heart className="h-6 w-6" />
                      ) : (
                        <Dumbbell className="h-6 w-6" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-text-primary">{exercise.name}</p>
                      <p className="truncate text-sm text-text-tertiary">
                        {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
                        {exercise.equipment ? ` · ${exercise.equipment}` : ""}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                setShowAddExercise((v) => !v);
                setAddExerciseError(null);
              }}
              className="control focus-ring touch-target mt-2 px-3 py-1.5 text-xs font-medium text-accent-info hover:underline"
            >
              Can&apos;t find it? Add a custom exercise
            </button>

            {showAddExercise && (
              <div className="mt-2 flex flex-col gap-2 rounded-control bg-surface-raised p-3">
                <Input
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  placeholder="Exercise name"
                />
                <select
                  value={newExerciseMuscleGroup}
                  onChange={(e) => setNewExerciseMuscleGroup(e.target.value as MuscleGroupValue)}
                  className="control focus-ring rounded-control border border-border bg-surface px-3 py-2 text-sm text-text-primary"
                >
                  {(Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroupValue[]).map((mg) => (
                    <option key={mg} value={mg}>
                      {MUSCLE_GROUP_LABELS[mg]}
                    </option>
                  ))}
                </select>
                <Input
                  value={newExerciseEquipment}
                  onChange={(e) => setNewExerciseEquipment(e.target.value)}
                  placeholder="Equipment (optional, e.g. Dumbbell)"
                />
                {addExerciseError && <p className="text-xs text-accent-danger">{addExerciseError}</p>}
                <Button type="button" size="sm" onClick={handleAddCustomExercise} disabled={isAddingExercise}>
                  {isAddingExercise ? "Adding…" : "Add exercise"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedExercise && (
        <Card className="mt-4">
          <p className="mb-2 text-sm font-semibold text-text-primary">{selectedExercise.name}</p>
          <div className="flex items-end gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-secondary">Reps</label>
              <Input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-secondary">Weight (kg)</label>
              <Input
                type="number"
                inputMode="decimal"
                step="0.5"
                placeholder="Bodyweight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-28"
              />
            </div>
            <Button type="button" onClick={handleAddSet} disabled={isSaving} className="flex-1">
              {isSaving ? "Adding…" : "Add set"}
            </Button>
          </div>
          {error && <p className="mt-2 text-xs text-accent-danger">{error}</p>}
        </Card>
      )}

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-primary">Today&apos;s workout</p>
          {todaySets.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSaveRoutine((s) => !s)}
              className="control focus-ring touch-target text-xs font-medium text-accent-info hover:underline"
            >
              Save as routine
            </button>
          )}
        </div>
        {showSaveRoutine && (
          <div className="mt-2 flex items-center gap-2 rounded-control bg-surface-raised p-2.5">
            <Input
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="e.g. Push Day"
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={handleSaveRoutine} disabled={isSavingRoutine}>
              {isSavingRoutine ? "Saving…" : "Save"}
            </Button>
          </div>
        )}
        {routineError && <p className="mt-1.5 text-xs text-accent-danger">{routineError}</p>}
        {groupedSets.length === 0 ? (
          <p className="mt-2 text-sm text-text-tertiary">Nothing logged yet — pick an exercise above.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-4">
            {groupedSets.map(([exerciseName, sets]) => (
              <div key={exerciseName}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {exerciseName}
                </p>
                <div className="flex flex-col gap-1">
                  {sets.map((set) => (
                    <div
                      key={set.id}
                      className="flex items-center justify-between rounded-control bg-surface-raised px-3 py-2"
                    >
                      <span className="text-sm text-text-primary">
                        Set {set.setNumber}: {set.reps} reps
                        {set.weightKg !== null ? ` @ ${set.weightKg}kg` : " (bodyweight)"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSet(set.id)}
                        disabled={isDeleting}
                        aria-label={`Remove set ${set.setNumber} of ${exerciseName}`}
                        className="touch-target focus-ring text-text-tertiary hover:text-accent-danger"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
