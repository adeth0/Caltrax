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

  // --- Round 2: more breakfast ---
  {
    name: "Bircher Muesli",
    description: "A make-ahead breakfast similar to overnight oats, with a classic Swiss twist.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "oats-dry", grams: 50, displayLabel: "1/2 cup rolled oats" },
      { foodSlug: "apple-raw", grams: 100, displayLabel: "1 apple, grated" },
      { foodSlug: "milk-semi-skimmed", grams: 100, displayLabel: "100ml semi-skimmed milk" },
      { foodSlug: "greek-yogurt-plain-nonfat", grams: 60, displayLabel: "1/4 cup Greek yoghurt" },
      { foodSlug: "raisins", grams: 20, displayLabel: "a small handful of raisins" },
      { foodSlug: "almonds", grams: 15, displayLabel: "a small handful of almonds, chopped" },
    ],
    steps: [
      { content: "Combine the oats, grated apple, milk, yoghurt and raisins in a bowl or jar." },
      { content: "Cover and refrigerate overnight.", durationSeconds: 28800 },
      { content: "Top with chopped almonds before serving." },
    ],
  },
  {
    name: "Breakfast Smoothie Bowl",
    description: "A thick, spoonable smoothie topped with crunchy extras.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "banana-raw", grams: 120, displayLabel: "1 frozen banana" },
      { foodSlug: "blueberries-raw", grams: 80, displayLabel: "1/2 cup blueberries" },
      { foodSlug: "greek-yogurt-plain-nonfat", grams: 150, displayLabel: "3/4 cup Greek yoghurt" },
      { foodSlug: "milk-semi-skimmed", grams: 50, displayLabel: "a splash of milk" },
      { foodSlug: "mixed-nuts", grams: 15, displayLabel: "a small handful of mixed nuts, to top" },
    ],
    steps: [
      { content: "Blend the banana, blueberries, yoghurt and milk until thick and smooth." },
      { content: "Pour into a bowl and top with mixed nuts." },
    ],
  },
  {
    name: "Cottage Cheese & Fruit Bowl",
    description: "A simple, high-protein breakfast bowl with minimal effort.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "cottage-cheese-low-fat", grams: 200, displayLabel: "1 cup cottage cheese" },
      { foodSlug: "peach-raw", grams: 100, displayLabel: "1 peach, sliced" },
      { foodSlug: "honey", grams: 10, displayLabel: "2 tsp honey" },
    ],
    steps: [
      { content: "Spoon the cottage cheese into a bowl." },
      { content: "Top with sliced peach and a drizzle of honey." },
    ],
  },

  // --- Round 2: more brunch ---
  {
    name: "Smoked Salmon Bagel",
    description: "A brunch classic combining smoked salmon with a creamy spread.",
    category: "BRUNCH",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "bagel-plain", grams: 90, displayLabel: "1 plain bagel" },
      { foodSlug: "cream-cheese-light", grams: 40, displayLabel: "2 tbsp light cream cheese" },
      { foodSlug: "smoked-salmon", grams: 60, displayLabel: "60g smoked salmon" },
      { foodSlug: "cucumber-raw", grams: 30, displayLabel: "a few cucumber slices" },
      { foodSlug: "lemon-raw", grams: 5, displayLabel: "a squeeze of lemon juice" },
    ],
    steps: [
      { content: "Toast the bagel and slice in half." },
      { content: "Spread the cream cheese over both halves." },
      { content: "Top with smoked salmon and cucumber, and finish with a squeeze of lemon." },
    ],
  },
  {
    name: "Huevos Rancheros",
    description: "A Mexican-style brunch of fried eggs over beans and salsa.",
    category: "BRUNCH",
    servings: 1,
    prepMinutes: 8,
    cookMinutes: 12,
    ingredients: [
      { foodSlug: "black-beans-cooked", grams: 150, displayLabel: "3/4 cup black beans" },
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "corn-tortilla", grams: 60, displayLabel: "2 small corn tortillas" },
      { foodSlug: "salsa", grams: 60, displayLabel: "1/4 cup salsa" },
      { foodSlug: "avocado-raw", grams: 60, displayLabel: "1/3 avocado, sliced" },
      { foodSlug: "cheddar-cheese", grams: 20, displayLabel: "a small handful of grated cheddar" },
    ],
    steps: [
      { content: "Warm the black beans with the salsa in a small pan.", durationSeconds: 300 },
      { content: "Fry the eggs to your liking in a separate pan.", durationSeconds: 240 },
      { content: "Warm the tortillas and top with the beans, eggs, avocado and cheese." },
    ],
  },
  {
    name: "French Toast",
    description: "A sweet, custardy brunch classic made from simple pantry staples.",
    category: "BRUNCH",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 8,
    ingredients: [
      { foodSlug: "whole-wheat-bread", grams: 60, displayLabel: "2 thick slices bread" },
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "milk-semi-skimmed", grams: 60, displayLabel: "60ml milk" },
      { foodSlug: "olive-oil", grams: 8, displayLabel: "a little oil for the pan" },
      { foodSlug: "maple-syrup", grams: 20, displayLabel: "1 tbsp maple syrup, to serve" },
      { foodSlug: "banana-raw", grams: 100, displayLabel: "1 banana, sliced, to serve" },
    ],
    steps: [
      { content: "Whisk the eggs and milk together in a shallow dish." },
      { content: "Dip each slice of bread in the mixture, coating both sides." },
      { content: "Fry in a lightly oiled pan until golden on both sides.", durationSeconds: 300 },
      { content: "Serve with sliced banana and maple syrup." },
    ],
  },

  // --- Round 2: more lunch ---
  {
    name: "Tuna Pasta Salad",
    description: "A filling, easy-to-batch lunch that's great served cold.",
    category: "LUNCH",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "pasta-cooked", grams: 300, displayLabel: "1 1/2 cups cooked pasta" },
      { foodSlug: "tuna-canned-water", grams: 160, displayLabel: "1 large tin of tuna, drained" },
      { foodSlug: "tomato-raw", grams: 150, displayLabel: "1 large tomato, diced" },
      { foodSlug: "cucumber-raw", grams: 100, displayLabel: "1/2 cucumber, diced" },
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "lemon-raw", grams: 10, displayLabel: "a squeeze of lemon juice" },
    ],
    steps: [
      { content: "Cook the pasta according to packet instructions if not already cooked, then cool." },
      { content: "Combine the pasta, tuna, tomato and cucumber in a large bowl." },
      { content: "Dress with olive oil and lemon juice, and toss to combine." },
    ],
  },
  {
    name: "Falafel & Hummus Bowl",
    description: "A plant-based bowl built around spiced chickpea patties.",
    category: "LUNCH",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 15,
    ingredients: [
      { foodSlug: "chickpeas-cooked", grams: 300, displayLabel: "1 1/2 cups chickpeas, mashed for falafel" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "olive-oil", grams: 20, displayLabel: "4 tsp olive oil, for frying" },
      { foodSlug: "hummus", grams: 80, displayLabel: "1/3 cup hummus" },
      { foodSlug: "mixed-salad-greens", grams: 60, displayLabel: "2 cups mixed salad leaves" },
      { foodSlug: "tomato-raw", grams: 100, displayLabel: "1 tomato, chopped" },
      { foodSlug: "pita-bread", grams: 65, displayLabel: "1 pita bread, warmed" },
    ],
    steps: [
      { content: "Mash the chickpeas with the garlic and shape into small patties." },
      { content: "Fry in the oil until golden on both sides.", durationSeconds: 480 },
      { content: "Serve over the salad leaves and tomato with hummus and warm pita." },
    ],
  },
  {
    name: "Chicken & Sweet Potato Bowl",
    description: "A well-balanced, meal-prep-friendly bowl with lean protein and complex carbs.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 20,
    ingredients: [
      { foodSlug: "chicken-breast-raw-skinless", grams: 150, displayLabel: "1 chicken breast" },
      { foodSlug: "sweet-potato-raw", grams: 200, displayLabel: "1 medium sweet potato, cubed" },
      { foodSlug: "broccoli-raw", grams: 150, displayLabel: "a head of broccoli, cut into florets" },
      { foodSlug: "olive-oil", grams: 12, displayLabel: "1 tbsp olive oil" },
    ],
    steps: [
      { content: "Preheat the oven to 200°C (400°F)." },
      { content: "Toss the sweet potato in half the oil and roast until tender.", durationSeconds: 1200 },
      {
        content: "Season and grill or pan-fry the chicken until cooked through, then slice.",
        durationSeconds: 600,
      },
      { content: "Steam the broccoli until tender.", durationSeconds: 300 },
      { content: "Combine everything in a bowl to serve." },
    ],
  },
  {
    name: "Greek Salad with Grilled Chicken",
    description: "A fresh, Mediterranean-style salad with a lean protein boost.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "chicken-breast-raw-skinless", grams: 150, displayLabel: "1 chicken breast" },
      { foodSlug: "cucumber-raw", grams: 100, displayLabel: "1/2 cucumber, chopped" },
      { foodSlug: "tomato-raw", grams: 150, displayLabel: "1 large tomato, chopped" },
      { foodSlug: "red-onion", grams: 40, displayLabel: "1/4 red onion, sliced" },
      { foodSlug: "feta-cheese", grams: 50, displayLabel: "a handful of crumbled feta" },
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
    ],
    steps: [
      {
        content: "Season and grill or pan-fry the chicken until cooked through, then slice.",
        durationSeconds: 600,
      },
      { content: "Combine the cucumber, tomato and red onion in a bowl." },
      { content: "Top with the feta and sliced chicken, and drizzle with olive oil." },
    ],
  },
  {
    name: "Club Sandwich",
    description: "A hearty, layered sandwich with a mix of textures and flavours.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 8,
    ingredients: [
      { foodSlug: "whole-wheat-bread", grams: 90, displayLabel: "3 slices bread" },
      {
        foodSlug: "chicken-breast-cooked-skinless",
        grams: 100,
        displayLabel: "1/2 cooked chicken breast, sliced",
      },
      { foodSlug: "bacon", grams: 30, displayLabel: "1 rasher of bacon" },
      { foodSlug: "tomato-raw", grams: 60, displayLabel: "1/2 tomato, sliced" },
      { foodSlug: "lettuce-romaine-raw", grams: 30, displayLabel: "a few lettuce leaves" },
    ],
    steps: [
      { content: "Toast the bread and grill or fry the bacon until crisp.", durationSeconds: 300 },
      { content: "Layer the chicken, bacon, tomato and lettuce between the toasted bread." },
      { content: "Slice into quarters to serve." },
    ],
  },

  // --- Round 2: more tea/dinner (further protein and cuisine variety) ---
  {
    name: "Beef & Broccoli",
    description: "A takeaway-style favourite, made lighter at home.",
    category: "TEA",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "beef-sirloin-steak-raw", grams: 300, displayLabel: "300g beef, thinly sliced" },
      { foodSlug: "broccoli-raw", grams: 250, displayLabel: "a large head of broccoli, cut into florets" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "ginger-raw", grams: 6, displayLabel: "a small piece of ginger, minced" },
      { foodSlug: "soy-sauce", grams: 40, displayLabel: "3 tbsp soy sauce" },
      { foodSlug: "sesame-oil", grams: 10, displayLabel: "2 tsp sesame oil" },
      { foodSlug: "white-rice-cooked", grams: 300, displayLabel: "1 1/2 cups cooked rice, to serve" },
    ],
    steps: [
      { content: "Heat the sesame oil in a wok over high heat." },
      { content: "Sear the beef in batches until browned, then set aside.", durationSeconds: 240 },
      { content: "Stir-fry the broccoli, garlic and ginger until tender-crisp.", durationSeconds: 300 },
      {
        content: "Return the beef to the wok, add the soy sauce, and toss to combine.",
        durationSeconds: 120,
      },
      { content: "Serve over the rice." },
    ],
  },
  {
    name: "Fish Tacos",
    description: "Light, flaky fish in a crisp tortilla with a fresh, zesty topping.",
    category: "TEA",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 12,
    ingredients: [
      { foodSlug: "cod-raw", grams: 300, displayLabel: "300g cod, cut into strips" },
      { foodSlug: "corn-tortilla", grams: 120, displayLabel: "4 small corn tortillas" },
      { foodSlug: "cabbage-raw", grams: 100, displayLabel: "a handful of shredded cabbage" },
      { foodSlug: "avocado-raw", grams: 100, displayLabel: "1/2 avocado, sliced" },
      { foodSlug: "lime-raw", grams: 20, displayLabel: "1 lime, cut into wedges" },
      { foodSlug: "olive-oil", grams: 12, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "salsa", grams: 60, displayLabel: "a few spoonfuls of salsa" },
    ],
    steps: [
      {
        content: "Season the cod and pan-fry in the oil until cooked through and flaking.",
        durationSeconds: 480,
      },
      { content: "Warm the tortillas." },
      { content: "Fill with the fish, cabbage, avocado and salsa, and finish with a squeeze of lime." },
    ],
  },
  {
    name: "Butter Chicken-Style Curry",
    description: "A milder, creamy curry that's become a firm favourite well beyond its origins.",
    category: "TEA",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 25,
    ingredients: [
      { foodSlug: "chicken-breast-raw-skinless", grams: 350, displayLabel: "350g chicken breast, cubed" },
      { foodSlug: "onion-raw", grams: 100, displayLabel: "1 onion, chopped" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "ginger-raw", grams: 6, displayLabel: "a small piece of ginger, minced" },
      { foodSlug: "tomato-raw", grams: 200, displayLabel: "2 tomatoes, chopped" },
      { foodSlug: "coconut-milk", grams: 150, displayLabel: "1/2 cup coconut milk" },
      { foodSlug: "curry-sauce", grams: 100, displayLabel: "1/3 cup curry sauce or paste" },
      { foodSlug: "white-rice-cooked", grams: 300, displayLabel: "1 1/2 cups cooked rice, to serve" },
    ],
    steps: [
      { content: "Sauté the onion, garlic and ginger until softened.", durationSeconds: 300 },
      { content: "Add the chicken and cook until browned on all sides.", durationSeconds: 360 },
      {
        content:
          "Add the curry sauce, tomatoes and coconut milk, and simmer until the chicken is cooked through.",
        durationSeconds: 900,
      },
      { content: "Serve over the rice." },
    ],
  },
  {
    name: "Spaghetti Bolognese",
    description: "A classic, comforting family meal made with lean beef mince.",
    category: "TEA",
    servings: 3,
    prepMinutes: 10,
    cookMinutes: 30,
    ingredients: [
      { foodSlug: "beef-mince-5pct-raw", grams: 400, displayLabel: "400g lean beef mince" },
      { foodSlug: "onion-raw", grams: 100, displayLabel: "1 onion, diced" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "carrot-raw", grams: 100, displayLabel: "1 carrot, diced" },
      { foodSlug: "tomato-raw", grams: 400, displayLabel: "4 tomatoes, chopped (or 1 tin)" },
      { foodSlug: "olive-oil", grams: 12, displayLabel: "1 tbsp olive oil" },
      { foodSlug: "pasta-cooked", grams: 450, displayLabel: "3 cups cooked spaghetti" },
    ],
    steps: [
      {
        content: "Heat the oil and sauté the onion, garlic and carrot until softened.",
        durationSeconds: 360,
      },
      {
        content: "Add the beef mince and cook until browned, breaking it up as it cooks.",
        durationSeconds: 360,
      },
      { content: "Add the tomatoes and simmer until the sauce thickens.", durationSeconds: 1200 },
      { content: "Serve over the spaghetti." },
    ],
  },
  {
    name: "Teriyaki Salmon",
    description: "A simple, glossy glaze that turns a salmon fillet into something special.",
    category: "TEA",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 15,
    ingredients: [
      { foodSlug: "salmon-raw", grams: 180, displayLabel: "1 salmon fillet" },
      { foodSlug: "soy-sauce", grams: 30, displayLabel: "2 tbsp soy sauce" },
      { foodSlug: "honey", grams: 15, displayLabel: "1 tbsp honey" },
      { foodSlug: "ginger-raw", grams: 5, displayLabel: "a small piece of ginger, grated" },
      { foodSlug: "white-rice-cooked", grams: 250, displayLabel: "1 1/4 cups cooked rice, to serve" },
      { foodSlug: "broccoli-raw", grams: 120, displayLabel: "a head of broccoli, cut into florets" },
    ],
    steps: [
      { content: "Mix the soy sauce, honey and ginger for the glaze." },
      {
        content:
          "Pan-fry or bake the salmon, brushing with the glaze partway through, until just cooked through.",
        durationSeconds: 720,
      },
      { content: "Steam the broccoli until tender.", durationSeconds: 300 },
      { content: "Serve the salmon with the rice and broccoli." },
    ],
  },
  {
    name: "Pork Chops with Apple",
    description: "A classic pairing -- savoury pork with a touch of natural sweetness.",
    category: "TEA",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 20,
    ingredients: [
      { foodSlug: "pork-loin-raw", grams: 350, displayLabel: "2 pork chops (350g)" },
      { foodSlug: "apple-raw", grams: 200, displayLabel: "2 apples, sliced" },
      { foodSlug: "sweet-potato-raw", grams: 300, displayLabel: "1 large sweet potato, cubed" },
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
    ],
    steps: [
      {
        content: "Toss the sweet potato in half the oil and roast at 200°C (400°F) until tender.",
        durationSeconds: 1200,
      },
      {
        content: "Season the pork and pan-fry in the remaining oil until cooked through.",
        durationSeconds: 480,
      },
      {
        content: "Add the apple slices to the pan for the last few minutes, until softened.",
        durationSeconds: 180,
      },
      { content: "Serve the pork and apple with the roasted sweet potato." },
    ],
  },
  {
    name: "Vegetable Stir-Fry with Tofu",
    description: "A quick, colourful, plant-based dinner packed with vegetables.",
    category: "TEA",
    servings: 2,
    prepMinutes: 12,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "tofu-firm", grams: 300, displayLabel: "300g firm tofu, cubed" },
      { foodSlug: "bell-pepper-red-raw", grams: 150, displayLabel: "1 red pepper, sliced" },
      { foodSlug: "broccoli-raw", grams: 150, displayLabel: "a head of broccoli, cut into florets" },
      { foodSlug: "carrot-raw", grams: 100, displayLabel: "1 carrot, sliced" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "soy-sauce", grams: 30, displayLabel: "2 tbsp soy sauce" },
      { foodSlug: "sesame-oil", grams: 10, displayLabel: "2 tsp sesame oil" },
      { foodSlug: "brown-rice-cooked", grams: 300, displayLabel: "1 1/2 cups cooked brown rice, to serve" },
    ],
    steps: [
      {
        content: "Pat the tofu dry and pan-fry in a little of the oil until golden on all sides.",
        durationSeconds: 360,
      },
      {
        content:
          "Set the tofu aside, then stir-fry the vegetables and garlic in the remaining oil until tender-crisp.",
        durationSeconds: 300,
      },
      { content: "Return the tofu to the pan, add the soy sauce, and toss to combine.", durationSeconds: 60 },
      { content: "Serve over the rice." },
    ],
  },

  // --- Round 2: more snacks ---
  {
    name: "Apple with Peanut Butter",
    description: "A simple, satisfying snack that pairs sweetness with protein and fibre.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 3,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "apple-raw", grams: 150, displayLabel: "1 apple, sliced" },
      { foodSlug: "peanut-butter", grams: 20, displayLabel: "1 tbsp peanut butter" },
    ],
    steps: [{ content: "Slice the apple and serve with the peanut butter for dipping." }],
  },
  {
    name: "Protein Smoothie",
    description: "A fast, portable way to top up protein between meals.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 3,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "greek-yogurt-plain-nonfat", grams: 150, displayLabel: "3/4 cup Greek yoghurt" },
      { foodSlug: "banana-raw", grams: 100, displayLabel: "1 banana" },
      { foodSlug: "milk-semi-skimmed", grams: 150, displayLabel: "150ml milk" },
      { foodSlug: "peanut-butter", grams: 15, displayLabel: "1 tbsp peanut butter" },
    ],
    steps: [{ content: "Blend all the ingredients together until smooth." }],
  },
  {
    name: "Edamame",
    description: "A simple, protein-rich snack, ready in minutes.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 1,
    cookMinutes: 5,
    ingredients: [{ foodSlug: "edamame", grams: 150, displayLabel: "1 cup edamame, in pods" }],
    steps: [
      { content: "Steam or boil the edamame until tender.", durationSeconds: 300 },
      { content: "Season lightly with salt and serve warm." },
    ],
  },
  {
    name: "Cheese & Crackers",
    description: "A classic, no-fuss snack that's easy to portion ahead.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 2,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "wholewheat-crackers", grams: 30, displayLabel: "6 wholewheat crackers" },
      { foodSlug: "cheddar-cheese", grams: 30, displayLabel: "a small handful of cheddar" },
    ],
    steps: [{ content: "Slice the cheese and serve on top of the crackers." }],
  },

  // --- Round 3: more breakfast ---
  {
    name: "Rice Porridge (Congee-Style)",
    description: "A warming, savoury rice porridge -- a comforting alternative to sweet breakfasts.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 20,
    ingredients: [
      { foodSlug: "white-rice-cooked", grams: 150, displayLabel: "3/4 cup cooked rice" },
      { foodSlug: "egg-whole-raw", grams: 50, displayLabel: "1 egg" },
      { foodSlug: "soy-sauce", grams: 15, displayLabel: "1 tbsp soy sauce" },
      { foodSlug: "ginger-raw", grams: 5, displayLabel: "a small piece of ginger, sliced" },
    ],
    steps: [
      {
        content:
          "Simmer the rice with a generous amount of water and the ginger, stirring occasionally, until it breaks down into a thick porridge.",
        durationSeconds: 900,
      },
      { content: "Stir in a beaten egg and cook for a minute until just set.", durationSeconds: 60 },
      { content: "Season with soy sauce to taste." },
    ],
  },
  {
    name: "Breakfast Quesadilla",
    description: "A cheesy, egg-filled tortilla that's ready in minutes.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 8,
    ingredients: [
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "cheddar-cheese", grams: 40, displayLabel: "a handful of grated cheddar" },
      { foodSlug: "whole-wheat-tortilla", grams: 70, displayLabel: "1 large wholewheat tortilla" },
      { foodSlug: "salsa", grams: 30, displayLabel: "a spoonful of salsa, to serve" },
    ],
    steps: [
      { content: "Scramble the eggs in a non-stick pan.", durationSeconds: 180 },
      {
        content:
          "Spread the scrambled eggs and cheese over half the tortilla, fold over, and cook until the cheese melts and the tortilla is golden.",
        durationSeconds: 240,
      },
      { content: "Slice and serve with salsa." },
    ],
  },
  {
    name: "Date & Nut Overnight Oats",
    description: "A naturally sweet twist on overnight oats using dates instead of added sugar.",
    category: "BREAKFAST",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "oats-dry", grams: 50, displayLabel: "1/2 cup rolled oats" },
      { foodSlug: "milk-semi-skimmed", grams: 150, displayLabel: "150ml semi-skimmed milk" },
      { foodSlug: "dates-dried", grams: 30, displayLabel: "2 dates, chopped" },
      { foodSlug: "almonds", grams: 15, displayLabel: "a small handful of almonds, chopped" },
      { foodSlug: "greek-yogurt-plain-nonfat", grams: 60, displayLabel: "1/4 cup Greek yoghurt" },
    ],
    steps: [
      { content: "Combine the oats, milk, chopped dates and yoghurt in a jar." },
      { content: "Cover and refrigerate overnight.", durationSeconds: 28800 },
      { content: "Top with chopped almonds before serving." },
    ],
  },

  // --- Round 3: more brunch ---
  {
    name: "Eggs Florentine-Style",
    description: "Poached eggs over spinach and toast -- a lighter take on the classic.",
    category: "BRUNCH",
    servings: 1,
    prepMinutes: 8,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "egg-whole-raw", grams: 100, displayLabel: "2 large eggs" },
      { foodSlug: "spinach-raw", grams: 80, displayLabel: "2 large handfuls of spinach" },
      { foodSlug: "whole-wheat-bread", grams: 60, displayLabel: "2 slices bread, toasted" },
      { foodSlug: "olive-oil", grams: 8, displayLabel: "2 tsp olive oil" },
    ],
    steps: [
      { content: "Wilt the spinach in a pan with the olive oil.", durationSeconds: 120 },
      { content: "Poach the eggs in gently simmering water until the whites are set.", durationSeconds: 240 },
      { content: "Serve the eggs and spinach over the toast." },
    ],
  },
  {
    name: "Breakfast Hash",
    description: "A hearty one-pan mix of potatoes, eggs, and vegetables.",
    category: "BRUNCH",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 20,
    ingredients: [
      { foodSlug: "potato-raw", grams: 300, displayLabel: "2 medium potatoes, diced" },
      { foodSlug: "bell-pepper-red-raw", grams: 100, displayLabel: "1 red pepper, diced" },
      { foodSlug: "onion-raw", grams: 80, displayLabel: "1/2 onion, diced" },
      { foodSlug: "egg-whole-raw", grams: 150, displayLabel: "3 large eggs" },
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
    ],
    steps: [
      { content: "Fry the potatoes in the oil until golden and nearly tender.", durationSeconds: 600 },
      { content: "Add the pepper and onion, and cook until softened.", durationSeconds: 300 },
      {
        content: "Make wells in the hash and crack in the eggs, cover, and cook until set to your liking.",
        durationSeconds: 300,
      },
    ],
  },

  // --- Round 3: more lunch ---
  {
    name: "Poke-Style Salmon Bowl",
    description: "A fresh, Hawaiian-inspired bowl built around raw-marinated salmon.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 15,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "salmon-raw", grams: 150, displayLabel: "150g sushi-grade salmon, cubed" },
      { foodSlug: "soy-sauce", grams: 20, displayLabel: "4 tsp soy sauce" },
      { foodSlug: "sesame-oil", grams: 8, displayLabel: "2 tsp sesame oil" },
      { foodSlug: "white-rice-cooked", grams: 200, displayLabel: "1 cup cooked rice" },
      { foodSlug: "cucumber-raw", grams: 80, displayLabel: "1/3 cucumber, diced" },
      { foodSlug: "avocado-raw", grams: 80, displayLabel: "1/2 avocado, sliced" },
      { foodSlug: "nori-seaweed", grams: 3, displayLabel: "1 sheet nori, shredded" },
    ],
    steps: [
      {
        content: "Marinate the salmon in the soy sauce and sesame oil for a few minutes.",
        durationSeconds: 300,
      },
      { content: "Spoon the rice into a bowl and top with the marinated salmon, cucumber and avocado." },
      { content: "Finish with the shredded nori." },
    ],
  },
  {
    name: "Minestrone Soup",
    description: "A hearty, vegetable-packed Italian soup.",
    category: "LUNCH",
    servings: 3,
    prepMinutes: 10,
    cookMinutes: 30,
    ingredients: [
      { foodSlug: "onion-raw", grams: 100, displayLabel: "1 onion, diced" },
      { foodSlug: "carrot-raw", grams: 150, displayLabel: "2 carrots, diced" },
      { foodSlug: "celery-raw", grams: 100, displayLabel: "2 sticks celery, diced" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "tomato-raw", grams: 300, displayLabel: "3 tomatoes, chopped (or 1 tin)" },
      { foodSlug: "chickpeas-cooked", grams: 200, displayLabel: "1 cup chickpeas" },
      { foodSlug: "pasta-cooked", grams: 150, displayLabel: "3/4 cup small cooked pasta" },
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
    ],
    steps: [
      {
        content: "Sauté the onion, carrot, celery and garlic in the oil until softened.",
        durationSeconds: 480,
      },
      {
        content: "Add the tomatoes and chickpeas along with stock or water to cover, and simmer.",
        durationSeconds: 1200,
      },
      { content: "Stir in the cooked pasta and warm through before serving." },
    ],
  },
  {
    name: "Caprese Salad with Chicken",
    description: "Fresh mozzarella, tomato and basil, with a lean protein addition.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 10,
    ingredients: [
      { foodSlug: "chicken-breast-raw-skinless", grams: 150, displayLabel: "1 chicken breast" },
      { foodSlug: "mozzarella-fresh", grams: 80, displayLabel: "80g fresh mozzarella, sliced" },
      { foodSlug: "tomato-raw", grams: 200, displayLabel: "2 large tomatoes, sliced" },
      { foodSlug: "olive-oil", grams: 12, displayLabel: "1 tbsp olive oil" },
    ],
    steps: [
      {
        content: "Season and grill or pan-fry the chicken until cooked through, then slice.",
        durationSeconds: 600,
      },
      { content: "Layer the tomato and mozzarella slices on a plate." },
      { content: "Top with the sliced chicken and drizzle with olive oil." },
    ],
  },
  {
    name: "Mediterranean Couscous Bowl",
    description: "A light, herby bowl with couscous, olives, and feta.",
    category: "LUNCH",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 5,
    ingredients: [
      { foodSlug: "couscous-cooked", grams: 200, displayLabel: "1 cup cooked couscous" },
      { foodSlug: "cucumber-raw", grams: 100, displayLabel: "1/2 cucumber, diced" },
      { foodSlug: "tomato-raw", grams: 100, displayLabel: "1 tomato, diced" },
      { foodSlug: "olives-black", grams: 30, displayLabel: "a small handful of black olives" },
      { foodSlug: "feta-cheese", grams: 50, displayLabel: "a handful of crumbled feta" },
      { foodSlug: "olive-oil", grams: 12, displayLabel: "1 tbsp olive oil" },
    ],
    steps: [
      { content: "Combine the couscous, cucumber and tomato in a bowl." },
      { content: "Top with the olives and feta, and drizzle with olive oil." },
    ],
  },

  // --- Round 3: more tea/dinner (world cuisine) ---
  {
    name: "Chicken Tikka Masala",
    description: "A well-loved, creamy curry with tender spiced chicken.",
    category: "TEA",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 25,
    ingredients: [
      { foodSlug: "chicken-breast-raw-skinless", grams: 350, displayLabel: "350g chicken breast, cubed" },
      {
        foodSlug: "greek-yogurt-plain-nonfat",
        grams: 100,
        displayLabel: "1/2 cup Greek yoghurt, for marinating",
      },
      { foodSlug: "onion-raw", grams: 100, displayLabel: "1 onion, chopped" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "tomato-raw", grams: 200, displayLabel: "2 tomatoes, chopped" },
      { foodSlug: "coconut-milk", grams: 150, displayLabel: "1/2 cup coconut milk" },
      { foodSlug: "curry-sauce", grams: 80, displayLabel: "1/3 cup curry sauce or paste" },
      { foodSlug: "white-rice-cooked", grams: 300, displayLabel: "1 1/2 cups cooked rice, to serve" },
    ],
    steps: [
      { content: "Marinate the chicken in the yoghurt for at least 20 minutes.", durationSeconds: 1200 },
      {
        content: "Sauté the onion and garlic until softened, then add the chicken and cook until browned.",
        durationSeconds: 480,
      },
      {
        content:
          "Add the curry sauce, tomatoes and coconut milk, and simmer until the chicken is cooked through.",
        durationSeconds: 900,
      },
      { content: "Serve over the rice." },
    ],
  },
  {
    name: "Beef Tacos",
    description: "Classic, crowd-pleasing tacos with seasoned beef mince.",
    category: "TEA",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 15,
    ingredients: [
      { foodSlug: "beef-mince-5pct-raw", grams: 350, displayLabel: "350g lean beef mince" },
      { foodSlug: "onion-raw", grams: 80, displayLabel: "1/2 onion, diced" },
      { foodSlug: "corn-tortilla", grams: 120, displayLabel: "4 small corn tortillas" },
      { foodSlug: "cheddar-cheese", grams: 40, displayLabel: "a handful of grated cheddar" },
      { foodSlug: "lettuce-romaine-raw", grams: 40, displayLabel: "a handful of shredded lettuce" },
      { foodSlug: "salsa", grams: 60, displayLabel: "a few spoonfuls of salsa" },
    ],
    steps: [
      { content: "Brown the beef mince with the onion in a pan.", durationSeconds: 480 },
      { content: "Warm the tortillas." },
      { content: "Fill with the beef, cheese, lettuce and salsa." },
    ],
  },
  {
    name: "Chicken Parmesan",
    description: "Breaded chicken breast baked with tomato sauce and melted cheese.",
    category: "TEA",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 25,
    ingredients: [
      { foodSlug: "chicken-breast-raw-skinless", grams: 350, displayLabel: "2 chicken breasts" },
      { foodSlug: "breadcrumbs-whole-wheat", grams: 60, displayLabel: "1/2 cup wholewheat breadcrumbs" },
      { foodSlug: "egg-whole-raw", grams: 50, displayLabel: "1 egg, for coating" },
      { foodSlug: "tomato-raw", grams: 300, displayLabel: "3 tomatoes, chopped (or 1 tin)" },
      { foodSlug: "mozzarella-fresh", grams: 80, displayLabel: "80g mozzarella, sliced" },
      { foodSlug: "pasta-cooked", grams: 300, displayLabel: "1 1/2 cups cooked pasta, to serve" },
    ],
    steps: [
      { content: "Preheat the oven to 200°C (400°F)." },
      { content: "Dip the chicken in beaten egg, then coat in breadcrumbs." },
      {
        content:
          "Bake until nearly cooked through, then top with tomato and mozzarella and return to the oven until melted and the chicken is cooked through.",
        durationSeconds: 1200,
      },
      { content: "Serve with the pasta." },
    ],
  },
  {
    name: "Miso Glazed Salmon",
    description: "A savoury-sweet glaze that pairs beautifully with rich salmon.",
    category: "TEA",
    servings: 1,
    prepMinutes: 10,
    cookMinutes: 15,
    ingredients: [
      { foodSlug: "salmon-raw", grams: 180, displayLabel: "1 salmon fillet" },
      { foodSlug: "miso-paste", grams: 20, displayLabel: "4 tsp miso paste" },
      { foodSlug: "honey", grams: 10, displayLabel: "2 tsp honey" },
      { foodSlug: "white-rice-cooked", grams: 250, displayLabel: "1 1/4 cups cooked rice, to serve" },
      { foodSlug: "broccoli-raw", grams: 120, displayLabel: "a head of broccoli, cut into florets" },
    ],
    steps: [
      { content: "Mix the miso paste and honey for the glaze." },
      {
        content: "Brush over the salmon and bake or pan-fry until just cooked through.",
        durationSeconds: 720,
      },
      { content: "Steam the broccoli until tender.", durationSeconds: 300 },
      { content: "Serve the salmon with the rice and broccoli." },
    ],
  },
  {
    name: "Vegetable Paella",
    description: "A plant-based take on the classic Spanish rice dish.",
    category: "TEA",
    servings: 3,
    prepMinutes: 15,
    cookMinutes: 30,
    ingredients: [
      { foodSlug: "white-rice-cooked", grams: 450, displayLabel: "2 1/4 cups rice (cooked in the paella)" },
      { foodSlug: "bell-pepper-red-raw", grams: 150, displayLabel: "1 red pepper, sliced" },
      { foodSlug: "peas-cooked", grams: 150, displayLabel: "1 cup peas" },
      { foodSlug: "tomato-raw", grams: 200, displayLabel: "2 tomatoes, chopped" },
      { foodSlug: "garlic-raw", grams: 6, displayLabel: "2 cloves garlic, minced" },
      { foodSlug: "olive-oil", grams: 20, displayLabel: "4 tsp olive oil" },
    ],
    steps: [
      { content: "Sauté the garlic and pepper in the oil until softened.", durationSeconds: 300 },
      {
        content:
          "Add the tomatoes and rice, along with stock or water, and simmer until the rice has absorbed the liquid.",
        durationSeconds: 1200,
      },
      { content: "Stir in the peas for the last few minutes of cooking.", durationSeconds: 180 },
    ],
  },
  {
    name: "Moroccan-Spiced Chicken with Couscous",
    description: "Warmly spiced chicken served over fluffy couscous.",
    category: "TEA",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 20,
    ingredients: [
      { foodSlug: "chicken-breast-raw-skinless", grams: 350, displayLabel: "2 chicken breasts" },
      { foodSlug: "couscous-cooked", grams: 300, displayLabel: "1 1/2 cups cooked couscous" },
      { foodSlug: "dates-dried", grams: 30, displayLabel: "2 dates, chopped" },
      { foodSlug: "almonds", grams: 20, displayLabel: "a small handful of almonds" },
      { foodSlug: "olive-oil", grams: 15, displayLabel: "1 tbsp olive oil" },
    ],
    steps: [
      {
        content: "Season the chicken generously and pan-fry or grill until cooked through.",
        durationSeconds: 600,
      },
      { content: "Slice the chicken and serve over the couscous." },
      { content: "Scatter over the chopped dates and almonds." },
    ],
  },
  {
    name: "Pad Thai-Style Noodles",
    description: "A lighter take on the Thai favourite, packed with vegetables.",
    category: "TEA",
    servings: 2,
    prepMinutes: 15,
    cookMinutes: 12,
    ingredients: [
      { foodSlug: "rice-noodles-cooked", grams: 300, displayLabel: "1 1/2 cups cooked rice noodles" },
      { foodSlug: "shrimp-raw", grams: 200, displayLabel: "200g raw prawns, peeled" },
      { foodSlug: "egg-whole-raw", grams: 50, displayLabel: "1 egg" },
      { foodSlug: "bell-pepper-red-raw", grams: 100, displayLabel: "1 red pepper, sliced" },
      { foodSlug: "soy-sauce", grams: 30, displayLabel: "2 tbsp soy sauce" },
      { foodSlug: "lime-raw", grams: 15, displayLabel: "1 lime, cut into wedges" },
    ],
    steps: [
      {
        content: "Stir-fry the prawns and pepper in a hot wok until the prawns turn pink.",
        durationSeconds: 240,
      },
      { content: "Push to one side, scramble the egg in the same wok, then mix together." },
      {
        content: "Add the noodles and soy sauce, and toss everything together until warmed through.",
        durationSeconds: 180,
      },
      { content: "Serve with lime wedges." },
    ],
  },

  // --- Round 3: more snacks ---
  {
    name: "Protein Balls",
    description: "No-bake, naturally sweetened bites -- great for meal prep.",
    category: "SNACK",
    servings: 6,
    prepMinutes: 15,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "dates-dried", grams: 150, displayLabel: "10 dates, pitted" },
      { foodSlug: "oats-dry", grams: 100, displayLabel: "1 cup rolled oats" },
      { foodSlug: "peanut-butter", grams: 60, displayLabel: "1/4 cup peanut butter" },
      { foodSlug: "mixed-nuts", grams: 40, displayLabel: "a small handful of mixed nuts, chopped" },
    ],
    steps: [
      { content: "Blend the dates, oats and peanut butter together until they form a sticky mixture." },
      { content: "Stir in the chopped nuts." },
      { content: "Roll into small balls and refrigerate until firm.", durationSeconds: 1800 },
    ],
  },
  {
    name: "Cucumber & Hummus",
    description: "A crisp, refreshing snack with a creamy dip.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 3,
    cookMinutes: 0,
    ingredients: [
      { foodSlug: "cucumber-raw", grams: 150, displayLabel: "1 cucumber, sliced into sticks" },
      { foodSlug: "hummus", grams: 60, displayLabel: "1/4 cup hummus" },
    ],
    steps: [{ content: "Serve the cucumber sticks alongside the hummus for dipping." }],
  },
  {
    name: "Popcorn",
    description: "A whole-grain snack that's surprisingly filling for the calories.",
    category: "SNACK",
    servings: 1,
    prepMinutes: 2,
    cookMinutes: 5,
    ingredients: [{ foodSlug: "popcorn-air-popped", grams: 30, displayLabel: "3 cups air-popped popcorn" }],
    steps: [{ content: "Air-pop the popcorn and season lightly with salt, if you like." }],
  },
];
