import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup", "/auth/callback"];

/**
 * Routes that authenticate themselves (a bearer secret, not a Supabase
 * session) and must never hit the session gate below. Without this, an
 * external caller with no session cookie — e.g. a cron scheduler hitting
 * /api/cron/reminders with just an Authorization header — gets redirected
 * to /login before the route handler's own auth check ever runs, silently
 * making the endpoint unreachable. This is exactly what was happening to
 * the reminders cron.
 */
const SELF_AUTHENTICATING_PREFIXES = ["/api/cron"];

export async function proxy(request: NextRequest) {
  if (SELF_AUTHENTICATING_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The landing page is exact-matched rather than folded into
  // PUBLIC_PATHS' startsWith check -- "/" as a startsWith prefix would
  // match literally every route, making the whole session gate a no-op.
  const isPublicPath =
    request.nextUrl.pathname === "/" ||
    PUBLIC_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));
  const isAuthFormPath =
    request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");

  if (!user && !isPublicPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthFormPath) {
    // Already signed in — bounce to the app instead of showing the
    // sign-in/sign-up form again. (app)/layout.tsx picks up from here and
    // sends them on to /onboarding if they don't have a Profile yet.
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on every route except static assets and the PWA manifest/service worker.
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/).*)",
  ],
};
