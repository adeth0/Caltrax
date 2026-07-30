import { Coffee, Croissant, Salad, Soup, UtensilsCrossed } from "lucide-react";

export type MealCategoryValue = "BREAKFAST" | "BRUNCH" | "LUNCH" | "TEA" | "SNACK";

export const CATEGORY_META: Record<
  MealCategoryValue,
  { label: string; icon: typeof Coffee; colorClass: string }
> = {
  BREAKFAST: { label: "Breakfast", icon: Coffee, colorClass: "text-macro-carbs" },
  BRUNCH: { label: "Brunch", icon: Croissant, colorClass: "text-brand" },
  LUNCH: { label: "Lunch", icon: Salad, colorClass: "text-macro-fibre" },
  TEA: { label: "Tea", icon: Soup, colorClass: "text-macro-protein" },
  SNACK: { label: "Snack", icon: UtensilsCrossed, colorClass: "text-macro-fat" },
};
