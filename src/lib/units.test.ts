import { describe, expect, it } from "vitest";
import {
  cmToInches,
  feetAndInchesToInches,
  formatHeight,
  formatWeight,
  inchesToCm,
  inchesToFeetAndInches,
  kgToLbs,
  lbsToKg,
} from "./units";

describe("units", () => {
  it("converts kg to lbs and back", () => {
    expect(kgToLbs(100)).toBeCloseTo(220.46, 1);
    expect(lbsToKg(220.46)).toBeCloseTo(100, 1);
  });

  it("converts cm to inches and back", () => {
    expect(cmToInches(180)).toBeCloseTo(70.87, 1);
    expect(inchesToCm(70.87)).toBeCloseTo(180, 1);
  });

  it("splits inches into feet and inches", () => {
    expect(inchesToFeetAndInches(70)).toEqual({ feet: 5, inches: 10 });
    expect(inchesToFeetAndInches(72)).toEqual({ feet: 6, inches: 0 });
  });

  it("combines feet and inches back into total inches", () => {
    expect(feetAndInchesToInches(5, 10)).toBe(70);
  });

  it("formats weight in the requested unit", () => {
    expect(formatWeight(100, "kg")).toBe("100 kg");
    expect(formatWeight(100, "lbs")).toBe("220.5 lbs");
  });

  it("formats height in the requested unit", () => {
    expect(formatHeight(180, "cm")).toBe("180 cm");
    expect(formatHeight(178, "ft")).toBe("5'10\"");
  });
});
