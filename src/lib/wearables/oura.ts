import { format, subDays } from "date-fns";
import type { DailyActivity, OAuthTokenSet, SyncResult, WearableProviderAdapter } from "./types";

const AUTH_URL = "https://cloud.ouraring.com/oauth/authorize";
const TOKEN_URL = "https://api.ouraring.com/oauth/token";
const API_BASE = "https://api.ouraring.com/v2/usercollection";

// "daily" covers the daily_activity summary (steps, active calories) this
// adapter reads. Deliberately not requesting "heartrate"/"workout"/"sleep" —
// this app only needs the activity summary, not Oura's full data surface.
const SCOPES = "daily";

function requireCredentials() {
  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("OURA_CLIENT_ID / OURA_CLIENT_SECRET not configured");
  }
  return { clientId, clientSecret };
}

function parseTokenResponse(json: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope?: string;
}): OAuthTokenSet {
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: new Date(Date.now() + json.expires_in * 1000),
    scope: json.scope,
    // Oura's OAuth token response doesn't include a user id — the token
    // itself is already scoped to exactly one ring wearer.
  };
}

interface OuraDailyActivityDoc {
  day: string; // "YYYY-MM-DD"
  steps?: number;
  active_calories?: number;
}

interface OuraDailyActivityResponse {
  data: OuraDailyActivityDoc[];
}

export const ouraAdapter: WearableProviderAdapter = {
  id: "OURA",
  label: "Oura",
  description: "Syncs steps and active calories from your Oura Ring, added to your daily calorie budget.",

  getAuthorizationUrl(state, redirectUri) {
    const { clientId } = requireCredentials();
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
    const { clientId, clientSecret } = requireCredentials();
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!res.ok) throw new Error(`Oura token exchange failed: ${res.status} ${await res.text()}`);
    return parseTokenResponse(await res.json());
  },

  async refresh(refreshToken) {
    const { clientId, clientSecret } = requireCredentials();
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!res.ok) throw new Error(`Oura token refresh failed: ${res.status} ${await res.text()}`);
    return parseTokenResponse(await res.json());
  },

  async fetchRecent(accessToken): Promise<SyncResult> {
    const startDate = format(subDays(new Date(), 3), "yyyy-MM-dd");
    const endDate = format(new Date(), "yyyy-MM-dd");

    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    const res = await fetch(`${API_BASE}/daily_activity?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Oura activity fetch failed: ${res.status} ${await res.text()}`);

    const json = (await res.json()) as OuraDailyActivityResponse;
    const activity: DailyActivity[] = json.data.map((doc) => ({
      date: doc.day,
      steps: doc.steps,
      activeCalories: doc.active_calories,
      // Oura's daily_readiness endpoint has a resting-heart-rate *score*
      // component, not the raw bpm value, so it's left unset here rather
      // than stored as something it isn't.
    }));

    return { activity };
  },
};
