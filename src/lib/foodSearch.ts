import { db } from "@/lib/db";
import { FOOD_SOURCE_TO_PRISMA } from "@/lib/enumMap";
import type { FoodItem } from "@/types";

/**
 * Caches a search-result FoodItem into the `Food` table (or refreshes the
 * cached macros if it's already there). Shared by meal logging, favouriting,
 * and recipe-building — anywhere a FoodItem needs a real `Food.id` to
 * attach a foreign key to.
 */
export async function upsertFoodItem(food: FoodItem) {
  const source = FOOD_SOURCE_TO_PRISMA[food.source];
  return db.food.upsert({
    where: { source_sourceId: { source, sourceId: food.sourceId } },
    create: {
      source,
      sourceId: food.sourceId,
      name: food.name,
      brand: food.brand,
      barcode: food.barcode,
      servingSizeG: food.servingSizeG,
      servingSizeLabel: food.servingSizeLabel,
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
      fibrePer100g: food.fibrePer100g,
      sugarPer100g: food.sugarPer100g,
      saturatedFatPer100g: food.saturatedFatPer100g,
      sodiumMgPer100g: food.sodiumMgPer100g,
      potassiumMgPer100g: food.potassiumMgPer100g,
      vitaminAPer100g: food.vitaminAPer100g,
      vitaminCPer100g: food.vitaminCPer100g,
      vitaminDPer100g: food.vitaminDPer100g,
      vitaminEPer100g: food.vitaminEPer100g,
      vitaminKPer100g: food.vitaminKPer100g,
      calciumMgPer100g: food.calciumMgPer100g,
      ironMgPer100g: food.ironMgPer100g,
      magnesiumMgPer100g: food.magnesiumMgPer100g,
      zincMgPer100g: food.zincMgPer100g,
      imageUrl: food.imageUrl,
    },
    update: {
      name: food.name,
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
      fibrePer100g: food.fibrePer100g,
      sugarPer100g: food.sugarPer100g,
      saturatedFatPer100g: food.saturatedFatPer100g,
      sodiumMgPer100g: food.sodiumMgPer100g,
      potassiumMgPer100g: food.potassiumMgPer100g,
      vitaminAPer100g: food.vitaminAPer100g,
      vitaminCPer100g: food.vitaminCPer100g,
      vitaminDPer100g: food.vitaminDPer100g,
      vitaminEPer100g: food.vitaminEPer100g,
      vitaminKPer100g: food.vitaminKPer100g,
      calciumMgPer100g: food.calciumMgPer100g,
      ironMgPer100g: food.ironMgPer100g,
      magnesiumMgPer100g: food.magnesiumMgPer100g,
      zincMgPer100g: food.zincMgPer100g,
    },
  });
}

// Open Food Facts is free and keyless. Docs: https://world.openfoodfacts.org/data
// We ask for exactly the fields we use to keep responses small and fast on mobile.
const SEARCH_FIELDS = [
  "code",
  "product_name",
  "brands",
  "categories",
  "image_front_small_url",
  "serving_size",
  "serving_quantity",
  "nutriments",
].join(",");

interface OFFNutriments {
  ["energy-kcal_100g"]?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
  fiber_100g?: number;
  sugars_100g?: number;
  ["saturated-fat_100g"]?: number;
  // Everything below: Open Food Facts' default processed nutriment fields
  // are stored in GRAMS regardless of the nutrient (per OFF's own docs —
  // "the value converted in the default unit ... otherwise gram"). That's
  // an easy silent-corruption bug (a vitamin A value of "0.0000009" reads
  // as basically zero if you forget the conversion), so every one of these
  // gets scaled to its conventional display unit in normalizeProduct below.
  sodium_100g?: number; // g -> mg (*1000)
  potassium_100g?: number; // g -> mg (*1000)
  calcium_100g?: number; // g -> mg (*1000)
  iron_100g?: number; // g -> mg (*1000)
  magnesium_100g?: number; // g -> mg (*1000)
  zinc_100g?: number; // g -> mg (*1000)
  ["vitamin-a_100g"]?: number; // g -> mcg (*1,000,000)
  ["vitamin-c_100g"]?: number; // g -> mg (*1000)
  ["vitamin-d_100g"]?: number; // g -> mcg (*1,000,000)
  ["vitamin-e_100g"]?: number; // g -> mg (*1000)
  ["vitamin-k_100g"]?: number; // g -> mcg (*1,000,000)
}

