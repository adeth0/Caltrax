import type { PrimaryGoal, DietaryPreference } from "@prisma/client";

export interface SupplementSuggestion {
  /** Must match a Supplement.name exactly. */
  supplementName: string;
  reason: string;
}

/**
 * Deterministic, rules-based suggestions tied to the person's stated
 * goal and dietary preference -- deliberately not an AI-generated or
 * black-box recommendation. Each suggestion carries a plain-language
 * reason so the person can judge it themselves, consistent with how
 * every other piece of health content in this app is framed: general,
 * evidence-grounded education, not personalized medical advice. This is
 * a starting point for someone to research further (the Learn section
 * has a dedicated article for most of these), not a prescription.
 */
export function getSuggestedSupplements(goal: PrimaryGoal, diet: DietaryPreference): SupplementSuggestion[] {
  const suggestions: SupplementSuggestion[] = [];

  // Goal-driven suggestions
  switch (goal) {
    case "BUILD_MUSCLE":
    case "ATHLETIC_PERFORMANCE":
    case "BODY_RECOMPOSITION":
      suggestions.push({
        supplementName: "Creatine Monohydrate",
        reason:
          "One of the most researched supplements for supporting strength and training volume over time.",
      });
      suggestions.push({
        supplementName: "Whey Protein Isolate",
        reason: "A convenient way to help hit a higher daily protein target that supports muscle building.",
      });
      break;
    case "LOSE_FAT":
      suggestions.push({
        supplementName: "Whey Protein Isolate",
        reason:
          "Higher protein intake supports fullness and helps preserve muscle while in a calorie deficit.",
      });
      suggestions.push({
        supplementName: "Multivitamin",
        reason: "A reasonable nutritional safety net while eating fewer overall calories than usual.",
      });
      break;
    case "INCREASE_PROTEIN":
      suggestions.push({
        supplementName: "Whey Protein Isolate",
        reason: "A fast, convenient way to close a protein gap without needing to cook another meal.",
      });
      suggestions.push({
        supplementName: "Casein Protein",
        reason: "Slow-digesting, often used before bed to add protein without another full meal.",
      });
      break;
    case "IMPROVE_HEALTH":
    case "MAINTAIN_WEIGHT":
      suggestions.push({
        supplementName: "Vitamin D3",
        reason: "Most people get limited sun exposure, and diet alone rarely provides enough.",
      });
      suggestions.push({
        supplementName: "Fish Oil (Omega-3)",
        reason: "Supports heart and brain health, particularly useful if oily fish isn't eaten regularly.",
      });
      break;
  }

  // Dietary-preference overlays -- these can add to, or effectively
  // replace, a goal-based suggestion above (e.g. plant protein instead
  // of whey), handled by simply adding alternatives and letting the
  // person choose what actually fits their diet.
  if (diet === "VEGAN" || diet === "VEGETARIAN") {
    suggestions.push({
      supplementName: "Plant-Based Protein (Pea & Rice Blend)",
      reason: "A dairy-free protein option that fits a vegetarian or vegan diet.",
    });
    suggestions.push({
      supplementName: "B-Complex",
      reason:
        "B12 in particular is found almost exclusively in animal products, worth watching on a plant-based diet.",
    });
  }
  if (diet === "VEGAN") {
    suggestions.push({
      supplementName: "Algae Oil (Vegan Omega-3)",
      reason: "The same EPA/DHA fatty acids as fish oil, sourced from algae instead.",
    });
  }

  // De-duplicate by supplement name (a goal and a diet rule could both
  // suggest the same one), keeping the first occurrence's reason.
  const seen = new Set<string>();
  return suggestions.filter((s) => {
    if (seen.has(s.supplementName)) return false;
    seen.add(s.supplementName);
    return true;
  });
}
