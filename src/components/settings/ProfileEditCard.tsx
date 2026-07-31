"use client";

import { useActionState, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillSelect } from "@/components/ui/PillSelect";
import { updateProfileAction, type UpdateProfileActionState } from "@/app/(app)/settings/actions";
import {
  cmToInches,
  feetAndInchesToInches,
  inchesToCm,
  inchesToFeetAndInches,
  kgToLbs,
  lbsToKg,
} from "@/lib/units";

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary", hint: "Little or no exercise" },
  { value: "light", label: "Light", hint: "1-3 days/week" },
  { value: "moderate", label: "Moderate", hint: "3-5 days/week" },
  { value: "active", label: "Active", hint: "6-7 days/week" },
  { value: "very_active", label: "Very active", hint: "Hard training + physical job" },
];

const GOAL_OPTIONS = [
  { value: "lose_fat", label: "Lose fat" },
  { value: "build_muscle", label: "Build muscle" },
  { value: "maintain_weight", label: "Maintain weight" },
  { value: "improve_health", label: "Improve health" },
  { value: "increase_protein", label: "Increase protein" },
  { value: "athletic_performance", label: "Athletic performance" },
  { value: "body_recomposition", label: "Body recomposition" },
];

const DIET_OPTIONS = [
  { value: "none", label: "No preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Keto" },
  { value: "low_carb", label: "Low carb" },
  { value: "mediterranean", label: "Mediterranean" },
];

export interface ProfileFormValues {
  name: string;
  sex: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number | null;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  primaryGoal:
    | "lose_fat"
    | "build_muscle"
    | "maintain_weight"
    | "improve_health"
    | "increase_protein"
    | "athletic_performance"
    | "body_recomposition";
  dietaryPreference: "none" | "vegetarian" | "vegan" | "keto" | "low_carb" | "mediterranean";
  weightUnit: "kg" | "lbs";
  heightUnit: "cm" | "ft";
}

const initialState: UpdateProfileActionState = {};

/**
 * Real profile editing -- previously a "lands in a future update"
 * placeholder here, despite onboarding's own copy already promising this
 * was possible. Same fields as onboarding, pre-filled, single form (not
 * stepped -- that treatment is specifically for first-run smoothness;
 * editing existing values benefits from seeing everything at once).
 * Every value saved here flows straight into the dashboard's calorie/macro
 * targets on next load, since those are computed live from the profile.
 */
