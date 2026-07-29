import { redirect } from "next/navigation";
import { LandingHero } from "@/components/landing/LandingHero";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RootPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Signed in: send them straight to their data if they have a profile,
  // or finish setup if they don't (e.g. mid-onboarding, or a pre-existing
  // session from before onboarding ever successfully saved).
  if (user) {
    const profile = await db.profile.findUnique({ where: { id: user.id }, select: { id: true } });
    redirect(profile ? "/dashboard" : "/onboarding");
  }

  // Signed-out visitors get the actual landing page rather than an
  // instant redirect to /signup — proxy.ts exact-matches "/" as public so
  // this is reachable without a session.
  return <LandingHero />;
}
