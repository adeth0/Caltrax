"use client";

import { useActionState, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
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

const WEARABLE_PROVIDERS = [
  { id: "FITBIT", label: "Fitbit" },
  { id: "WITHINGS", label: "Withings" },
  { id: "OURA", label: "Oura" },
  { id: "WHOOP", label: "Whoop" },
];

// Which wizard step each server-validated field belongs to, so a
// validation error on final submit sends the person back to the exact
// step that needs fixing instead of leaving them stranded on the last
// screen with no visible explanation.
const FIELD_STEP: Record<string, number> = {
  name: 0,
  sex: 1,
  age: 1,
  heightCm: 2,
  weightKg: 2,
  activityLevel: 4,
  primaryGoal: 5,
  dietaryPreference: 6,
};

const TOTAL_STEPS = 8;

const initialState: OnboardingActionState = {};

export default function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(createProfile, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [step, setStep] = useState(0);
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [primaryGoal, setPrimaryGoal] = useState("lose_fat");
  const [dietaryPreference, setDietaryPreference] = useState("none");

  // Errors from useActionState persist until the NEXT actual submission --
  // editing a field afterward doesn't clear its old error message on its
  // own, which looks exactly like "I fixed this, but it still says it's
  // wrong." Tracking which fields have been touched since the last
  // server response lets the error disappear the moment someone actually
  // changes the value, rather than sitting there stale until they submit
  // again.
  const [dismissedErrors, setDismissedErrors] = useState<Set<string>>(new Set());
  const fieldError = (field: string) => (dismissedErrors.has(field) ? undefined : state.fieldErrors?.[field]);
  function dismiss(field: string) {
    setDismissedErrors((prev) => (prev.has(field) ? prev : new Set(prev).add(field)));
  }

  // If the server rejected the final submit, jump back to whichever step
  // actually owns the invalid field rather than leaving the person on the
  // last screen wondering why nothing happened. Adjusted during render
  // (React's documented pattern for reacting to a changed value) rather
  // than in an effect, since a plain effect-based setState here would
  // trigger an extra render pass for no benefit -- the state update needs
  // to happen before this render commits, not after.
  const [handledFieldErrors, setHandledFieldErrors] = useState(state.fieldErrors);
  if (state.fieldErrors !== handledFieldErrors) {
    setHandledFieldErrors(state.fieldErrors);
    setDismissedErrors(new Set());
    if (state.fieldErrors) {
      const firstBadField = Object.keys(state.fieldErrors)[0];
      const badStep = firstBadField ? FIELD_STEP[firstBadField] : undefined;
      if (badStep !== undefined) setStep(badStep);
    }
  }

  function canAdvance(): boolean {
    if (step === 1) return age.trim() !== "";
    if (step === 2) return heightCm.trim() !== "" && weightKg.trim() !== "";
    return true;
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function handleFinish() {
    formRef.current?.requestSubmit();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-4 py-10 sm:p-6">
      <Card>
        <div className="mb-6 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 overflow-hidden rounded-full bg-border"
              aria-hidden={i !== step}
            >
              <div
                className="h-full rounded-full bg-brand transition-all duration-300 ease-apple"
                style={{ width: i <= step ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>

        <form ref={formRef} action={formAction} noValidate>
          {/*
           * Carousel, not conditional rendering: every step's fields stay
           * mounted in the DOM at all times, only the visual position
           * changes (via the container's x transform). This is load-
           * bearing, not stylistic -- the form submits on the LAST step,
           * and FormData only ever contains whatever's currently in the
           * DOM. The previous version used {step === N && (...)}, which
           * unmounts every other step's inputs entirely -- by the time
           * someone reached the final step and hit Finish, every field
           * from every earlier step (sex, age, height, weight, activity
           * level, goal) was simply absent from the submission, no matter
           * how carefully they'd filled each one in. That's what
           * "fix the highlighted fields" with nothing actually highlighted
           * was: a real server validation failure for fields that were
           * always correctly filled in, then silently dropped before
           * submission ever happened.
           */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${step * 100}%` }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full shrink-0 pr-0.5" aria-hidden={step !== 0} inert={step !== 0}>
                <h1 className="font-display text-2xl font-bold text-text-primary">Welcome to Caltrax</h1>
                <p className="mb-5 mt-1 text-sm text-text-secondary">
                  What should we call you? This is just for a friendly touch -- you can change it anytime.
                </p>
                <Input name="name" placeholder="Your name (optional)" autoComplete="name" />
              </div>

              <div className="w-full shrink-0 pr-0.5" aria-hidden={step !== 1} inert={step !== 1}>
                <h1 className="font-display text-2xl font-bold text-text-primary">A couple of basics</h1>
                <p className="mb-5 mt-1 text-sm text-text-secondary">
                  Used for your BMR calculation (Mifflin-St Jeor) -- the foundation of your calorie target.
                </p>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">Sex</label>
                    <PillSelect
                      name="sex"
                      value={sex}
                      onChange={(v) => {
                        setSex(v);
                        dismiss("sex");
                      }}
                      columns={2}
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ]}
                    />
                    {fieldError("sex") && (
                      <p className="mt-1 text-xs text-accent-danger">{fieldError("sex")}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">Age</label>
                    <Input
                      name="age"
                      type="number"
                      inputMode="numeric"
                      placeholder="30"
                      min={13}
                      max={120}
                      value={age}
                      onChange={(e) => {
                        setAge(e.target.value);
                        dismiss("age");
                      }}
                    />
                    {fieldError("age") && (
                      <p className="mt-1 text-xs text-accent-danger">{fieldError("age")}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full shrink-0 pr-0.5" aria-hidden={step !== 2} inert={step !== 2}>
                <h1 className="font-display text-2xl font-bold text-text-primary">Height and weight</h1>
                <p className="mb-5 mt-1 text-sm text-text-secondary">
                  Your starting point -- you&apos;ll log new weigh-ins as you go.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">Height (cm)</label>
                    <Input
                      name="heightCm"
                      type="number"
                      inputMode="decimal"
                      placeholder="178"
                      min={90}
                      max={250}
                      value={heightCm}
                      onChange={(e) => {
                        setHeightCm(e.target.value);
                        dismiss("heightCm");
                      }}
                    />
                    {fieldError("heightCm") && (
                      <p className="mt-1 text-xs text-accent-danger">{fieldError("heightCm")}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">Weight (kg)</label>
                    <Input
                      name="weightKg"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      placeholder="82"
                      min={30}
                      max={300}
                      value={weightKg}
                      onChange={(e) => {
                        setWeightKg(e.target.value);
                        dismiss("weightKg");
                      }}
                    />
                    {fieldError("weightKg") && (
                      <p className="mt-1 text-xs text-accent-danger">{fieldError("weightKg")}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full shrink-0 pr-0.5" aria-hidden={step !== 3} inert={step !== 3}>
                <h1 className="font-display text-2xl font-bold text-text-primary">Got a target weight?</h1>
                <p className="mb-5 mt-1 text-sm text-text-secondary">
                  Totally optional -- skip this if you&apos;re just here to track, not to hit a number.
                </p>
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

              <div className="w-full shrink-0 pr-0.5" aria-hidden={step !== 4} inert={step !== 4}>
                <h1 className="font-display text-2xl font-bold text-text-primary">How active are you?</h1>
                <p className="mb-5 mt-1 text-sm text-text-secondary">
                  Outside of intentional exercise -- your day-to-day baseline.
                </p>
                <PillSelect
                  name="activityLevel"
                  value={activityLevel}
                  onChange={setActivityLevel}
                  options={ACTIVITY_OPTIONS}
                />
              </div>

              <div className="w-full shrink-0 pr-0.5" aria-hidden={step !== 5} inert={step !== 5}>
                <h1 className="font-display text-2xl font-bold text-text-primary">
                  What&apos;s your main goal?
                </h1>
                <p className="mb-5 mt-1 text-sm text-text-secondary">
                  This shapes your calorie and macro targets.
                </p>
                <PillSelect
                  name="primaryGoal"
                  value={primaryGoal}
                  onChange={setPrimaryGoal}
                  columns={2}
                  options={GOAL_OPTIONS}
                />
              </div>

              <div className="w-full shrink-0 pr-0.5" aria-hidden={step !== 6} inert={step !== 6}>
                <h1 className="font-display text-2xl font-bold text-text-primary">Any dietary preference?</h1>
                <p className="mb-5 mt-1 text-sm text-text-secondary">
                  Helps tailor recipe and food suggestions later.
                </p>
                <PillSelect
                  name="dietaryPreference"
                  value={dietaryPreference}
                  onChange={setDietaryPreference}
                  columns={2}
                  options={DIET_OPTIONS}
                />
              </div>

              <div className="w-full shrink-0 pr-0.5" aria-hidden={step !== 7} inert={step !== 7}>
                <h1 className="font-display text-2xl font-bold text-text-primary">Connect a device?</h1>
                <p className="mb-5 mt-1 text-sm text-text-secondary">
                  Sync steps and active calories, or a smart scale for automatic weigh-ins. Skip this and
                  connect anytime later from Settings.
                </p>
                <div className="flex flex-col gap-2">
                  {WEARABLE_PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        // Finishing saves the profile first -- connecting a
                        // wearable navigates away for the OAuth round trip,
                        // which would otherwise abandon every answer from
                        // the steps above before anything's actually saved.
                        // PendingWearableRedirect (mounted on the dashboard)
                        // picks this up once setup has actually completed.
                        sessionStorage.setItem("pendingWearableConnect", p.id);
                        handleFinish();
                      }}
                      className="control focus-ring touch-target flex items-center justify-between border border-border bg-surface-raised px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-border-strong"
                    >
                      {p.label}
                      <span className="text-xs text-text-tertiary">Connect</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isPending}
                  className="touch-target focus-ring mt-4 w-full text-center text-sm text-text-tertiary hover:text-text-secondary"
                >
                  Not right now -- skip this step
                </button>
              </div>
            </motion.div>
          </div>

          {state.error && <p className="mt-4 text-sm text-accent-danger">{state.error}</p>}

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={back} disabled={isPending}>
                Back
              </Button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <Button type="button" className="flex-1" onClick={next} disabled={!canAdvance()}>
                Continue
              </Button>
            ) : (
              <Button type="button" className="flex-1" onClick={handleFinish} disabled={isPending}>
                {isPending ? "Saving…" : "Finish -- see my targets"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </main>
  );
}