export function ProfileEditCard({ initial }: { initial: ProfileFormValues }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);
  const [sex, setSex] = useState(initial.sex);
  const [activityLevel, setActivityLevel] = useState(initial.activityLevel);
  const [primaryGoal, setPrimaryGoal] = useState(initial.primaryGoal);
  const [dietaryPreference, setDietaryPreference] = useState(initial.dietaryPreference);

  const [weightUnit, setWeightUnit] = useState(initial.weightUnit);
  const [heightUnit, setHeightUnit] = useState(initial.heightUnit);
  const [weightDisplay, setWeightDisplay] = useState(() =>
    initial.weightUnit === "lbs"
      ? String(Math.round(kgToLbs(initial.weightKg) * 10) / 10)
      : String(initial.weightKg)
  );
  const [targetWeightDisplay, setTargetWeightDisplay] = useState(() =>
    initial.targetWeightKg === null
      ? ""
      : initial.weightUnit === "lbs"
        ? String(Math.round(kgToLbs(initial.targetWeightKg) * 10) / 10)
        : String(initial.targetWeightKg)
  );
  const [heightCmDisplay, setHeightCmDisplay] = useState(String(initial.heightCm));
  const [heightFeetDisplay, setHeightFeetDisplay] = useState(() =>
    String(inchesToFeetAndInches(cmToInches(initial.heightCm)).feet)
  );
  const [heightInchesDisplay, setHeightInchesDisplay] = useState(() =>
    String(inchesToFeetAndInches(cmToInches(initial.heightCm)).inches)
  );

  // Converts whatever's currently entered to the newly-selected unit, so
  // switching units mid-edit doesn't silently discard what was typed.
  function handleWeightUnitChange(newUnit: "kg" | "lbs") {
    const currentKg = weightUnit === "lbs" ? lbsToKg(Number(weightDisplay) || 0) : Number(weightDisplay) || 0;
    const currentTargetKg =
      targetWeightDisplay === ""
        ? null
        : weightUnit === "lbs"
          ? lbsToKg(Number(targetWeightDisplay) || 0)
          : Number(targetWeightDisplay) || 0;
    setWeightUnit(newUnit);
    setWeightDisplay(
      newUnit === "lbs"
        ? String(Math.round(kgToLbs(currentKg) * 10) / 10)
        : String(Math.round(currentKg * 10) / 10)
    );
    setTargetWeightDisplay(
      currentTargetKg === null
        ? ""
        : newUnit === "lbs"
          ? String(Math.round(kgToLbs(currentTargetKg) * 10) / 10)
          : String(Math.round(currentTargetKg * 10) / 10)
    );
  }

  function handleHeightUnitChange(newUnit: "cm" | "ft") {
    const currentCm =
      heightUnit === "ft"
        ? inchesToCm(feetAndInchesToInches(Number(heightFeetDisplay) || 0, Number(heightInchesDisplay) || 0))
        : Number(heightCmDisplay) || 0;
    setHeightUnit(newUnit);
    setHeightCmDisplay(String(Math.round(currentCm)));
    const { feet, inches } = inchesToFeetAndInches(cmToInches(currentCm));
    setHeightFeetDisplay(String(feet));
    setHeightInchesDisplay(String(inches));
  }

  // Hidden-field values the server action actually reads -- always
  // metric, regardless of which unit is currently displayed.
  const weightKgForSubmit =
    weightUnit === "lbs"
      ? Math.round(lbsToKg(Number(weightDisplay) || 0) * 10) / 10
      : Number(weightDisplay) || 0;
  const targetWeightKgForSubmit =
    targetWeightDisplay === ""
      ? ""
      : weightUnit === "lbs"
        ? Math.round(lbsToKg(Number(targetWeightDisplay) || 0) * 10) / 10
        : Number(targetWeightDisplay) || 0;
  const heightCmForSubmit =
    heightUnit === "ft"
      ? Math.round(
          inchesToCm(feetAndInchesToInches(Number(heightFeetDisplay) || 0, Number(heightInchesDisplay) || 0))
        )
      : Number(heightCmDisplay) || 0;

  const fieldError = (field: string) => state.fieldErrors?.[field];

  return (
    <Card>
      <p className="text-sm font-medium text-text-primary">Your details</p>
      <p className="mt-1 text-xs text-text-tertiary">
        Changes here update your calorie and macro targets immediately.
      </p>

      <form action={formAction} className="mt-4 flex flex-col gap-5" noValidate>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">Name</label>
          <Input name="name" defaultValue={initial.name} placeholder="Your name" autoComplete="name" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">Sex</label>
          <PillSelect
            name="sex"
            value={sex}
            onChange={(v) => setSex(v as typeof sex)}
            columns={2}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
          {fieldError("sex") && <p className="mt-1 text-xs text-accent-danger">{fieldError("sex")}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Age</label>
            <Input
              name="age"
              type="number"
              inputMode="numeric"
              defaultValue={initial.age}
              min={13}
              max={120}
            />
            {fieldError("age") && <p className="mt-1 text-xs text-accent-danger">{fieldError("age")}</p>}
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">Height</label>
              <div className="flex gap-1">
                {(["cm", "ft"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleHeightUnitChange(u)}
                    className={`control focus-ring touch-target rounded-full px-2.5 py-1 text-xs font-medium ${
                      heightUnit === u
                        ? "bg-brand text-brand-foreground"
                        : "bg-surface-raised text-text-secondary hover:bg-border-strong"
                    }`}
                  >
                    {u === "cm" ? "cm" : "ft/in"}
                  </button>
                ))}
              </div>
            </div>
            {heightUnit === "cm" ? (
              <Input
                type="number"
                inputMode="decimal"
                value={heightCmDisplay}
                onChange={(e) => setHeightCmDisplay(e.target.value)}
                min={90}
                max={250}
              />
            ) : (
              <div className="flex gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={heightFeetDisplay}
                  onChange={(e) => setHeightFeetDisplay(e.target.value)}
                  placeholder="ft"
                  min={2}
                  max={8}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  value={heightInchesDisplay}
                  onChange={(e) => setHeightInchesDisplay(e.target.value)}
                  placeholder="in"
                  min={0}
                  max={11}
                />
              </div>
            )}
            <input type="hidden" name="heightCm" value={heightCmForSubmit} />
            <input type="hidden" name="heightUnit" value={heightUnit} />
            {fieldError("heightCm") && (
              <p className="mt-1 text-xs text-accent-danger">{fieldError("heightCm")}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">Current weight</label>
              <div className="flex gap-1">
                {(["kg", "lbs"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleWeightUnitChange(u)}
                    className={`control focus-ring touch-target rounded-full px-2.5 py-1 text-xs font-medium ${
                      weightUnit === u
                        ? "bg-brand text-brand-foreground"
                        : "bg-surface-raised text-text-secondary hover:bg-border-strong"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <Input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={weightDisplay}
              onChange={(e) => setWeightDisplay(e.target.value)}
            />
            <input type="hidden" name="weightKg" value={weightKgForSubmit} />
            <input type="hidden" name="weightUnit" value={weightUnit} />
            {fieldError("weightKg") && (
              <p className="mt-1 text-xs text-accent-danger">{fieldError("weightKg")}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Target weight ({weightUnit})
            </label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={targetWeightDisplay}
              onChange={(e) => setTargetWeightDisplay(e.target.value)}
              placeholder="Optional"
            />
            <input type="hidden" name="targetWeightKg" value={targetWeightKgForSubmit} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">Activity level</label>
          <PillSelect
            name="activityLevel"
            value={activityLevel}
            onChange={(v) => setActivityLevel(v as typeof activityLevel)}
            options={ACTIVITY_OPTIONS}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">Primary goal</label>
          <PillSelect
            name="primaryGoal"
            value={primaryGoal}
            onChange={(v) => setPrimaryGoal(v as typeof primaryGoal)}
            columns={2}
            options={GOAL_OPTIONS}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">Dietary preference</label>
          <PillSelect
            name="dietaryPreference"
            value={dietaryPreference}
            onChange={(v) => setDietaryPreference(v as typeof dietaryPreference)}
            columns={2}
            options={DIET_OPTIONS}
          />
        </div>

        {state.error && <p className="text-sm text-accent-danger">{state.error}</p>}
        {state.success && <p className="text-sm text-accent-success">Saved.</p>}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
