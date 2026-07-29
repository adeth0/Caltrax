import type { WearableProvider } from "@prisma/client";

export interface OAuthTokenSet {
  accessToken: string;
  refreshToken: string;
  /** Absolute expiry, computed from the provider's expires_in at exchange/refresh time. */
  expiresAt: Date;
  scope?: string;
  /** The provider's own user id, when it exposes one (Fitbit does; Withings scopes tokens to one user already). */
  externalUserId?: string;
}

/** One day of activity pulled from a fitness tracker. */
export interface DailyActivity {
  date: string; // "YYYY-MM-DD"
  steps?: number;
  activeCalories?: number;
  restingHeartRate?: number;
}

/** A single weigh-in pulled from a smart scale. */
export interface ScaleReading {
  date: string; // "YYYY-MM-DD"
  weightKg: number;
  bodyFatPct?: number;
}

export interface SyncResult {
  activity?: DailyActivity[];
  weights?: ScaleReading[];
}

/**
 * Every provider (Fitbit, Withings, and later Garmin/Oura/Whoop) implements
 * this same shape. Adding a new provider means: add it to the
 * WearableProvider enum, write one of these, and register it in
 * PROVIDERS below — nothing else in the app needs to change.
 */
export interface WearableProviderAdapter {
  id: WearableProvider;
  /** Human-readable name for the Settings UI. */
  label: string;
  /** What this provider syncs, shown in the Settings UI. */
  description: string;
  getAuthorizationUrl(state: string, redirectUri: string): string;
  exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenSet>;
  refresh(refreshToken: string): Promise<OAuthTokenSet>;
  /** Pull the last few days (today plus a short backfill window in case of sync gaps). */
  fetchRecent(accessToken: string): Promise<SyncResult>;
}
