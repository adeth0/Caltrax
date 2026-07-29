import { createClient } from "@supabase/supabase-js";

/**
 * Secret-key Supabase client for operations the regular session-based
 * client can't perform — currently just deleting an auth user outright
 * (account deletion). SUPABASE_SECRET_KEY (Supabase's current name for
 * what was previously called the service_role key) bypasses Row Level
 * Security entirely, so this must NEVER be imported from a Client
 * Component or exposed to the browser in any way — server-only, and only
 * for the specific admin operations that genuinely need it.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not configured — account deletion needs it to remove the auth user itself."
    );
  }
  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
