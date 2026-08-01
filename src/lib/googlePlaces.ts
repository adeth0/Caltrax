export interface RestaurantSummary {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  ratingCount: number | null;
  priceLevel: number | null;
  photoUrl: string | null;
  lat: number;
  lng: number;
}

export interface RestaurantDetails extends RestaurantSummary {
  phoneNumber: string | null;
  website: string | null;
  openNow: boolean | null;
  weekdayHours: string[] | null;
}

interface PlacesTextSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  photos?: { photo_reference: string }[];
  geometry?: { location?: { lat: number; lng: number } };
}

interface PlacesDetailsResult {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  photos?: { photo_reference: string }[];
  geometry?: { location?: { lat: number; lng: number } };
  opening_hours?: { open_now?: boolean; weekday_text?: string[] };
}

function requireApiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("Restaurant search isn't configured yet — missing GOOGLE_MAPS_API_KEY.");
  return key;
}

function photoUrlFor(photoReference: string | undefined, apiKey: string): string | null {
  if (!photoReference) return null;
  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("photo_reference", photoReference);
  url.searchParams.set("maxwidth", "400");
  url.searchParams.set("key", apiKey);
  return url.toString();
}

function toSummary(result: PlacesTextSearchResult | PlacesDetailsResult, apiKey: string): RestaurantSummary {
  return {
    placeId: result.place_id,
    name: result.name,
    address: result.formatted_address,
    rating: result.rating ?? null,
    ratingCount: result.user_ratings_total ?? null,
    priceLevel: result.price_level ?? null,
    photoUrl: photoUrlFor(result.photos?.[0]?.photo_reference, apiKey),
    lat: result.geometry?.location?.lat ?? 0,
    lng: result.geometry?.location?.lng ?? 0,
  };
}

/** Free-text restaurant search, e.g. "restaurants in Manchester" or "pizza near me". */
export async function searchRestaurants(query: string): Promise<RestaurantSummary[]> {
  const apiKey = requireApiKey();
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", `restaurants ${trimmed}`);
  url.searchParams.set("type", "restaurant");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url, { next: { revalidate: 60 * 15 } });
  if (!res.ok) return [];

  const data = (await res.json()) as { status: string; results?: PlacesTextSearchResult[] };
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Restaurant search failed (${data.status}).`);
  }

  return (data.results ?? []).map((r) => toSummary(r, apiKey));
}

/** Full details for one restaurant -- phone, website, hours -- for the detail view when a result is tapped. */
export async function getRestaurantDetails(placeId: string): Promise<RestaurantDetails | null> {
  const apiKey = requireApiKey();

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set(
    "fields",
    "place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,price_level,photos,geometry,opening_hours"
  );
  url.searchParams.set("key", apiKey);

  const res = await fetch(url, { next: { revalidate: 60 * 15 } });
  if (!res.ok) return null;

  const data = (await res.json()) as { status: string; result?: PlacesDetailsResult };
  if (data.status !== "OK" || !data.result) return null;

  const result = data.result;
  return {
    ...toSummary(result, apiKey),
    phoneNumber: result.formatted_phone_number ?? null,
    website: result.website ?? null,
    openNow: result.opening_hours?.open_now ?? null,
    weekdayHours: result.opening_hours?.weekday_text ?? null,
  };
}
