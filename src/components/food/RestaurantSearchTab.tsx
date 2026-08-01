"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  ChevronLeft,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Search,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getRestaurantDetailsAction, searchRestaurantsAction } from "@/app/(app)/foods/restaurantActions";
import type { RestaurantDetails, RestaurantSummary } from "@/lib/googlePlaces";

const PRICE_LEVEL_LABEL: Record<number, string> = {
  0: "Free",
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};

function RestaurantThumbnail({ photoUrl }: { photoUrl: string | null }) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt=""
        width={64}
        height={64}
        unoptimized
        className="h-16 w-16 shrink-0 rounded-2xl object-cover"
      />
    );
  }
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-raised text-text-tertiary">
      <UtensilsCrossed className="h-7 w-7" />
    </div>
  );
}

function RestaurantDetailView({ details, onBack }: { details: RestaurantDetails; onBack: () => void }) {
  const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${details.placeId}`;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="control focus-ring touch-target mb-3 flex items-center gap-1 rounded-full bg-surface-raised py-2.5 pl-2.5 pr-4 text-sm font-medium text-text-secondary hover:bg-border-strong hover:text-text-primary"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to results
      </button>

      <Card>
        <div className="flex items-start gap-4">
          <RestaurantThumbnail photoUrl={details.photoUrl} />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-bold text-text-primary">{details.name}</h2>
            {details.rating !== null && (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-text-secondary">
                <Star className="h-3.5 w-3.5 fill-accent-warning text-accent-warning" />
                {details.rating.toFixed(1)}
                {details.ratingCount !== null && (
                  <span className="text-text-tertiary">({details.ratingCount})</span>
                )}
                {details.priceLevel !== null && (
                  <span className="text-text-tertiary"> · {PRICE_LEVEL_LABEL[details.priceLevel]}</span>
                )}
              </p>
            )}
            {details.openNow !== null && (
              <p
                className={`mt-1 text-xs font-medium ${details.openNow ? "text-accent-success" : "text-accent-danger"}`}
              >
                {details.openNow ? "Open now" : "Closed now"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-accent-info hover:underline"
            >
              {details.address}
            </a>
          </div>

          {details.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-text-tertiary" />
              <a
                href={`tel:${details.phoneNumber}`}
                className="text-sm text-text-secondary hover:text-accent-info hover:underline"
              >
                {details.phoneNumber}
              </a>
            </div>
          )}

          {details.website && (
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 shrink-0 text-text-tertiary" />
              <a
                href={details.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 truncate text-sm text-text-secondary hover:text-accent-info hover:underline"
              >
                <span className="truncate">Visit website (view their menu)</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            </div>
          )}

          {details.weekdayHours && details.weekdayHours.length > 0 && (
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" />
              <div className="text-sm text-text-secondary">
                {details.weekdayHours.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button asChild variant="secondary" className="mt-4 w-full">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </Button>
      </Card>
    </div>
  );
}

/**
 * Restaurant search via Google Places -- address, phone, website and
 * hours come from Google's own data, which is reliable and structured.
 * Deliberately does NOT attempt to scrape or extract a restaurant's
 * actual menu from their website -- that varies too wildly (PDFs,
 * images, no consistent structure at all) to do reliably. Instead, the
 * website link is front and centre with an explicit "view their menu"
 * hint, so people can just open it themselves.
 */
export function RestaurantSearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RestaurantSummary[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, startSearching] = useTransition();
  const [selectedDetails, setSelectedDetails] = useState<RestaurantDetails | null>(null);
  const [isLoadingDetails, startLoadingDetails] = useTransition();

  function handleSearch() {
    if (!query.trim()) return;
    setError(null);
    startSearching(async () => {
      const found = await searchRestaurantsAction(query);
      setResults(found);
      setHasSearched(true);
      if (found.length === 0) {
        setError("No restaurants found for that search — try a city or postcode.");
      }
    });
  }

  function handleSelect(restaurant: RestaurantSummary) {
    startLoadingDetails(async () => {
      const details = await getRestaurantDetailsAction(restaurant.placeId);
      if (details) {
        setSelectedDetails(details);
      } else {
        setError("Couldn't load details for that restaurant — try again.");
      }
    });
  }

  if (selectedDetails) {
    return <RestaurantDetailView details={selectedDetails} onBack={() => setSelectedDetails(null)} />;
  }

  return (
    <div>
      <Card>
        <p className="mb-2 text-sm font-medium text-text-primary">Find restaurants</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. Manchester, or a postcode"
              className="pl-9"
            />
          </div>
          <Button type="button" onClick={handleSearch} disabled={isSearching || !query.trim()}>
            {isSearching ? "Searching…" : "Search"}
          </Button>
        </div>
        {error && <p className="mt-2 text-xs text-accent-danger">{error}</p>}
      </Card>

      {isLoadingDetails && <p className="mt-4 text-sm text-text-tertiary">Loading details…</p>}

      {!isLoadingDetails && hasSearched && results.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {results.map((restaurant) => (
            <button
              key={restaurant.placeId}
              type="button"
              onClick={() => handleSelect(restaurant)}
              className="control focus-ring flex w-full items-center gap-3 rounded-control bg-surface-raised p-3 text-left transition-colors hover:bg-border-strong"
            >
              <RestaurantThumbnail photoUrl={restaurant.photoUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-text-primary">{restaurant.name}</p>
                <p className="truncate text-sm text-text-tertiary">{restaurant.address}</p>
                {restaurant.rating !== null && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
                    <Star className="h-3 w-3 fill-accent-warning text-accent-warning" />
                    {restaurant.rating.toFixed(1)}
                    {restaurant.priceLevel !== null && (
                      <span className="text-text-tertiary">
                        {" "}
                        · {PRICE_LEVEL_LABEL[restaurant.priceLevel]}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {!hasSearched && !isSearching && (
        <p className="mt-6 text-center text-sm text-text-tertiary">
          Search a city, area, or postcode to find restaurants nearby.
        </p>
      )}
    </div>
  );
}
