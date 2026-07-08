import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components. Safe to call repeatedly —
 * createBrowserClient memoizes internally. Never import this from a
 * Server Component; use `lib/supabase/server.ts` there instead.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
