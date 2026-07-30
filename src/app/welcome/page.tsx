import { redirect } from "next/navigation";
import { db, withPreparedStatementRetry } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WelcomeSplash } from "./WelcomeSplash";

/**
 * Shown once, right after onboarding finishes -- a short, skippable
 * cinematic moment before landing on the actual dashboard. Requires a
 * real session and a completed profile (same gate as the dashboard
 * itself) rather than being reachable standalone, since it's not a
 * generic marketing screen -- it's part of the account-creation flow.
 */
export default async function WelcomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await withPreparedStatementRetry(() =>
    db.profile.findUnique({ where: { id: user.id }, select: { name: true } })
  );
  if (!profile) redirect("/onboarding");

  return <WelcomeSplash name={profile.name} />;
}
