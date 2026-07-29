import type { WearableProvider } from "@prisma/client";
import { fitbitAdapter } from "./fitbit";
import { withingsAdapter } from "./withings";
import type { WearableProviderAdapter } from "./types";

export const PROVIDERS: Record<WearableProvider, WearableProviderAdapter> = {
  FITBIT: fitbitAdapter,
  WITHINGS: withingsAdapter,
};

export function getProviderAdapter(id: WearableProvider): WearableProviderAdapter {
  return PROVIDERS[id];
}

export function isValidProvider(value: string): value is WearableProvider {
  return value in PROVIDERS;
}

export type {
  DailyActivity,
  OAuthTokenSet,
  ScaleReading,
  SyncResult,
  WearableProviderAdapter,
} from "./types";
