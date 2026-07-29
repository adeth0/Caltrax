import { format, subDays } from "date-fns";
import type { DailyActivity, OAuthTokenSet, SyncResult, WearableProviderAdapter } from "./types";

const AUTH_URL = "https://www.fitbit.com/oauth2/authorize";
const TOKEN_URL = "https://api.fitbit.com/oauth2/token";
const API_BASE = "https://api.fitbit.com/1/user/-";

// "activity" gets steps + activityCalories; "heartrate" gets resting heart rate.
// Deliberately not requesting "weight" or "nutrition" — Fitbit weight sync is
// Withings' job here, and this app owns nutrition itself.
const SCOPES = "activity heartrate";

function basicAuthHeader(): string {
  const clientId = process.env.FITBIT_CLIENT_ID;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("FITBIT_CLIENT_ID / FITBIT_CLIENT_SECRET not configured");
  }
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

function parseTokenResponse(json: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope?: string;
  user_id?: string;
}): OAuthTokenSet {
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: new Date(Date.now() + json.expires_in * 1000),
    scope: json.scope,
    externalUserId: json.user_id,
  };
}

interface FitbitDaySummary {
  summary?: {
    steps?: number;
    activityCalories?: number;
    restingHeartRate?: number;
  };
}

export const fitbitAdapter: WearableProviderAdapter = {
  id: "FITBIT",
  label: "Fitbit",
  description: "Syncs steps and active calories, added to your daily calorie budget.",

  getAuthorizationUrl(state, redirectUri) {
    const clientId = process.env.FITBIT_CLIENT_ID;
    if (!clientId) throw new Error("FITBIT_CLIENT_ID not configured");
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: SCOPES,
      state,
    });
    return `${AUTH_URL}?${params.toString()}`;
  },

  async exchangeCode(code, redirectUri, _codeVerifier) {
    const clientId = process.env.FITBIT_CLIENT_ID;
    if (!clientId) throw new Error("FITBIT_CLIENT_ID not configured");
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: basicAuthHeader(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
      }),
    });
    if (!res.ok) throw new Error(`Fitbit token exchange failed: ${res.status} ${await res.text()}`);
    return parseTokenResponse(await res.json());
  },

  async refresh(refreshToken) {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: basicAuthHeader(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
    if (!res.ok) throw new Error(`Fitbit token refresh failed: ${res.status} ${await res.text()}`);
    return parseTokenResponse(await res.json());
  },

  async fetchRecent(accessToken): Promise<SyncResult> {
    // Backfill 3 days — covers the case where the cron missed a day or the
    // user's Fitbit hadn't finished syncing to Fitbit's own cloud yet.
    const days = [0, 1, 2].map((offset) => format(subDays(new Date(), offset), "yyyy-MM-dd"));

    const activity: DailyActivity[] = [];
    for (const date of days) {
      const res = await fetch(`${API_BASE}/activities/date/${date}.json`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        // A single day failing (e.g. no data yet for today) shouldn't abort the whole sync.
        continue;
      }
      const json = (await res.json()) as FitbitDaySummary;
      if (!json.summary) continue;
      activity.push({
        date,
        steps: json.summary.steps,
        activeCalories: json.summary.activityCalories,
        restingHeartRate: json.summary.restingHeartRate,
      });
    }

    return { activity };
  },
};