interface OFFProduct {
  code: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  image_front_small_url?: string;
  serving_size?: string;
  serving_quantity?: number;
  nutriments?: OFFNutriments;
}

/** g -> mg. Returns undefined if the source value is missing, never NaN/0-by-default. */
function gToMg(value: number | undefined): number | undefined {
  return value !== undefined ? value * 1000 : undefined;
}

/** g -> mcg (micrograms) — for vitamin A/D/K, which are conventionally dosed in mcg not mg. */
function gToMcg(value: number | undefined): number | undefined {
  return value !== undefined ? value * 1_000_000 : undefined;
}

function normalizeProduct(product: OFFProduct): FoodItem | null {
  const name = product.product_name?.trim();
  const n = product.nutriments;
  // Skip products missing a name or core calorie data — not useful search results.
  if (!name || !n || n["energy-kcal_100g"] === undefined) return null;

  return {
    id: `off-${product.code}`,
    source: "open_food_facts",
    sourceId: product.code,
    name,
    brand: product.brands?.split(",")[0]?.trim(),
    barcode: product.code,
    servingSizeG: product.serving_quantity,
    servingSizeLabel: product.serving_size,
    caloriesPer100g: n["energy-kcal_100g"] ?? 0,
    proteinPer100g: n.proteins_100g ?? 0,
    carbsPer100g: n.carbohydrates_100g ?? 0,
    fatPer100g: n.fat_100g ?? 0,
    fibrePer100g: n.fiber_100g,
    sugarPer100g: n.sugars_100g,
    saturatedFatPer100g: n["saturated-fat_100g"],
    sodiumMgPer100g: gToMg(n.sodium_100g),
    potassiumMgPer100g: gToMg(n.potassium_100g),
    vitaminAPer100g: gToMcg(n["vitamin-a_100g"]),
    vitaminCPer100g: gToMg(n["vitamin-c_100g"]),
    vitaminDPer100g: gToMcg(n["vitamin-d_100g"]),
    vitaminEPer100g: gToMg(n["vitamin-e_100g"]),
    vitaminKPer100g: gToMcg(n["vitamin-k_100g"]),
    calciumMgPer100g: gToMg(n.calcium_100g),
    ironMgPer100g: gToMg(n.iron_100g),
    magnesiumMgPer100g: gToMg(n.magnesium_100g),
    zincMgPer100g: gToMg(n.zinc_100g),
    imageUrl: product.image_front_small_url,
  };
}

/** Free-text food search via Open Food Facts. Returns normalized, ready-to-log results. */
export async function searchOpenFoodFacts(query: string, pageSize = 20): Promise<FoodItem[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
  url.searchParams.set("search_terms", trimmed);
  url.searchParams.set("search_simple", "1");
  url.searchParams.set("action", "process");
  url.searchParams.set("json", "1");
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("fields", SEARCH_FIELDS);
  // Prefer reasonably complete entries first.
  url.searchParams.set("sort_by", "unique_scans_n");

  const res = await fetch(url, {
    headers: { "User-Agent": "Caltrax/0.3 (caltrax.kavauralabs.com)" },
    next: { revalidate: 60 * 60 }, // OFF data barely changes; cache an hour to keep search snappy.
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { products?: OFFProduct[] };
  const products = data.products ?? [];

  return products
    .map(normalizeProduct)
    .filter((item): item is FoodItem => item !== null)
    .slice(0, pageSize);
}

/** Barcode/UPC lookup for the future camera-scan flow (Phase 2), usable today via manual entry. */
export async function lookupBarcode(barcode: string): Promise<FoodItem | null> {
  const trimmed = barcode.trim();
  if (!trimmed) return null;

  const url = new URL(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(trimmed)}.json`);
  url.searchParams.set("fields", SEARCH_FIELDS);

  const res = await fetch(url, {
    headers: { "User-Agent": "Caltrax/0.3 (caltrax.kavauralabs.com)" },
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { status: number; product?: OFFProduct };
  if (data.status !== 1 || !data.product) return null;

  return normalizeProduct(data.product);
}
