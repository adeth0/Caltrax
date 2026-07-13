"use client";

import { useActionState, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillSelect } from "@/components/ui/PillSelect";
import { createProfile, type OnboardingActionState } from "./actions";

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

const initialState: OnboardingActionState = {};

export default function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(createProfile, initialState);
  const [sex, setSex] = useState("male");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [primaryGoal, setPrimaryGoal] = useState("lose_fat");
  const [dietaryPreference, setDietaryPreference] = useState("none");

  const fieldError = (field: string) => state.fieldErrors?.[field];

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center p-4 py-10 sm:p-6">
      <GlassCard>
        <h1 className="font-display text-2xl font-semibold text-text-primary">Let&apos;s set you up</h1>
        <p className="mt-1 text-sm text-text-secondary">
          A few details so Caltrax can calculate your calorie and macro targets. You can change any of this
          later in Settings.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-6" noValidate>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Name (optional)</label>
            <Input name="name" placeholder="What should we call you?" autoComplete="name" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Sex</label>
            <PillSelect
              name="sex"
              value={sex}
              onChange={setSex}
              columns={2}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
            <p className="mt-1 text-xs text-text-tertiary">Used for BMR calculation (Mifflin-St Jeor).</p>
            {fieldError("sex") && <p className="mt-1 text-xs text-accent-danger">{fieldError("sex")}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">Age</label>
              <Input name="age" type="number" inputMode="numeric" placeholder="30" min={13} max={120} />
              {fieldError("age") && <p className="mt-1 text-xs text-accent-danger">{fieldError("age")}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">Height (cm)</label>
              <Input name="heightCm" type="number" inputMode="decimal" placeholder="178" min={90} max={250} />
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
                placeholder="82"
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
              onChange={setActivityLevel}
              options={ACTIVITY_OPTIONS}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Primary goal</label>
            <PillSelect
              name="primaryGoal"
              value={primaryGoal}
              onChange={setPrimaryGoal}
              columns={2}
              options={GOAL_OPTIONS}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Dietary preference</label>
            <PillSelect
              name="dietaryPreference"
              value={dietaryPreference}
              onChange={setDietaryPreference}
              columns={2}
              options={DIET_OPTIONS}
            />
          </div>

          {state.error && <p className="text-sm text-accent-danger">{state.error}</p>}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving…" : "Save and see my targets"}
          </Button>
        </form>
      </GlassCard>
    </main>
  );
}
