import type { WearableProvider } from "@prisma/client";
import { fitbitAdapter } from "./fitbit";
import { withingsAdapter } from "./withings";
import { ouraAdapter } from "./oura";
import { whoopAdapter } from "./whoop";
import type { WearableProviderAdapter } from "./types";

export const PROVIDERS: Record<WearableProvider, WearableProviderAdapter> = {
  FITBIT: fitbitAdapter,
  WITHINGS: withingsAdapter,
  OURA: ouraAdapter,
  WHOOP: whoopAdapter,
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
