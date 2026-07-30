/**
 * Maps each curated recipe name to one of the static illustrations in
 * /public/recipe-illustrations. Not real food photography (no live
 * source for that here) -- simple, on-theme flat-icon illustrations
 * using the app's actual brand/macro colors, several recipes sharing an
 * illustration where the dish type is genuinely similar (e.g. every
 * salad uses the same bowl illustration) rather than pretending each of
 * the 54 recipes needs a wholly unique piece of art.
 */
export const RECIPE_IMAGE_MAP: Record<string, string> = {
  // Breakfast
  "Overnight Oats with Berries": "oats-bowl",
  "Greek Yoghurt Protein Bowl": "oats-bowl",
  "Veggie Scrambled Eggs": "eggs-plate",
  "Protein Pancakes with Maple Syrup": "pancakes",
  "Breakfast Burrito": "burrito-wrap",
  "Full English-Style Breakfast Plate": "eggs-plate",
  "Bircher Muesli": "oats-bowl",
  "Breakfast Smoothie Bowl": "smoothie-bowl",
  "Cottage Cheese & Fruit Bowl": "smoothie-bowl",

  // Brunch
  "Avocado Toast with Poached Egg": "toast-avocado",
  Shakshuka: "shakshuka-pan",
  "Mushroom & Spinach Omelette": "eggs-plate",
  "Bacon & Eggs on Toast": "eggs-plate",
  "Smoked Salmon Bagel": "sandwich",
  "Huevos Rancheros": "burrito-wrap",
  "French Toast": "pancakes",

  // Lunch
  "Grilled Chicken & Quinoa Salad": "salad-bowl",
  "Turkey & Hummus Wrap": "burrito-wrap",
  "Tuna Niçoise-Style Salad": "salad-bowl",
  "Chickpea & Feta Salad": "salad-bowl",
  "Lentil Soup": "soup-bowl",
  "Chicken Caesar-Style Salad": "salad-bowl",
  "BLT-Style Chicken Wrap": "burrito-wrap",
  "Tuna Pasta Salad": "pasta-bowl",
  "Falafel & Hummus Bowl": "kofta-plate",
  "Chicken & Sweet Potato Bowl": "rice-bowl",
  "Greek Salad with Grilled Chicken": "salad-bowl",
  "Club Sandwich": "sandwich",

  // Tea/dinner
  "Baked Salmon with Sweet Potato & Broccoli": "protein-plate",
  "Beef Stir-Fry with Brown Rice": "stir-fry",
  "One-Pan Chicken Fajitas": "fajitas-plate",
  "Baked Cod with Lemon & Herbs": "protein-plate",
  "Grilled Steak with Chimichurri": "protein-plate",
  "Turkey Meatballs with Marinara": "meatballs-plate",
  "Pork Tenderloin with Roasted Vegetables": "protein-plate",
  "Garlic Prawn Stir-Fry with Rice": "stir-fry",
  "Lentil & Vegetable Curry": "curry-bowl",
  "Lamb Kofta with Tzatziki": "kofta-plate",
  "Beef & Broccoli": "stir-fry",
  "Fish Tacos": "burrito-wrap",
  "Butter Chicken-Style Curry": "curry-bowl",
  "Spaghetti Bolognese": "pasta-bowl",
  "Teriyaki Salmon": "protein-plate",
  "Pork Chops with Apple": "protein-plate",
  "Vegetable Stir-Fry with Tofu": "stir-fry",

  // Snacks
  "Peanut Butter Banana Toast": "toast-avocado",
  "Greek Yoghurt with Almonds & Honey": "snack-simple",
  "Rice Cakes with Cottage Cheese": "snack-simple",
  "Trail Mix": "snack-simple",
  "Hard-Boiled Eggs & Veggies": "snack-simple",
  "Apple with Peanut Butter": "snack-simple",
  "Protein Smoothie": "smoothie-bowl",
  Edamame: "snack-simple",
  "Cheese & Crackers": "snack-simple",
};
