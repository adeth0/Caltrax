import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Handles both shapes Supabase's confirmation/magic-link emails can use,
 * depending on project/template configuration:
 *  - PKCE: ?code=... -> exchangeCodeForSession (what OAuth and most modern
 *    flows use)
 *  - OTP: ?token_hash=...&type=... -> verifyOtp (Supabase's default email
 *    template for signup confirmation, on many projects)
 * Previously this only handled the `code` case -- if the actual project
 * template used token_hash+type instead, every single signup confirmation
 * would silently fail to establish a session while still very plausibly
 * looking like it "worked" up to that point (the email really was sent,
 * the code path just never accepted it).
 *
 * The whole handler is wrapped so it can never throw uncaught: an
 * unhandled exception here previously meant a REAL fresh signup could
 * hit Next's root error boundary with no way back except closing the
 * tab -- there is no error.tsx recovery path a person can reasonably
 * find their way out of on their first-ever visit to this app. Every
 * failure mode now redirects to /login with a specific, loggable reason
 * instead.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  function failWith(reason: string, err?: unknown) {
    console.error(`Auth callback failed (${reason}):`, err);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(reason)}`);
  }

  try {
    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    const supabase = await createSupabaseServerClient();

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return failWith("code_exchange_failed", error);
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as EmailOtpType,
      });
      if (error) return failWith("otp_verify_failed", error);
    } else {
      return failWith("missing_code_or_token");
    }

    // Safe to build from a known-good literal path, never from raw
    // request input -- redirectTo only ever comes from links this app
    // itself generated (signup/login), but treating it as trusted input
    // for a redirect target is exactly the kind of assumption that turns
    // into an open-redirect bug later, so it's constrained to same-origin
    // relative paths only.
    const safeRedirectTo = redirectTo.startsWith("/") ? redirectTo : "/dashboard";
    return NextResponse.redirect(`${origin}${safeRedirectTo}`);
  } catch (err) {
    return failWith("unexpected_exception", err);
  }
}
