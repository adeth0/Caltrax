/**
 * Seeds common whole foods that Open Food Facts covers poorly — it's a
 * crowdsourced barcode/packaged-goods database, so unbranded fresh produce
 * ("a banana", "chicken breast") often has sparse or missing entries there.
 * These are global reference foods (ownerId: null, source: CUSTOM) so
 * every user gets reliable results for common items regardless of what
 * OFF happens to have. Values are standard per-100g reference figures
 * (USDA FoodData Central, raw/typical preparation as noted).
 *
 * Run with: npm run db:seed
 * (safe to re-run — upserts by a stable slug, never duplicates)
 */
/**
 * Prisma's CLI only auto-loads a file literally named `.env` -- not
 * `.env.local`, which is the Next.js convention this project actually
 * uses everywhere else. Without this, DATABASE_URL (and everything else)
 * is simply missing when running this script standalone, even though
 * the exact same variables work fine for `next dev`/`next build`.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient, FoodSource } from "@prisma/client";
import { CURATED_RECIPES } from "./recipeSeedData";
import { CURATED_SUPPLEMENTS } from "./supplementSeedData";

const db = new PrismaClient();

interface SeedFood {
  slug: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fibrePer100g?: number;
  sugarPer100g?: number;
}

const FOODS: SeedFood[] = [
  // --- Fruits ---
  {
    slug: "apple-raw",
    name: "Apple, raw",
    category: "fruit",
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fatPer100g: 0.2,
    fibrePer100g: 2.4,
    sugarPer100g: 10.4,
  },
  {
    slug: "banana-raw",
    name: "Banana, raw",
    category: "fruit",
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatPer100g: 0.3,
    fibrePer100g: 2.6,
    sugarPer100g: 12.2,
  },
  {
    slug: "strawberries-raw",
    name: "Strawberries, raw",
    category: "fruit",
    caloriesPer100g: 32,
    proteinPer100g: 0.7,
    carbsPer100g: 7.7,
    fatPer100g: 0.3,
    fibrePer100g: 2.0,
    sugarPer100g: 4.9,
  },
  {
    slug: "blueberries-raw",
    name: "Blueberries, raw",
    category: "fruit",
    caloriesPer100g: 57,
    proteinPer100g: 0.7,
    carbsPer100g: 14.5,
    fatPer100g: 0.3,
    fibrePer100g: 2.4,
    sugarPer100g: 10.0,
  },
  {
    slug: "raspberries-raw",
    name: "Raspberries, raw",
    category: "fruit",
    caloriesPer100g: 52,
    proteinPer100g: 1.2,
    carbsPer100g: 11.9,
    fatPer100g: 0.7,
    fibrePer100g: 6.5,
    sugarPer100g: 4.4,
  },
  {
    slug: "melon-cantaloupe-raw",
    name: "Melon (cantaloupe), raw",
    category: "fruit",
    caloriesPer100g: 34,
    proteinPer100g: 0.8,
    carbsPer100g: 8.2,
    fatPer100g: 0.2,
    fibrePer100g: 0.9,
    sugarPer100g: 7.9,
  },
  {
    slug: "watermelon-raw",
    name: "Watermelon, raw",
    category: "fruit",
    caloriesPer100g: 30,
    proteinPer100g: 0.6,
    carbsPer100g: 7.6,
    fatPer100g: 0.2,
    fibrePer100g: 0.4,
    sugarPer100g: 6.2,
  },
  {
    slug: "orange-raw",
    name: "Orange, raw",
    category: "fruit",
    caloriesPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 11.8,
    fatPer100g: 0.1,
    fibrePer100g: 2.4,
    sugarPer100g: 9.4,
  },
  {
    slug: "grapes-raw",
    name: "Grapes, raw",
    category: "fruit",
    caloriesPer100g: 69,
    proteinPer100g: 0.7,
    carbsPer100g: 18.1,
    fatPer100g: 0.2,
    fibrePer100g: 0.9,
    sugarPer100g: 15.5,
  },
  {
    slug: "pineapple-raw",
    name: "Pineapple, raw",
    category: "fruit",
    caloriesPer100g: 50,
    proteinPer100g: 0.5,
    carbsPer100g: 13.1,
    fatPer100g: 0.1,
    fibrePer100g: 1.4,
    sugarPer100g: 9.9,
  },
  {
    slug: "mango-raw",
    name: "Mango, raw",
    category: "fruit",
    caloriesPer100g: 60,
    proteinPer100g: 0.8,
    carbsPer100g: 15.0,
    fatPer100g: 0.4,
    fibrePer100g: 1.6,
    sugarPer100g: 13.7,
  },
  {
    slug: "pear-raw",
    name: "Pear, raw",
    category: "fruit",
    caloriesPer100g: 57,
    proteinPer100g: 0.4,
    carbsPer100g: 15.2,
    fatPer100g: 0.1,
    fibrePer100g: 3.1,
    sugarPer100g: 9.8,
  },
  {
    slug: "kiwi-fruit-raw",
    name: "Kiwi fruit, raw",
    category: "fruit",
    caloriesPer100g: 61,
    proteinPer100g: 1.1,
    carbsPer100g: 14.7,
    fatPer100g: 0.5,
    fibrePer100g: 3.0,
    sugarPer100g: 9.0,
  },
  {
    slug: "avocado-raw",
    name: "Avocado, raw",
    category: "fruit",
    caloriesPer100g: 160,
    proteinPer100g: 2.0,
    carbsPer100g: 8.5,
    fatPer100g: 14.7,
    fibrePer100g: 6.7,
    sugarPer100g: 0.7,
  },
  {
    slug: "peach-raw",
    name: "Peach, raw",
    category: "fruit",
    caloriesPer100g: 39,
    proteinPer100g: 0.9,
    carbsPer100g: 9.5,
    fatPer100g: 0.3,
    fibrePer100g: 1.5,
    sugarPer100g: 8.4,
  },
  {
    slug: "cherries-raw",
    name: "Cherries, raw",
    category: "fruit",
    caloriesPer100g: 63,
    proteinPer100g: 1.1,
    carbsPer100g: 16.0,
    fatPer100g: 0.2,
    fibrePer100g: 2.1,
    sugarPer100g: 12.8,
  },
  {
    slug: "grapefruit-raw",
    name: "Grapefruit, raw",
    category: "fruit",
    caloriesPer100g: 42,
    proteinPer100g: 0.8,
    carbsPer100g: 10.7,
    fatPer100g: 0.1,
    fibrePer100g: 1.6,
    sugarPer100g: 6.9,
  },
  {
    slug: "plum-raw",
    name: "Plum, raw",
    category: "fruit",
    caloriesPer100g: 46,
    proteinPer100g: 0.7,
    carbsPer100g: 11.4,
    fatPer100g: 0.3,
    fibrePer100g: 1.4,
    sugarPer100g: 9.9,
  },
  {
    slug: "lemon-raw",
    name: "Lemon, raw",
    category: "fruit",
    caloriesPer100g: 29,
    proteinPer100g: 1.1,
    carbsPer100g: 9.3,
    fatPer100g: 0.3,
    fibrePer100g: 2.8,
  },

  // --- Vegetables ---
  {
    slug: "broccoli-raw",
    name: "Broccoli, raw",
    category: "vegetable",
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 6.6,
    fatPer100g: 0.4,
    fibrePer100g: 2.6,
  },
  {
    slug: "carrot-raw",
    name: "Carrot, raw",
    category: "vegetable",
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 9.6,
    fatPer100g: 0.2,
    fibrePer100g: 2.8,
  },
  {
    slug: "spinach-raw",
    name: "Spinach, raw",
    category: "vegetable",
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    fibrePer100g: 2.2,
  },
  {
    slug: "sweet-potato-raw",
    name: "Sweet potato, raw",
    category: "vegetable",
    caloriesPer100g: 86,
    proteinPer100g: 1.6,
    carbsPer100g: 20.1,
    fatPer100g: 0.1,
    fibrePer100g: 3.0,
  },
  {
    slug: "potato-raw",
    name: "Potato, raw",
    category: "vegetable",
    caloriesPer100g: 77,
    proteinPer100g: 2.0,
    carbsPer100g: 17.5,
    fatPer100g: 0.1,
    fibrePer100g: 2.2,
  },
  {
    slug: "tomato-raw",
    name: "Tomato, raw",
    category: "vegetable",
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatPer100g: 0.2,
    fibrePer100g: 1.2,
  },
  {
    slug: "cucumber-raw",
    name: "Cucumber, raw",
    category: "vegetable",
    caloriesPer100g: 15,
    proteinPer100g: 0.7,
    carbsPer100g: 3.6,
    fatPer100g: 0.1,
    fibrePer100g: 0.5,
  },
  {
    slug: "bell-pepper-red-raw",
    name: "Bell pepper (red), raw",
    category: "vegetable",
    caloriesPer100g: 31,
    proteinPer100g: 1.0,
    carbsPer100g: 6.0,
    fatPer100g: 0.3,
    fibrePer100g: 2.1,
  },
  {
    slug: "onion-raw",
    name: "Onion, raw",
    category: "vegetable",
    caloriesPer100g: 40,
    proteinPer100g: 1.1,
    carbsPer100g: 9.3,
    fatPer100g: 0.1,
    fibrePer100g: 1.7,
  },
  {
    slug: "lettuce-romaine-raw",
    name: "Lettuce (romaine), raw",
    category: "vegetable",
    caloriesPer100g: 17,
    proteinPer100g: 1.2,
    carbsPer100g: 3.3,
    fatPer100g: 0.3,
    fibrePer100g: 2.1,
  },
  {
    slug: "cauliflower-raw",
    name: "Cauliflower, raw",
    category: "vegetable",
    caloriesPer100g: 25,
    proteinPer100g: 1.9,
    carbsPer100g: 5.0,
    fatPer100g: 0.3,
    fibrePer100g: 2.0,
  },
  {
    slug: "green-beans-raw",
    name: "Green beans, raw",
    category: "vegetable",
    caloriesPer100g: 31,
    proteinPer100g: 1.8,
    carbsPer100g: 7.0,
    fatPer100g: 0.2,
    fibrePer100g: 3.4,
  },
  {
    slug: "zucchini-raw",
    name: "Zucchini, raw",
    category: "vegetable",
    caloriesPer100g: 17,
    proteinPer100g: 1.2,
    carbsPer100g: 3.1,
    fatPer100g: 0.3,
    fibrePer100g: 1.0,
  },
  {
    slug: "mushroom-white-raw",
    name: "Mushroom (white), raw",
    category: "vegetable",
    caloriesPer100g: 22,
    proteinPer100g: 3.1,
    carbsPer100g: 3.3,
    fatPer100g: 0.3,
    fibrePer100g: 1.0,
  },
  {
    slug: "sweet-corn-raw",
    name: "Sweet corn, raw",
    category: "vegetable",
    caloriesPer100g: 86,
    proteinPer100g: 3.2,
    carbsPer100g: 19.0,
    fatPer100g: 1.2,
    fibrePer100g: 2.7,
  },
  {
    slug: "asparagus-raw",
    name: "Asparagus, raw",
    category: "vegetable",
    caloriesPer100g: 20,
    proteinPer100g: 2.2,
    carbsPer100g: 3.9,
    fatPer100g: 0.1,
    fibrePer100g: 2.1,
  },
  {
    slug: "kale-raw",
    name: "Kale, raw",
    category: "vegetable",
    caloriesPer100g: 49,
    proteinPer100g: 4.3,
    carbsPer100g: 8.8,
    fatPer100g: 0.9,
    fibrePer100g: 3.6,
  },
  {
    slug: "cabbage-raw",
    name: "Cabbage, raw",
    category: "vegetable",
    caloriesPer100g: 25,
    proteinPer100g: 1.3,
    carbsPer100g: 5.8,
    fatPer100g: 0.1,
    fibrePer100g: 2.5,
  },
  {
    slug: "celery-raw",
    name: "Celery, raw",
    category: "vegetable",
    caloriesPer100g: 14,
    proteinPer100g: 0.7,
    carbsPer100g: 3.0,
    fatPer100g: 0.2,
    fibrePer100g: 1.6,
  },
  {
    slug: "beetroot-raw",
    name: "Beetroot, raw",
    category: "vegetable",
    caloriesPer100g: 43,
    proteinPer100g: 1.6,
    carbsPer100g: 9.6,
    fatPer100g: 0.2,
    fibrePer100g: 2.8,
  },

  // --- Proteins & staples (raw and cooked variants, since grams-as-eaten differ a lot) ---
  {
    slug: "chicken-breast-raw-skinless",
    name: "Chicken breast, raw, skinless",
    category: "protein",
    caloriesPer100g: 120,
    proteinPer100g: 22.5,
    carbsPer100g: 0,
    fatPer100g: 2.6,
  },
  {
    slug: "chicken-breast-cooked-skinless",
    name: "Chicken breast, cooked, skinless",
    category: "protein",
    caloriesPer100g: 165,
    proteinPer100g: 31.0,
    carbsPer100g: 0,
    fatPer100g: 3.6,
  },
  {
    slug: "chicken-thigh-raw-skinless",
    name: "Chicken thigh, raw, skinless",
    category: "protein",
    caloriesPer100g: 119,
    proteinPer100g: 18.6,
    carbsPer100g: 0,
    fatPer100g: 4.5,
  },
  {
    slug: "salmon-raw",
    name: "Salmon, raw",
    category: "protein",
    caloriesPer100g: 208,
    proteinPer100g: 20.4,
    carbsPer100g: 0,
    fatPer100g: 13.4,
  },
  {
    slug: "salmon-cooked",
    name: "Salmon, cooked",
    category: "protein",
    caloriesPer100g: 206,
    proteinPer100g: 22.1,
    carbsPer100g: 0,
    fatPer100g: 12.4,
  },
  {
    slug: "beef-mince-5pct-raw",
    name: "Beef mince, raw, 5% fat",
    category: "protein",
    caloriesPer100g: 137,
    proteinPer100g: 21.6,
    carbsPer100g: 0,
    fatPer100g: 5.0,
  },
  {
    slug: "beef-mince-20pct-raw",
    name: "Beef mince, raw, 20% fat",
    category: "protein",
    caloriesPer100g: 254,
    proteinPer100g: 17.2,
    carbsPer100g: 0,
    fatPer100g: 20.0,
  },
  {
    slug: "egg-whole-raw",
    name: "Egg, whole, raw",
    category: "protein",
    caloriesPer100g: 143,
    proteinPer100g: 12.6,
    carbsPer100g: 0.7,
    fatPer100g: 9.5,
  },
  {
    slug: "egg-white-raw",
    name: "Egg white, raw",
    category: "protein",
    caloriesPer100g: 52,
    proteinPer100g: 10.9,
    carbsPer100g: 0.7,
    fatPer100g: 0.2,
  },
  {
    slug: "tofu-firm",
    name: "Tofu, firm",
    category: "protein",
    caloriesPer100g: 144,
    proteinPer100g: 15.5,
    carbsPer100g: 3.9,
    fatPer100g: 8.7,
  },
  {
    slug: "turkey-breast-raw",
    name: "Turkey breast, raw",
    category: "protein",
    caloriesPer100g: 104,
    proteinPer100g: 24.0,
    carbsPer100g: 0,
    fatPer100g: 0.7,
  },
  {
    slug: "pork-loin-raw",
    name: "Pork loin, raw",
    category: "protein",
    caloriesPer100g: 143,
    proteinPer100g: 21.0,
    carbsPer100g: 0,
    fatPer100g: 6.0,
  },
  {
    slug: "tuna-canned-water",
    name: "Tuna, canned in water, drained",
    category: "protein",
    caloriesPer100g: 116,
    proteinPer100g: 25.5,
    carbsPer100g: 0,
    fatPer100g: 0.8,
  },
  {
    slug: "shrimp-raw",
    name: "Shrimp, raw",
    category: "protein",
    caloriesPer100g: 85,
    proteinPer100g: 20.3,
    carbsPer100g: 0.2,
    fatPer100g: 0.5,
  },
  {
    slug: "greek-yogurt-plain-nonfat",
    name: "Greek yogurt, plain, nonfat",
    category: "dairy",
    caloriesPer100g: 59,
    proteinPer100g: 10.2,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
  },
  {
    slug: "cottage-cheese-low-fat",
    name: "Cottage cheese, low fat",
    category: "dairy",
    caloriesPer100g: 72,
    proteinPer100g: 12.4,
    carbsPer100g: 2.7,
    fatPer100g: 1.0,
  },
  {
    slug: "white-rice-cooked",
    name: "White rice, cooked",
    category: "grain",
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.2,
    fatPer100g: 0.3,
  },
  {
    slug: "brown-rice-cooked",
    name: "Brown rice, cooked",
    category: "grain",
    caloriesPer100g: 123,
    proteinPer100g: 2.7,
    carbsPer100g: 25.6,
    fatPer100g: 1.0,
    fibrePer100g: 1.6,
  },
  {
    slug: "oats-dry",
    name: "Oats, dry",
    category: "grain",
    caloriesPer100g: 389,
    proteinPer100g: 16.9,
    carbsPer100g: 66.3,
    fatPer100g: 6.9,
    fibrePer100g: 10.6,
  },
  {
    slug: "quinoa-cooked",
    name: "Quinoa, cooked",
    category: "grain",
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 21.3,
    fatPer100g: 1.9,
    fibrePer100g: 2.8,
  },
  {
    slug: "whole-wheat-bread",
    name: "Whole wheat bread",
    category: "grain",
    caloriesPer100g: 247,
    proteinPer100g: 13.0,
    carbsPer100g: 41.0,
    fatPer100g: 3.4,
    fibrePer100g: 6.0,
  },
  {
    slug: "almonds",
    name: "Almonds",
    category: "nuts",
    caloriesPer100g: 579,
    proteinPer100g: 21.2,
    carbsPer100g: 21.6,
    fatPer100g: 49.9,
    fibrePer100g: 12.5,
  },
  {
    slug: "peanut-butter",
    name: "Peanut butter",
    category: "nuts",
    caloriesPer100g: 588,
    proteinPer100g: 25.1,
    carbsPer100g: 20.0,
    fatPer100g: 50.0,
    fibrePer100g: 6.0,
  },

  // --- Pantry staples (for recipes) ---
  {
    slug: "olive-oil",
    name: "Olive oil",
    category: "pantry",
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
  },
  {
    slug: "honey",
    name: "Honey",
    category: "pantry",
    caloriesPer100g: 304,
    proteinPer100g: 0.3,
    carbsPer100g: 82.4,
    fatPer100g: 0,
    sugarPer100g: 82.1,
  },
  {
    slug: "garlic-raw",
    name: "Garlic, raw",
    category: "vegetable",
    caloriesPer100g: 149,
    proteinPer100g: 6.4,
    carbsPer100g: 33.1,
    fatPer100g: 0.5,
    fibrePer100g: 2.1,
  },
  {
    slug: "whole-wheat-tortilla",
    name: "Whole wheat tortilla wrap",
    category: "grain",
    caloriesPer100g: 280,
    proteinPer100g: 9.0,
    carbsPer100g: 46.0,
    fatPer100g: 7.0,
    fibrePer100g: 5.0,
  },
  {
    slug: "hummus",
    name: "Hummus",
    category: "pantry",
    caloriesPer100g: 166,
    proteinPer100g: 7.9,
    carbsPer100g: 14.3,
    fatPer100g: 9.6,
    fibrePer100g: 6.0,
  },
  {
    slug: "feta-cheese",
    name: "Feta cheese",
    category: "dairy",
    caloriesPer100g: 264,
    proteinPer100g: 14.2,
    carbsPer100g: 4.1,
    fatPer100g: 21.3,
  },
  {
    slug: "cheddar-cheese",
    name: "Cheddar cheese",
    category: "dairy",
    caloriesPer100g: 403,
    proteinPer100g: 24.9,
    carbsPer100g: 1.3,
    fatPer100g: 33.1,
  },
  {
    slug: "milk-semi-skimmed",
    name: "Milk, semi-skimmed",
    category: "dairy",
    caloriesPer100g: 46,
    proteinPer100g: 3.4,
    carbsPer100g: 4.8,
    fatPer100g: 1.7,
  },
  {
    slug: "mixed-salad-greens",
    name: "Mixed salad greens",
    category: "vegetable",
    caloriesPer100g: 15,
    proteinPer100g: 1.4,
    carbsPer100g: 2.9,
    fatPer100g: 0.2,
    fibrePer100g: 1.5,
  },
  {
    slug: "lime-raw",
    name: "Lime, raw",
    category: "fruit",
    caloriesPer100g: 30,
    proteinPer100g: 0.7,
    carbsPer100g: 10.5,
    fatPer100g: 0.2,
    fibrePer100g: 2.8,
  },
  {
    slug: "black-beans-cooked",
    name: "Black beans, cooked",
    category: "grain",
    caloriesPer100g: 132,
    proteinPer100g: 8.9,
    carbsPer100g: 23.7,
    fatPer100g: 0.5,
    fibrePer100g: 8.7,
  },
  {
    slug: "corn-tortilla",
    name: "Corn tortilla",
    category: "grain",
    caloriesPer100g: 218,
    proteinPer100g: 5.7,
    carbsPer100g: 44.6,
    fatPer100g: 2.8,
    fibrePer100g: 3.6,
  },
  {
    slug: "salsa",
    name: "Salsa",
    category: "pantry",
    caloriesPer100g: 36,
    proteinPer100g: 1.6,
    carbsPer100g: 7.9,
    fatPer100g: 0.2,
    fibrePer100g: 1.5,
  },
  {
    slug: "soy-sauce",
    name: "Soy sauce",
    category: "pantry",
    caloriesPer100g: 53,
    proteinPer100g: 8.1,
    carbsPer100g: 4.9,
    fatPer100g: 0.1,
  },
  {
    slug: "sesame-oil",
    name: "Sesame oil",
    category: "pantry",
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
  },
  {
    slug: "turkey-breast-cooked",
    name: "Turkey breast, cooked",
    category: "protein",
    caloriesPer100g: 135,
    proteinPer100g: 30.1,
    carbsPer100g: 0,
    fatPer100g: 0.9,
  },
];

async function main() {
  for (const food of FOODS) {
    await db.food.upsert({
      where: { source_sourceId: { source: FoodSource.CUSTOM, sourceId: food.slug } },
      create: {
        source: FoodSource.CUSTOM,
        sourceId: food.slug,
        ownerId: null, // global reference food, not tied to any one user
        name: food.name,
        category: food.category,
        caloriesPer100g: food.caloriesPer100g,
        proteinPer100g: food.proteinPer100g,
        carbsPer100g: food.carbsPer100g,
        fatPer100g: food.fatPer100g,
        fibrePer100g: food.fibrePer100g,
        sugarPer100g: food.sugarPer100g,
      },
      update: {
        name: food.name,
        category: food.category,
        caloriesPer100g: food.caloriesPer100g,
        proteinPer100g: food.proteinPer100g,
        carbsPer100g: food.carbsPer100g,
        fatPer100g: food.fatPer100g,
        fibrePer100g: food.fibrePer100g,
        sugarPer100g: food.sugarPer100g,
      },
    });
  }
  console.log(`Seeded ${FOODS.length} common foods.`);

  // Curated recipes reference Food rows by slug (sourceId) -- build a
  // lookup now that every FOODS entry above is guaranteed to exist.
  const foodBySlug = new Map<string, string>();
  const allFoods = await db.food.findMany({
    where: { source: FoodSource.CUSTOM, sourceId: { in: FOODS.map((f) => f.slug) } },
    select: { id: true, sourceId: true },
  });
  for (const food of allFoods) foodBySlug.set(food.sourceId, food.id);

  let recipesSeeded = 0;
  for (const recipe of CURATED_RECIPES) {
    const existing = await db.recipe.findFirst({ where: { name: recipe.name, source: "CURATED" } });
    if (existing) continue;

    const missingSlugs = recipe.ingredients.map((i) => i.foodSlug).filter((slug) => !foodBySlug.has(slug));
    if (missingSlugs.length > 0) {
      console.warn(`Skipping "${recipe.name}" -- missing Food entries for: ${missingSlugs.join(", ")}`);
      continue;
    }

    await db.recipe.create({
      data: {
        userId: null,
        source: "CURATED",
        isPublished: true,
        name: recipe.name,
        description: recipe.description,
        category: recipe.category,
        servings: recipe.servings,
        prepMinutes: recipe.prepMinutes,
        cookMinutes: recipe.cookMinutes,
        items: {
          create: recipe.ingredients.map((ing) => ({
            foodId: foodBySlug.get(ing.foodSlug)!,
            grams: ing.grams,
            displayLabel: ing.displayLabel,
          })),
        },
        steps: {
          create: recipe.steps.map((step, i) => ({
            order: i + 1,
            content: step.content,
            durationSeconds: step.durationSeconds,
          })),
        },
      },
    });
    recipesSeeded++;
  }
  console.log(
    `Seeded ${recipesSeeded} curated recipes (${CURATED_RECIPES.length - recipesSeeded} already existed).`
  );

  let supplementsSeeded = 0;
  for (const supplement of CURATED_SUPPLEMENTS) {
    const existing = await db.supplement.findFirst({ where: { name: supplement.name } });
    if (existing) continue;

    await db.supplement.create({
      data: {
        name: supplement.name,
        category: supplement.category,
        servingLabel: supplement.servingLabel,
        activeIngredient: supplement.activeIngredient,
        caloriesPerServing: supplement.caloriesPerServing,
        proteinPerServing: supplement.proteinPerServing,
        summary: supplement.summary,
      },
    });
    supplementsSeeded++;
  }
  console.log(
    `Seeded ${supplementsSeeded} supplements (${CURATED_SUPPLEMENTS.length - supplementsSeeded} already existed).`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
