import type { FoodItem } from "@/types";

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
  sodium_100g?: number; // grams, needs *1000 for mg
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
    sodiumMgPer100g: n.sodium_100g !== undefined ? n.sodium_100g * 1000 : undefined,
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
