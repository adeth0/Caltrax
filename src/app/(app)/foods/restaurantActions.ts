"use server";

import {
  getRestaurantDetails,
  searchRestaurants,
  type RestaurantDetails,
  type RestaurantSummary,
} from "@/lib/googlePlaces";

export async function searchRestaurantsAction(query: string): Promise<RestaurantSummary[]> {
  try {
    return await searchRestaurants(query);
  } catch (err) {
    console.error("searchRestaurantsAction failed:", err);
    return [];
  }
}

export async function getRestaurantDetailsAction(placeId: string): Promise<RestaurantDetails | null> {
  try {
    return await getRestaurantDetails(placeId);
  } catch (err) {
    console.error("getRestaurantDetailsAction failed:", err);
    return null;
  }
}
