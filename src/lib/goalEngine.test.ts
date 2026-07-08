import { describe, expect, it } from "vitest";
import { calculateBMR, calculateGoals, calculateTDEE, progressStatus } from "./goalEngine";
import type { UserProfileInput } from "@/types";

const baseProfile: UserProfileInput = {
  sex: "male",
  age: 30,
  heightCm: 180,
  weightKg: 80,
  activityLevel: "moderate",
  primaryGoal: "maintain_weight",
};

describe("calculateBMR", () => {
  it("matches the Mifflin-St Jeor formula for males", () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(calculateBMR(baseProfile)).toBeCloseTo(1780, 5);
  });

  it("matches the Mifflin-St Jeor formula for females", () => {
    const female: UserProfileInput = { ...baseProfile, sex: "female" };
    // 10*80 + 6.25*180 - 5*30 - 161 = 1925 - 150 - 161 = 1614
    expect(calculateBMR(female)).toBeCloseTo(1614, 5);
  });
});

describe("calculateTDEE", () => {
  it("applies the correct activity multiplier", () => {
    expect(calculateTDEE(1780, "sedentary")).toBeCloseTo(1780 * 1.2, 5);
    expect(calculateTDEE(1780, "very_active")).toBeCloseTo(1780 * 1.9, 5);
  });
});

describe("calculateGoals", () => {
  it("never recommends calories below the safety floor", () => {
    const extremeCut: UserProfileInput = {
      ...baseProfile,
      primaryGoal: "lose_fat",
      targetRateKgPerWeek: -5, // deliberately unsafe request
    };
    const result = calculateGoals(extremeCut);
    expect(result.targets.calories).toBeGreaterThanOrEqual(1500); // male floor
  });

  it("produces macro grams that roughly reconstruct the calorie target", () => {
    const result = calculateGoals(baseProfile);
    const { calories, proteinG, carbsG, fatG } = result.targets;
    const reconstructed = proteinG * 4 + carbsG * 4 + fatG * 9;
    expect(Math.abs(reconstructed - calories)).toBeLessThan(20); // rounding tolerance
  });

  it("includes a non-empty, human-readable rationale", () => {
    const result = calculateGoals(baseProfile);
    expect(result.rationale.length).toBeGreaterThan(0);
    expect(result.rationale[0]).toContain("BMR");
  });
});

describe("progressStatus", () => {
  it("classifies under-consumption as info", () => {
    expect(progressStatus(50, 100)).toBe("info");
  });
  it("classifies near-target as success", () => {
    expect(progressStatus(95, 100)).toBe("success");
  });
  it("classifies over-target as danger", () => {
    expect(progressStatus(130, 100)).toBe("danger");
  });
});
