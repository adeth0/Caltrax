import { format, subDays } from "date-fns";
import type { OAuthTokenSet, ScaleReading, SyncResult, WearableProviderAdapter } from "./types";

const AUTH_URL = "https://account.withings.com/oauth2_user/authorize2";
const API_BASE = "https://wbsapi.withings.net";

// Withings' measurement "type" codes for the fields we care about.
const MEAS_TYPE_WEIGHT = 1;
const MEAS_TYPE_FAT_RATIO = 6;

function requireCredentials() {
  const clientId = process.env.WITHINGS_CLIENT_ID;
  const clientSecret = process.env.WITHINGS_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("WITHINGS_CLIENT_ID / WITHINGS_CLIENT_SECRET not configured");
  }
  return { clientId, clientSecret };
}

interface WithingsTokenBody {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope?: string;
  userid?: string | number;
}

interface WithingsTokenResponse {
  status: number;
  body: WithingsTokenBody;
  error?: string;
}

function parseTokenResponse(json: WithingsTokenResponse): OAuthTokenSet {
  if (json.status !== 0) {
    throw new Error(`Withings API error (status ${json.status}): ${json.error ?? "unknown"}`);
  }
  const { body } = json;
  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
    expiresAt: new Date(Date.now() + body.expires_in * 1000),
    scope: body.scope,
    externalUserId: body.userid !== undefined ? String(body.userid) : undefined,
  };
}

interface WithingsMeasure {
  value: number;
  type: number;
  unit: number; // real value = value * 10^unit
}

interface WithingsMeasureGroup {
  date: number; // unix seconds
  measures: WithingsMeasure[];
}

interface WithingsMeasureResponse {
  status: number;
  body?: { measuregrps: WithingsMeasureGroup[] };
  error?: string;
}

function realValue(m: WithingsMeasure): number {
  return m.value * 10 ** m.unit;
}

export const withingsAdapter: WearableProviderAdapter = {
  id: "WITHINGS",
  label: "Withings",
  description: "Syncs your smart scale — weigh-ins log automatically, no manual entry.",

  getAuthorizationUrl(state, redirectUri) {
    const { clientId } = requireCredentials();
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "user.metrics",
      state,
    });
    return `${AUTH_URL}?${params.toString()}`;
  },

  async exchangeCode(code, redirectUri, _codeVerifier) {
    const { clientId, clientSecret } = requireCredentials();
    const res = await fetch(`${API_BASE}/v2/oauth2`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "requesttoken",
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });
    if (!res.ok) throw new Error(`Withings token exchange failed: ${res.status} ${await res.text()}`);
    return parseTokenResponse(await res.json());
  },

  async refresh(refreshToken) {
    const { clientId, clientSecret } = requireCredentials();
    const res = await fetch(`${API_BASE}/v2/oauth2`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "requesttoken",
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    });
    if (!res.ok) throw new Error(`Withings token refresh failed: ${res.status} ${await res.text()}`);
    return parseTokenResponse(await res.json());
  },

  async fetchRecent(accessToken): Promise<SyncResult> {
    const startdate = Math.floor(subDays(new Date(), 3).getTime() / 1000);
    const enddate = Math.floor(Date.now() / 1000);

    const res = await fetch(`${API_BASE}/measure`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        action: "getmeas",
        meastypes: `${MEAS_TYPE_WEIGHT},${MEAS_TYPE_FAT_RATIO}`,
        category: "1", // real measures only, excludes user-declared "objective" entries
        startdate: String(startdate),
        enddate: String(enddate),
      }),
    });
    if (!res.ok) throw new Error(`Withings measure fetch failed: ${res.status} ${await res.text()}`);

    const json = (await res.json()) as WithingsMeasureResponse;
    if (json.status !== 0 || !json.body) {
      throw new Error(`Withings API error (status ${json.status}): ${json.error ?? "unknown"}`);
    }

    const weights: ScaleReading[] = [];
    for (const group of json.body.measuregrps) {
      const weightMeasure = group.measures.find((m) => m.type === MEAS_TYPE_WEIGHT);
      if (!weightMeasure) continue;
      const fatMeasure = group.measures.find((m) => m.type === MEAS_TYPE_FAT_RATIO);
      weights.push({
        date: format(new Date(group.date * 1000), "yyyy-MM-dd"),
        weightKg: realValue(weightMeasure),
        bodyFatPct: fatMeasure ? realValue(fatMeasure) : undefined,
      });
    }

    return { weights };
  },
};
