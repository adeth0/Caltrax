/**
 * Curated recipe content. These are real, nutritionally-sensible recipes
 * written for this app -- not scraped from or attributed to any specific
 * external site (there's no live "trusted recipe API" integrated here).
 * Ingredient gram amounts are realistic home-cooking quantities; nutrition
 * per serving is computed live from these amounts against the Food
 * database (see prisma/seed.ts's FOODS list for the per-100g source
 * values), not hardcoded.
 */

export type MealCategorySeed = "BREAKFAST" | "BRUNCH" | "LUNCH" | "TEA" | "SNACK";

export interface RecipeSeedIngredient {
  /** Must match a Food.sourceId in prisma/seed.ts's FOODS list. */
  foodSlug: string;
  /** Grams for the WHOLE recipe (across all servings), matching RecipeItem.grams. */
  grams: number;
  /** Human-readable line, e.g. "2 large eggs" -- shown instead of raw grams. */
  displayLabel: string;
}

export interface RecipeSeedStep {
  content: string;
  durationSeconds?: number;
}

export interface RecipeSeedDef {
  name: string;
  description: string;
  category: MealCategorySeed;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  ingredients: RecipeSeedIngredient[];
  steps: RecipeSeedStep[];
}

export const CURATED_RECIPES: RecipeSeedDef[] = [
  {
    name: "Overnight Oats with Berries",
    description: "A make-ahead breakfast that's ready the moment you wake up -- no cooking required.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "oats-dry", grams: 50, displayLabel: "1/2 cup rolled oats" },
      { foodSlug: "milk-semi-skimmed", grams: 150, displayLabel: "150ml semi-skimmed milk" },
      { foodSlug: "greek-yogurt-plain-nonfat", grams: 60, displayLabel: "1/4 cup Greek yoghurt" },
      { foodSlug: "honey", grams: 10, displayLabel: "2 tsp honey" },
      { foodSlug: "blueberries-raw", grams: 40, displayLabel: "1/4 cup blueberries" },
      { foodSlug: "strawberries-raw", grams: 40, displayLabel: "4 strawberries, sliced" },
    ],
    steps: [
      { content: "Combine the oats, milk, yoghurt and honey in a jar or bowl and stir well." },
      { content: "Cover and refrigerate overnight, or for at least 4 hours.", durationSeconds: 4 * 3600 },
      { content: "Top with the berries just before eating." },
    ],
  },
  {
    name: "Greek Yoghurt Protein Bowl",
    description: "A high-protein breakfast bowl that takes minutes to put together.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "greek-yogurt-plain-nonfat", grams: 200, displayLabel: "3/4 cup Greek yoghurt" },
      { foodSlug: "almonds", grams: 20, displayLabel: "a small handful of almonds" },
      { foodSlug: "banana-raw", grams: 100, displayLabel: "1 medium banana, sliced" },
      { foodSlug: "honey", grams: 15, displayLabel: "1 tbsp honey" },
    ],
    steps: [
      { content: "Spoon the yoghurt into a bowl." },
      { content: "Arrange the sliced banana on top." },
      { content: "Sprinkle with almonds and drizzle with honey." },
    ],
  },
  {
    name: "Veggie Scrambled Eggs",
    description: "A savoury, vegetable-packed way to start the day.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 8,
    ingredients: [
      { foodSlug: "egg-whole-raw", grams: 150, displayLabel: "3 large eggs" },
      { foodSlug: "spinach-raw", grams: 30, displayLabel: "a large handful of spinach" },
      { foodSlug: "tomato-raw", grams: 60, displayLabel: "1/2 tomato, diced" },
      { foodSlug: "bell-pepper-red-raw", grams: 40, displayLabel: "1/4 red pepper, diced" },
      { foodSlug: "olive-oil", grams: 5, displayLabel: "1 tsp olive oil" },
      { foodSlug: "whole-wheat-bread", grams: 60, displayLabel: "2 slices wholewheat bread, toasted" },
    ],
    steps: [
      { content: "Whisk the eggs in a bowl and set aside." },
      {
        content:
          "Heat the olive oil in a non-stick pan over medium heat. Add the pepper and cook until softening.",
        durationSeconds: 120,
      },
      { content: "Add the spinach and tomato, and cook until the spinach wilts.", durationSeconds: 90 },
      { content: "Pour in the eggs and stir gently over low heat until softly set.", durationSeconds: 240 },
      { content: "Serve immediately with the toasted bread." },
    ],
  },
  {
    name: "Avocado Toast with Poached Egg",
    description: "A brunch classic -- creamy avocado, a perfectly poached egg, crisp toast.",
    category: "BRUNCH",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 6,
    ingredients: [
      { foodSlug: "whole-wheat-bread", grams: 60, displayLabel: "2 slices wholewheat bread" },
      { foodSlug: "avocado-raw", grams: 100, displayLabel: "1/2 medium avocado" },
      { foodSlug: "egg-whole-raw", grams: 50, displayLabel: "1 large egg" },
      { foodSlug: "lemon-raw", grams: 5, displayLabel: "a squeeze of lemon juice" },
    ],
    steps: [
      { content: "Toast the bread until golden." },
      { content: "Mash the avocado with the lemon juice and a pinch of salt and pepper." },
      {
        content:
          "Bring a small pan of water to a gentle simmer. Crack in the egg and poach until the white is set but the yolk is still soft.",
        durationSeconds: 180,
      },
      { content: "Spread the avocado over the toast and top with the poached egg." },
    ],
  },
  {
    name: "Shakshuka",
    description: "Eggs gently poached in a spiced tomato and pepper sauce, finished with feta.",
    category: "BRUNCH",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 20,
    ingredients: [
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "onion-raw", grams: 100, displayLabel: "1 medium onion, chopped" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "bell-pepper-red-raw", grams: 120, displayLabel: "1 red pepper, sliced" },
      { foodSlug: "tomato-raw", grams: 400, displayLabel: "4 large tomatoes, chopped (or 1 tin)" },
      { foodSlug: "egg-whole-raw", grams: 200, displayLabel: "4 large eggs" },
      { foodSlug: "feta-cheese", grams: 40, displayLabel: "a small handful of crumbled feta" },
    ],
    steps: [
      {
        content: "Heat the oil in a large pan and sauté the onion and garlic until softened.",
        durationSeconds: 300,
      },
      { content: "Add the pepper and cook until it starts to soften.", durationSeconds: 300 },
      { content: "Add the tomatoes and simmer until the sauce thickens.", durationSeconds: 600 },
      { content: "Make 4 small wells in the sauce and crack an egg into each." },
      {
        content: "Cover and cook gently until the egg whites are set but yolks are still soft.",
        durationSeconds: 420,
      },
      { content: "Scatter over the feta and serve straight from the pan." },
    ],
  },
  {
    name: "Grilled Chicken & Quinoa Salad",
    description: "A balanced, protein-forward lunch salad that travels well for meal prep.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 15,
    ingredients: [
      { foodSlug: "chicken-breast-cooked-skinless", grams: 150, displayLabel: "1 grilled chicken breast" },
      { foodSlug: "quinoa-cooked", grams: 150, displayLabel: "3/4 cup cooked quinoa" },
      { foodSlug: "mixed-salad-greens", grams: 60, displayLabel: "2 cups mixed salad leaves" },
      { foodSlug: "cucumber-raw", grams: 80, displayLabel: "1/2 cucumber, sliced" },
      { foodSlug: "tomato-raw", grams: 80, displayLabel: "1 tomato, chopped" },
      { foodSlug: "feta-cheese", grams: 30, displayLabel: "a small handful of crumbled feta" },
      { foodSlug: "olive-oil", grams: 10, displayLabel: "2 tsp olive oil" },
      { foodSlug: "lemon-raw", grams: 10, displayLabel: "a squeeze of lemon juice" },
    ],
    steps: [
      {
        content: "If the chicken isn't already cooked, season and grill or pan-fry until cooked through.",
        durationSeconds: 780,
      },
      { content: "Slice the chicken." },
      { content: "Toss the salad leaves, cucumber, tomato and quinoa with the olive oil and lemon juice." },
      { content: "Top with the sliced chicken and crumbled feta." },
    ],
  },
  {
    name: "Turkey & Hummus Wrap",
    description: "A quick, portable lunch with lean protein and no cooking required.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 8,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "whole-wheat-tortilla", grams: 70, displayLabel: "1 large wholewheat tortilla" },
      { foodSlug: "turkey-breast-cooked", grams: 90, displayLabel: "3-4 slices cooked turkey breast" },
      { foodSlug: "hummus", grams: 40, displayLabel: "2 tbsp hummus" },
      { foodSlug: "mixed-salad-greens", grams: 30, displayLabel: "a handful of salad leaves" },
      { foodSlug: "tomato-raw", grams: 50, displayLabel: "1/2 tomato, sliced" },
      { foodSlug: "cucumber-raw", grams: 40, displayLabel: "a few cucumber slices" },
    ],
    steps: [
      { content: "Spread the hummus evenly over the tortilla." },
      { content: "Layer the turkey, salad leaves, tomato and cucumber on top." },
      { content: "Roll tightly and slice in half to serve." },
    ],
  },
  {
    name: "Tuna Niçoise-Style Salad",
    description: "A filling, protein-rich salad inspired by the French classic.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 12,
    cookMinutes: 8,
    ingredients: [
      { foodSlug: "tuna-canned-water", grams: 120, displayLabel: "1 small tin of tuna in water, drained" },
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "mixed-salad-greens", grams: 60, displayLabel: "2 cups mixed salad leaves" },
      { foodSlug: "tomato-raw", grams: 100, displayLabel: "1 tomato, quartered" },
      { foodSlug: "green-beans-raw", grams: 80, displayLabel: "a handful of green beans" },
      { foodSlug: "olive-oil", grams: 12, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "lemon-raw", grams: 10, displayLabel: "a squeeze of lemon juice" },
    ],
    steps: [
      { content: "Boil the eggs, then cool under cold water and peel.", durationSeconds: 480 },
      { content: "Steam or blanch the green beans until tender-crisp.", durationSeconds: 240 },
      { content: "Arrange the salad leaves, tomato and green beans on a plate." },
      { content: "Top with the tuna and halved eggs." },
      { content: "Drizzle with olive oil and lemon juice to finish." },
    ],
  },
  {
    name: "Baked Salmon with Sweet Potato & Broccoli",
    description: "A simple, balanced tray-bake -- omega-3s, complex carbs, and greens in one dish.",
    category: "TEA",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 25,
    ingredients: [
      { foodSlug: "salmon-raw", grams: 150, displayLabel: "1 salmon fillet" },
      { foodSlug: "sweet-potato-raw", grams: 200, displayLabel: "1 medium sweet potato, cubed" },
      { foodSlug: "broccoli-raw", grams: 100, displayLabel: "a head of broccoli, cut into florets" },
      { foodSlug: "olive-oil", grams: 10, displayLabel: "2 tsp olive oil" },
      { foodSlug: "lemon-raw", grams: 10, displayLabel: "a few lemon slices" },
    ],
    steps: [
      { content: "Preheat the oven to 200°C (400°F)." },
      { content: "Toss the sweet potato in half the oil and roast until tender.", durationSeconds: 1200 },
      {
        content:
          "Season the salmon, place on a tray with the remaining oil and lemon, and bake until just cooked through.",
        durationSeconds: 840,
      },
      { content: "Steam the broccoli until tender.", durationSeconds: 300 },
      { content: "Serve the salmon with the sweet potato and broccoli." },
    ],
  },
  {
    name: "Beef Stir-Fry with Brown Rice",
    description: "A fast, high-protein weeknight dinner with plenty of vegetables.",
    category: "TEA",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 12,
    ingredients: [
      { foodSlug: "beef-mince-5pct-raw", grams: 300, displayLabel: "300g lean beef mince" },
      { foodSlug: "brown-rice-cooked", grams: 300, displayLabel: "1 1/2 cups cooked brown rice" },
      { foodSlug: "bell-pepper-red-raw", grams: 150, displayLabel: "1 red pepper, sliced" },
      { foodSlug: "onion-raw", grams: 100, displayLabel: "1 onion, sliced" },
      { foodSlug: "broccoli-raw", grams: 150, displayLabel: "a head of broccoli, cut into florets" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "soy-sauce", grams: 30, displayLabel: "2 tbsp soy sauce" },
      { foodSlug: "sesame-oil", grams: 10, displayLabel: "2 tsp sesame oil" },
    ],
    steps: [
      { content: "Heat the sesame oil in a wok or large pan over high heat." },
      { content: "Add the beef and cook until browned, breaking it up as it cooks.", durationSeconds: 300 },
      {
        content: "Add the onion, garlic, pepper and broccoli, and stir-fry until tender-crisp.",
        durationSeconds: 300,
      },
      {
        content: "Add the soy sauce, toss to combine, and cook for a couple more minutes.",
        durationSeconds: 120,
      },
      { content: "Serve over the brown rice." },
    ],
  },
  {
    name: "One-Pan Chicken Fajitas",
    description: "A colourful, family-friendly dinner that's ready in one pan.",
    category: "TEA",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 15,
    ingredients: [
      { foodSlug: "chicken-breast-raw-skinless", grams: 300, displayLabel: "2 chicken breasts, sliced" },
      { foodSlug: "bell-pepper-red-raw", grams: 200, displayLabel: "2 peppers, sliced" },
      { foodSlug: "onion-raw", grams: 150, displayLabel: "1 large onion, sliced" },
      { foodSlug: "corn-tortilla", grams: 120, displayLabel: "4 small corn tortillas, warmed" },
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "lime-raw", grams: 20, displayLabel: "1 lime, cut into wedges" },
      { foodSlug: "salsa", grams: 60, displayLabel: "a few spoonfuls of salsa" },
    ],
    steps: [
      { content: "Slice the chicken and vegetables into strips." },
      { content: "Heat the oil in a large pan over medium-high heat." },
      { content: "Add the chicken and cook until nearly done.", durationSeconds: 420 },
      {
        content: "Add the peppers and onion, and cook until tender and the chicken is cooked through.",
        durationSeconds: 360,
      },
      { content: "Squeeze over the lime and serve with the warm tortillas and salsa." },
    ],
  },
  {
    name: "Peanut Butter Banana Toast",
    description: "A quick, satisfying snack that works any time of day.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "whole-wheat-bread", grams: 30, displayLabel: "1 slice wholewheat bread" },
      { foodSlug: "peanut-butter", grams: 20, displayLabel: "1 tbsp peanut butter" },
      { foodSlug: "banana-raw", grams: 60, displayLabel: "1/2 banana, sliced" },
      { foodSlug: "honey", grams: 5, displayLabel: "a drizzle of honey" },
    ],
    steps: [
      { content: "Toast the bread." },
      { content: "Spread the peanut butter over the toast." },
      { content: "Top with sliced banana and a drizzle of honey." },
    ],
  },
  {
    name: "Greek Yoghurt with Almonds & Honey",
    description: "A simple, high-protein snack that takes seconds to put together.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 3,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "greek-yogurt-plain-nonfat", grams: 150, displayLabel: "3/4 cup Greek yoghurt" },
      { foodSlug: "almonds", grams: 15, displayLabel: "a small handful of almonds" },
      { foodSlug: "honey", grams: 10, displayLabel: "2 tsp honey" },
    ],
    steps: [
      { content: "Spoon the yoghurt into a bowl." },
      { content: "Top with the almonds and a drizzle of honey." },
    ],
  },

  // --- Additional breakfasts ---
  {
    name: "Protein Pancakes with Maple Syrup",
    description: "Fluffy pancakes with a real protein boost, ready in one pan.",
    category: "BREAKFAST",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "plain-flour", grams: 100, displayLabel: "3/4 cup plain flour" },
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "milk-semi-skimmed", grams: 150, displayLabel: "150ml semi-skimmed milk" },
      { foodSlug: "greek-yogurt-plain-nonfat", grams: 60, displayLabel: "1/4 cup Greek yoghurt" },
      { foodSlug: "olive-oil", grams: 10, displayLabel: "2 tsp oil, for the pan" },
      { foodSlug: "maple-syrup", grams: 30, displayLabel: "2 tbsp maple syrup, to serve" },
      { foodSlug: "banana-raw", grams: 100, displayLabel: "1 banana, sliced, to serve" },
    ],
    steps: [
      { content: "Whisk the flour, eggs, milk and yoghurt together until smooth." },
      { content: "Heat a little oil in a non-stick pan over medium heat." },
      {
        content: "Pour in small rounds of batter and cook until bubbles form on top, then flip.",
        durationSeconds: 300,
      },
      { content: "Serve stacked with sliced banana and maple syrup." },
    ],
  },
  {
    name: "Breakfast Burrito",
    description: "A hearty, portable breakfast wrapped up in one go.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 8,
    cookMinutes: 8,
    ingredients: [
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "black-beans-cooked", grams: 80, displayLabel: "1/3 cup black beans" },
      { foodSlug: "cheddar-cheese", grams: 30, displayLabel: "a small handful of grated cheddar" },
      { foodSlug: "tomato-raw", grams: 50, displayLabel: "1/2 tomato, diced" },
      { foodSlug: "whole-wheat-tortilla", grams: 70, displayLabel: "1 large wholewheat tortilla" },
      { foodSlug: "salsa", grams: 30, displayLabel: "a spoonful of salsa" },
    ],
    steps: [
      { content: "Scramble the eggs in a non-stick pan over medium heat.", durationSeconds: 180 },
      { content: "Warm the black beans through." },
      { content: "Warm the tortilla, then layer the eggs, beans, cheese, tomato and salsa in the centre." },
      { content: "Fold in the sides and roll tightly to serve." },
    ],
  },
  {
    name: "Full English-Style Breakfast Plate",
    description: "A classic cooked breakfast with a bit of everything.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 15,
    ingredients: [
      { foodSlug: "bacon", grams: 60, displayLabel: "2 rashers of bacon" },
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "baked-beans", grams: 150, displayLabel: "2/3 cup baked beans" },
      { foodSlug: "tomato-raw", grams: 100, displayLabel: "1 tomato, halved and grilled" },
      { foodSlug: "mushroom-portobello-raw", grams: 80, displayLabel: "1 large portobello mushroom, sliced" },
      { foodSlug: "whole-wheat-bread", grams: 30, displayLabel: "1 slice wholewheat toast" },
    ],
    steps: [
      { content: "Grill or fry the bacon until crisp.", durationSeconds: 360 },
      { content: "Fry the mushroom and tomato in the same pan.", durationSeconds: 300 },
      { content: "Fry or poach the eggs to your liking.", durationSeconds: 240 },
      { content: "Warm the baked beans through." },
      { content: "Serve everything together with the toast." },
    ],
  },

  // --- Additional brunch ---
  {
    name: "Mushroom & Spinach Omelette",
    description: "A savoury, vegetable-packed omelette that comes together in minutes.",
    category: "BRUNCH",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 8,
    ingredients: [
      { foodSlug: "egg-whole-raw", grams: 150, displayLabel: "3 large eggs" },
      { foodSlug: "mushroom-white-raw", grams: 60, displayLabel: "a handful of mushrooms, sliced" },
      { foodSlug: "spinach-raw", grams: 40, displayLabel: "a large handful of spinach" },
      { foodSlug: "cheddar-cheese", grams: 30, displayLabel: "a small handful of grated cheddar" },
      { foodSlug: "olive-oil", grams: 5, displayLabel: "1 tsp olive oil" },
    ],
    steps: [
      { content: "Whisk the eggs with a pinch of salt and pepper." },
      {
        content: "Heat the oil in a non-stick pan and sauté the mushrooms until golden.",
        durationSeconds: 240,
      },
      { content: "Add the spinach and cook until wilted.", durationSeconds: 60 },
      {
        content: "Pour in the eggs, tilting the pan to spread evenly. Cook until nearly set.",
        durationSeconds: 180,
      },
      { content: "Scatter the cheese over one half, fold, and serve." },
    ],
  },
  {
    name: "Bacon & Eggs on Toast",
    description: "A simple, satisfying brunch classic.",
    category: "BRUNCH",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "bacon", grams: 60, displayLabel: "2 rashers of bacon" },
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "whole-wheat-bread", grams: 60, displayLabel: "2 slices wholewheat bread" },
    ],
    steps: [
      { content: "Grill or fry the bacon until crisp.", durationSeconds: 360 },
      { content: "Fry or poach the eggs to your liking.", durationSeconds: 240 },
      { content: "Toast the bread and top with the bacon and eggs." },
    ],
  },

  // --- Additional lunches ---
  {
    name: "Chickpea & Feta Salad",
    description: "A filling, plant-forward salad that works well made ahead.",
    category: "LUNCH",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "chickpeas-cooked", grams: 300, displayLabel: "1 1/2 cups cooked chickpeas" },
      { foodSlug: "feta-cheese", grams: 60, displayLabel: "a handful of crumbled feta" },
      { foodSlug: "cucumber-raw", grams: 100, displayLabel: "1/2 cucumber, diced" },
      { foodSlug: "tomato-raw", grams: 150, displayLabel: "1 large tomato, diced" },
      { foodSlug: "red-onion", grams: 40, displayLabel: "1/4 red onion, finely sliced" },
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "lemon-raw", grams: 10, displayLabel: "a squeeze of lemon juice" },
    ],
    steps: [
      { content: "Combine the chickpeas, cucumber, tomato and onion in a bowl." },
      { content: "Add the crumbled feta." },
      { content: "Dress with olive oil and lemon juice, and toss to combine." },
    ],
  },
  {
    name: "Lentil Soup",
    description: "A warming, high-fibre soup that's easy to batch cook.",
    category: "LUNCH",
    servings: 3,
    prepMinutes: 10,
    cookMinutes: 30,
    ingredients: [
      { foodSlug: "lentils-cooked", grams: 400, displayLabel: "2 cups cooked lentils" },
      { foodSlug: "onion-raw", grams: 100, displayLabel: "1 onion, diced" },
      { foodSlug: "carrot-raw", grams: 150, displayLabel: "2 carrots, diced" },
      { foodSlug: "celery-raw", grams: 100, displayLabel: "2 sticks celery, diced" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "tomato-raw", grams: 200, displayLabel: "2 tomatoes, chopped" },
    ],
    steps: [
      {
        content: "Heat the oil in a large pot and sauté the onion, carrot, celery and garlic until softened.",
        durationSeconds: 480,
      },
      {
        content:
          "Add the tomatoes and lentils along with enough water or stock to cover, and bring to a simmer.",
      },
      { content: "Simmer until the vegetables are tender.", durationSeconds: 1200 },
      { content: "Blend partially or fully for a smoother soup, if you like, and season to taste." },
    ],
  },
  {
    name: "Chicken Caesar-Style Salad",
    description: "A lighter take on the classic, still packed with flavour.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "chicken-breast-raw-skinless", grams: 150, displayLabel: "1 chicken breast" },
      { foodSlug: "lettuce-romaine-raw", grams: 100, displayLabel: "2 cups romaine lettuce, chopped" },
      { foodSlug: "whole-wheat-bread", grams: 30, displayLabel: "1 slice bread, cubed for croutons" },
      { foodSlug: "cheddar-cheese", grams: 20, displayLabel: "a small handful of shaved cheese" },
      { foodSlug: "olive-oil", grams: 12, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "lemon-raw", grams: 10, displayLabel: "a squeeze of lemon juice" },
    ],
    steps: [
      {
        content: "Season and grill or pan-fry the chicken until cooked through, then slice.",
        durationSeconds: 600,
      },
      { content: "Toast the bread cubes in a dry pan until crisp, for croutons." },
      { content: "Toss the lettuce with olive oil and lemon juice." },
      { content: "Top with the sliced chicken, croutons and shaved cheese." },
    ],
  },
  {
    name: "BLT-Style Chicken Wrap",
    description: "A satisfying wrap combining smoky bacon with lean chicken.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 8,
    cookMinutes: 8,
    ingredients: [
      {
        foodSlug: "chicken-breast-cooked-skinless",
        grams: 100,
        displayLabel: "1/2 cooked chicken breast, sliced",
      },
      { foodSlug: "bacon", grams: 30, displayLabel: "1 rasher of bacon" },
      { foodSlug: "lettuce-romaine-raw", grams: 40, displayLabel: "a handful of lettuce" },
      { foodSlug: "tomato-raw", grams: 60, displayLabel: "1/2 tomato, sliced" },
      { foodSlug: "whole-wheat-tortilla", grams: 70, displayLabel: "1 large wholewheat tortilla" },
    ],
    steps: [
      { content: "Grill or fry the bacon until crisp.", durationSeconds: 300 },
      { content: "Warm the tortilla, then layer the chicken, bacon, lettuce and tomato." },
      { content: "Roll tightly and slice in half to serve." },
    ],
  },

  // --- Additional tea/dinner (heavy protein variety) ---
  {
    name: "Baked Cod with Lemon & Herbs",
    description: "A light, flaky white fish dish that's ready in under 30 minutes.",
    category: "TEA",
    servings: 1,
    prepMinutes: 8,
    cookMinutes: 18,
    ingredients: [
      { foodSlug: "cod-raw", grams: 180, displayLabel: "1 cod fillet" },
      { foodSlug: "potato-raw", grams: 250, displayLabel: "2 medium potatoes, cubed" },
      { foodSlug: "green-beans-raw", grams: 100, displayLabel: "a handful of green beans" },
      { foodSlug: "olive-oil", grams: 12, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "lemon-raw", grams: 15, displayLabel: "a few lemon slices" },
    ],
    steps: [
      { content: "Preheat the oven to 200°C (400°F)." },
      { content: "Toss the potatoes in half the oil and roast until golden.", durationSeconds: 1080 },
      {
        content:
          "Season the cod, top with lemon slices and the remaining oil, and bake until it flakes easily.",
        durationSeconds: 720,
      },
      { content: "Steam the green beans until tender.", durationSeconds: 240 },
      { content: "Serve the cod with the roasted potatoes and green beans." },
    ],
  },
  {
    name: "Grilled Steak with Chimichurri",
    description: "A restaurant-style steak dinner, simpler than it looks.",
    category: "TEA",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "beef-sirloin-steak-raw", grams: 200, displayLabel: "1 sirloin steak" },
      { foodSlug: "sweet-potato-raw", grams: 200, displayLabel: "1 medium sweet potato, cubed" },
      { foodSlug: "olive-oil", grams: 20, displayLabel: "4 tsp olive oil" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "lemon-raw", grams: 10, displayLabel: "a squeeze of lemon juice" },
      { foodSlug: "mixed-salad-greens", grams: 40, displayLabel: "a handful of salad leaves, to serve" },
    ],
    steps: [
      {
        content: "Toss the sweet potato in a little oil and roast at 200°C (400°F) until tender.",
        durationSeconds: 1200,
      },
      { content: "Mix the remaining oil, garlic and lemon juice for a quick chimichurri-style dressing." },
      { content: "Season the steak well and sear in a hot pan to your liking.", durationSeconds: 360 },
      {
        content: "Rest the steak for a few minutes, then slice and spoon over the dressing.",
        durationSeconds: 300,
      },
      { content: "Serve with the roasted sweet potato and salad leaves." },
    ],
  },
  {
    name: "Turkey Meatballs with Marinara",
    description: "Lean, tender meatballs in a simple tomato sauce.",
    category: "TEA",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 25,
    ingredients: [
      { foodSlug: "turkey-breast-raw", grams: 300, displayLabel: "300g minced turkey" },
      { foodSlug: "breadcrumbs-whole-wheat", grams: 40, displayLabel: "1/3 cup wholewheat breadcrumbs" },
      { foodSlug: "egg-whole-raw", grams: 50, displayLabel: "1 egg" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "tomato-raw", grams: 400, displayLabel: "4 tomatoes, chopped (or 1 tin)" },
      { foodSlug: "olive-oil", grams: 12, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "brown-rice-cooked", grams: 300, displayLabel: "1 1/2 cups cooked brown rice, to serve" },
    ],
    steps: [
      {
        content:
          "Mix the turkey mince, breadcrumbs, egg and half the garlic, then shape into small meatballs.",
      },
      { content: "Heat the oil in a pan and brown the meatballs on all sides.", durationSeconds: 360 },
      {
        content:
          "Add the tomatoes and remaining garlic, cover and simmer until the meatballs are cooked through.",
        durationSeconds: 900,
      },
      { content: "Serve over the rice." },
    ],
  },
  {
    name: "Pork Tenderloin with Roasted Vegetables",
    description: "A lean cut of pork roasted alongside a full tray of vegetables.",
    category: "TEA",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 30,
    ingredients: [
      { foodSlug: "pork-loin-raw", grams: 350, displayLabel: "350g pork tenderloin" },
      { foodSlug: "sweet-potato-raw", grams: 300, displayLabel: "1 large sweet potato, cubed" },
      { foodSlug: "broccoli-raw", grams: 200, displayLabel: "a head of broccoli, cut into florets" },
      { foodSlug: "olive-oil", grams: 20, displayLabel: "4 tsp olive oil" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
    ],
    steps: [
      { content: "Preheat the oven to 200°C (400°F)." },
      { content: "Toss the sweet potato in half the oil and roast for 10 minutes.", durationSeconds: 600 },
      {
        content:
          "Season the pork with the garlic and remaining oil, add to the tray with the broccoli, and roast until the pork is cooked through.",
        durationSeconds: 1200,
      },
      {
        content: "Rest the pork for a few minutes before slicing and serving with the vegetables.",
        durationSeconds: 300,
      },
    ],
  },
  {
    name: "Garlic Prawn Stir-Fry with Rice",
    description: "A fast, light seafood dinner ready in well under 20 minutes.",
    category: "TEA",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 8,
    ingredients: [
      { foodSlug: "shrimp-raw", grams: 300, displayLabel: "300g raw prawns, peeled" },
      { foodSlug: "garlic-raw", grams: 9, displayLabel: "3 cloves garlic, minced" },
      { foodSlug: "bell-pepper-red-raw", grams: 150, displayLabel: "1 red pepper, sliced" },
      { foodSlug: "broccoli-raw", grams: 150, displayLabel: "a head of broccoli, cut into florets" },
      { foodSlug: "soy-sauce", grams: 30, displayLabel: "2 tbsp soy sauce" },
      { foodSlug: "sesame-oil", grams: 10, displayLabel: "2 tsp sesame oil" },
      { foodSlug: "brown-rice-cooked", grams: 300, displayLabel: "1 1/2 cups cooked brown rice, to serve" },
    ],
    steps: [
      { content: "Heat the sesame oil in a wok over high heat." },
      {
        content: "Add the garlic, pepper and broccoli, and stir-fry until nearly tender.",
        durationSeconds: 300,
      },
      {
        content: "Add the prawns and soy sauce, and cook until the prawns turn pink and are cooked through.",
        durationSeconds: 180,
      },
      { content: "Serve over the rice." },
    ],
  },
  {
    name: "Lentil & Vegetable Curry",
    description: "A hearty, plant-based curry that's naturally high in fibre.",
    category: "TEA",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 25,
    ingredients: [
      { foodSlug: "lentils-cooked", grams: 300, displayLabel: "1 1/2 cups cooked lentils" },
      { foodSlug: "onion-raw", grams: 100, displayLabel: "1 onion, chopped" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "cauliflower-raw", grams: 200, displayLabel: "1/2 head cauliflower, cut into florets" },
      { foodSlug: "coconut-milk", grams: 200, displayLabel: "3/4 cup coconut milk" },
      { foodSlug: "curry-sauce", grams: 100, displayLabel: "1/3 cup curry sauce or paste" },
      { foodSlug: "white-rice-cooked", grams: 300, displayLabel: "1 1/2 cups cooked rice, to serve" },
    ],
    steps: [
      { content: "Sauté the onion and garlic until softened.", durationSeconds: 300 },
      { content: "Add the curry sauce and cook for a minute to release the flavour." },
      {
        content: "Add the cauliflower, lentils and coconut milk, and simmer until the cauliflower is tender.",
        durationSeconds: 900,
      },
      { content: "Serve over the rice." },
    ],
  },
  {
    name: "Lamb Kofta with Tzatziki",
    description: "Spiced lamb skewers with a cool, creamy yoghurt dip.",
    category: "TEA",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 12,
    ingredients: [
      { foodSlug: "lamb-mince-raw", grams: 300, displayLabel: "300g lamb mince" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "greek-yogurt-plain-nonfat", grams: 150, displayLabel: "3/4 cup Greek yoghurt" },
      { foodSlug: "cucumber-raw", grams: 100, displayLabel: "1/2 cucumber, grated" },
      { foodSlug: "pita-bread", grams: 130, displayLabel: "2 pita breads" },
      { foodSlug: "mixed-salad-greens", grams: 40, displayLabel: "a handful of salad leaves" },
    ],
    steps: [
      { content: "Mix the lamb mince with half the garlic and shape onto skewers or into small patties." },
      { content: "Grill or pan-fry until cooked through.", durationSeconds: 600 },
      { content: "Combine the yoghurt, cucumber and remaining garlic for the tzatziki." },
      { content: "Warm the pitas and serve with the kofta, tzatziki and salad leaves." },
    ],
  },

  // --- Additional snacks ---
  {
    name: "Rice Cakes with Cottage Cheese",
    description: "A light, crunchy snack with a good protein hit.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 3,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "rice-cakes", grams: 20, displayLabel: "2 rice cakes" },
      { foodSlug: "cottage-cheese-low-fat", grams: 100, displayLabel: "1/2 cup cottage cheese" },
      { foodSlug: "tomato-raw", grams: 50, displayLabel: "1/2 tomato, sliced" },
    ],
    steps: [
      { content: "Top the rice cakes with cottage cheese." },
      { content: "Finish with sliced tomato and a pinch of black pepper." },
    ],
  },
  {
    name: "Trail Mix",
    description: "A simple, energy-dense snack for on the go.",
    category: "SNACK",
    servings: 4,
    prepMinutes: 2,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "mixed-nuts", grams: 100, displayLabel: "3/4 cup mixed nuts" },
      { foodSlug: "raisins", grams: 60, displayLabel: "1/2 cup raisins" },
    ],
    steps: [
      {
        content:
          "Combine the nuts and raisins in a jar or container. Portion into small bags for easy grab-and-go snacking.",
      },
    ],
  },
  {
    name: "Hard-Boiled Eggs & Veggies",
    description: "A simple, protein-forward snack that keeps well for a couple of days.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 2,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "carrot-raw", grams: 80, displayLabel: "1 carrot, sliced into sticks" },
      { foodSlug: "cucumber-raw", grams: 80, displayLabel: "1/3 cucumber, sliced into sticks" },
    ],
    steps: [
      { content: "Boil the eggs to your liking, then cool under cold water and peel.", durationSeconds: 600 },
      { content: "Serve alongside the carrot and cucumber sticks." },
    ],
  },
];
