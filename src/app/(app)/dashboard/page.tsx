import { CaloriesRemainingCard } from "@/components/dashboard/CaloriesRemainingCard";
import { HydrationCard } from "@/components/dashboard/HydrationCard";
import { MacroRingsCard } from "@/components/dashboard/MacroRingsCard";
import { WeightTrendCard } from "@/components/dashboard/WeightTrendCard";
import { calculateGoals } from "@/lib/goalEngine";
import type { UserProfileInput } from "@/types";

// TODO(Phase 1 API wiring): replace this with the signed-in user's
// Profile row (via Prisma) and today's aggregated MealEntry/WaterLog
// totals. Kept as a typed sample here so the widgets are demonstrably
// wired to the real goalEngine math rather than hardcoded numbers.
const sampleProfile: UserProfileInput = {
  sex: "male",
  age: 32,
  heightCm: 178,
  weightKg: 82,
  targetWeightKg: 76,
  activityLevel: "moderate",
  primaryGoal: "lose_fat",
};

const sampleTodayIntake = {
  calories: 1420,
  proteinG: 98,
  carbsG: 110,
  fatG: 48,
  fibreG: 16,
  waterMl: 1250,
};

const sampleWeightPoints = [
  { date: "Mon", weightKg: 82.4 },
  { date: "Tue", weightKg: 82.1 },
  { date: "Wed", weightKg: 82.2 },
  { date: "Thu", weightKg: 81.8 },
  { date: "Fri", weightKg: 81.6 },
  { date: "Sat", weightKg: 81.7 },
  { date: "Sun", weightKg: 81.4 },
];

export default function DashboardPage() {
  const { targets } = calculateGoals(sampleProfile);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-4 pb-24 sm:p-6">
      <header className="mb-2">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Today</h1>
        <p className="text-sm text-text-tertiary">Wednesday, 8 July</p>
      </header>

      <CaloriesRemainingCard target={targets.calories} consumed={sampleTodayIntake.calories} burned={0} />

      <MacroRingsCard targets={targets} consumed={sampleTodayIntake} />

      <HydrationCard consumedMl={sampleTodayIntake.waterMl} targetMl={targets.waterMl} />

      <WeightTrendCard points={sampleWeightPoints} goalWeightKg={sampleProfile.targetWeightKg} />
    </main>
  );
}
