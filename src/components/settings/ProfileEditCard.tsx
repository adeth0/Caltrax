"use client";

import { useActionState, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillSelect } from "@/components/ui/PillSelect";
import { updateProfileAction, type UpdateProfileActionState } from "@/app/(app)/settings/actions";

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
            <label className="mb-2 block text-sm font-medium text-text-primary">Height (cm)</label>
            <Input
              name="heightCm"
              type="number"
              inputMode="decimal"
              defaultValue={initial.heightCm}
              min={90}
              max={250}
            />
            {fieldError("heightCm") && (
              <p className="mt-1 text-xs text-accent-danger">{fieldError("heightCm")}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Current weight (kg)</label>
            <Input
              name="weightKg"
              type="number"
              inputMode="decimal"
              step="0.1"
              defaultValue={initial.weightKg}
              min={30}
              max={300}
            />
            {fieldError("weightKg") && (
              <p className="mt-1 text-xs text-accent-danger">{fieldError("weightKg")}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Target weight (kg)</label>
            <Input
              name="targetWeightKg"
              type="number"
              inputMode="decimal"
              step="0.1"
              defaultValue={initial.targetWeightKg ?? ""}
              placeholder="Optional"
              min={30}
              max={300}
            />
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
