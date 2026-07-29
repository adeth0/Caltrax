import { createHash } from "crypto";
import { format, subDays } from "date-fns";
import type { DailyActivity, OAuthTokenSet, SyncResult, WearableProviderAdapter } from "./types";

/*
 * Confidence note: Whoop's developer API has changed shape across
 * generations, and (unlike Fitbit/Withings/Oura) wider production/
 * user-facing access has historically needed Whoop's own review on top of
 * just registering an OAuth app. This adapter is structured correctly
 * against Whoop's documented v1 developer API as of early 2026 — verify
 * endpoint paths and field names against https://developer.whoop.com/docs
 * when you actually get API access, before relying on it in production.
 */

const AUTH_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const API_BASE = "https://api.prod.whoop.com/developer/v1";

// read:cycles -> daily strain/kilojoules (active-calorie equivalent).
// read:recovery -> resting heart rate. offline -> refresh tokens.
const SCOPES = "read:cycles read:recovery offline";

function requireCredentials() {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const clientSecret = process.env.WHOOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("WHOOP_CLIENT_ID / WHOOP_CLIENT_SECRET not configured");
  }
  return { clientId, clientSecret };
}

/**
 * Whoop requires PKCE. Rather than tracking a separate code_verifier
 * alongside the CSRF state cookie, this adapter derives the PKCE
 * challenge directly from the state value itself — it's already a
 * cryptographically random, single-use, httpOnly-cookie-held string that
 * satisfies PKCE's code_verifier charset/length requirements, so a second
 * secret would add ceremony without adding security.
 */
function codeChallengeFrom(stateAsVerifier: string): string {
  return createHash("sha256").update(stateAsVerifier).digest("base64url");
}

function parseTokenResponse(json: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}): OAuthTokenSet {
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: new Date(Date.now() + json.expires_in * 1000),
  };
}

interface WhoopCycle {
  start: string; // ISO timestamp
  score?: {
    kilojoule?: number;
  };
}

interface WhoopRecovery {
  created_at: string; // ISO timestamp
  score?: {
    resting_heart_rate?: number;
  };
}

interface WhoopPagedResponse<T> {
  records: T[];
}

const KILOJOULES_PER_KCAL = 4.184;

export const whoopAdapter: WearableProviderAdapter = {
  id: "WHOOP",
  label: "Whoop",
  description: "Syncs strain-based calorie burn and resting heart rate, added to your daily calorie budget.",

  getAuthorizationUrl(state, redirectUri) {
    const { clientId } = requireCredentials();
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: SCOPES,
      state,
      code_challenge: codeChallengeFrom(state),
      code_challenge_method: "S256",
    });
    return `${AUTH_URL}?${params.toString()}`;
  },

  async exchangeCode(code, redirectUri, codeVerifier) {
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
        code_verifier: codeVerifier,
      }),
    });
    if (!res.ok) throw new Error(`Whoop token exchange failed: ${res.status} ${await res.text()}`);
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
        scope: SCOPES,
      }),
    });
    if (!res.ok) throw new Error(`Whoop token refresh failed: ${res.status} ${await res.text()}`);
    return parseTokenResponse(await res.json());
  },

  async fetchRecent(accessToken): Promise<SyncResult> {
    const start = subDays(new Date(), 3).toISOString();
    const end = new Date().toISOString();
    const params = new URLSearchParams({ start, end, limit: "10" });

    const [cyclesRes, recoveryRes] = await Promise.all([
      fetch(`${API_BASE}/cycle?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(`${API_BASE}/recovery?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);
    if (!cyclesRes.ok)
      throw new Error(`Whoop cycle fetch failed: ${cyclesRes.status} ${await cyclesRes.text()}`);
    if (!recoveryRes.ok) {
      throw new Error(`Whoop recovery fetch failed: ${recoveryRes.status} ${await recoveryRes.text()}`);
    }

    const cycles = (await cyclesRes.json()) as WhoopPagedResponse<WhoopCycle>;
    const recoveries = (await recoveryRes.json()) as WhoopPagedResponse<WhoopRecovery>;

    // Merge by calendar day — cycle gives calorie burn, recovery gives resting HR for the same day.
    const byDate = new Map<string, DailyActivity>();

    for (const cycle of cycles.records) {
      const date = format(new Date(cycle.start), "yyyy-MM-dd");
      const activeCalories = cycle.score?.kilojoule
        ? Math.round(cycle.score.kilojoule / KILOJOULES_PER_KCAL)
        : undefined;
      byDate.set(date, { ...byDate.get(date), date, activeCalories });
    }

    for (const recovery of recoveries.records) {
      const date = format(new Date(recovery.created_at), "yyyy-MM-dd");
      const existing = byDate.get(date) ?? { date };
      byDate.set(date, { ...existing, restingHeartRate: recovery.score?.resting_heart_rate });
    }

    return { activity: Array.from(byDate.values()) };
  },
};
