import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RootPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // New/signed-out visitors land on the domain root expecting to create an
  // account, not a "welcome back" sign-in form — send them to /signup
  // (which itself links back to /login for returning users, and proxy.ts
  // would send them there anyway if they tried a protected route directly).
  if (!user) redirect("/signup");

  // Signed in: send them straight to their data if they have a profile,
  // or finish setup if they don't (e.g. mid-onboarding, or a pre-existing
  // session from before onboarding ever successfully saved).
  const profile = await db.profile.findUnique({ where: { id: user.id }, select: { id: true } });
  redirect(profile ? "/dashboard" : "/onboarding");
}
