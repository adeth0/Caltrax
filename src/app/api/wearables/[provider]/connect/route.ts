import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getProviderAdapter, isValidProvider } from "@/lib/wearables";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const STATE_COOKIE_MAX_AGE_SECONDS = 600; // 10 minutes — plenty for a consent-screen round trip

export async function GET(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const { origin } = new URL(request.url);

  if (!isValidProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }

  // proxy.ts already requires a session for this path, but a direct check
  // here keeps this route correct even if that gate ever changes.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const adapter = getProviderAdapter(provider);
  const state = randomBytes(24).toString("base64url");
  const redirectUri = `${origin}/api/wearables/${provider}/callback`;
  const authUrl = adapter.getAuthorizationUrl(state, redirectUri);

  const response = NextResponse.redirect(authUrl);
  // Validated on the way back in the callback route, to prevent CSRF —
  // without this, an attacker could trick a signed-in user into linking
  // the attacker's own wearable account to the victim's Caltrax profile.
  response.cookies.set(`wearable_oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: STATE_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
  return response;
}
