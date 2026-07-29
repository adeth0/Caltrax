import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getProviderAdapter, isValidProvider } from "@/lib/wearables";
import { syncWearableConnection } from "@/lib/wearables/sync";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const { origin, searchParams } = new URL(request.url);

  if (!isValidProvider(provider)) {
    return NextResponse.redirect(`${origin}/settings?wearable_error=unknown_provider`);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const cookieName = `wearable_oauth_state_${provider}`;
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(cookieName)?.value;
  const returnedState = searchParams.get("state");

  const clearStateCookie = (response: NextResponse) => {
    response.cookies.set(cookieName, "", { maxAge: 0, path: "/" });
    return response;
  };

  if (!expectedState || !returnedState || expectedState !== returnedState) {
    return clearStateCookie(
      NextResponse.redirect(`${origin}/settings?wearable_error=state_mismatch&provider=${provider}`)
    );
  }

  const providerError = searchParams.get("error");
  if (providerError) {
    // The user declined consent on the provider's screen — not a bug, just log and bounce back.
    return clearStateCookie(
      NextResponse.redirect(`${origin}/settings?wearable_error=denied&provider=${provider}`)
    );
  }

  const code = searchParams.get("code");
  if (!code) {
    return clearStateCookie(
      NextResponse.redirect(`${origin}/settings?wearable_error=missing_code&provider=${provider}`)
    );
  }

  try {
    const adapter = getProviderAdapter(provider);
    const redirectUri = `${origin}/api/wearables/${provider}/callback`;
    const tokens = await adapter.exchangeCode(code, redirectUri);

    const connection = await db.wearableConnection.upsert({
      where: { userId_provider: { userId: user.id, provider } },
      create: {
        userId: user.id,
        provider,
        externalUserId: tokens.externalUserId,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        scope: tokens.scope,
      },
      update: {
        externalUserId: tokens.externalUserId,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        scope: tokens.scope,
        lastSyncError: null,
      },
    });

    // Sync immediately so the connection shows real data on the very next
    // page load, rather than the user waiting for the next cron tick.
    await syncWearableConnection(connection);

    return clearStateCookie(NextResponse.redirect(`${origin}/settings?wearable_connected=${provider}`));
  } catch (err) {
    console.error(`Wearable connect failed for ${provider}:`, err);
    return clearStateCookie(
      NextResponse.redirect(`${origin}/settings?wearable_error=connect_failed&provider=${provider}`)
    );
  }
}
