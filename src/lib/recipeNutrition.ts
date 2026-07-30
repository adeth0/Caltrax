interface RecipeItemForNutrition {
  grams: number;
  food: {
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
  };
}

export interface RecipeNutritionPerServing {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

/** Sums a recipe's ingredients and divides by servings -- the one place this math happens. */
export function computeRecipeNutritionPerServing(
  items: RecipeItemForNutrition[],
  servings: number
): RecipeNutritionPerServing {
  const totals = items.reduce(
    (acc, item) => {
      const scale = item.grams / 100;
      acc.calories += item.food.caloriesPer100g * scale;
      acc.proteinG += item.food.proteinPer100g * scale;
      acc.carbsG += item.food.carbsPer100g * scale;
      acc.fatG += item.food.fatPer100g * scale;
      return acc;
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  const safeServings = servings > 0 ? servings : 1;
  return {
    calories: totals.calories / safeServings,
    proteinG: totals.proteinG / safeServings,
    carbsG: totals.carbsG / safeServings,
    fatG: totals.fatG / safeServings,
  };
}

/** Average of a list of 1-5 star ratings, or null if there are none yet. */
export function averageRating(ratings: { stars: number }[]): number | null {
  if (ratings.length === 0) return null;
  return ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;
}
