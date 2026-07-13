import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts already requires a session to reach this route; this is a
  // defensive fallback plus the actual "already onboarded?" check.
  if (!user) redirect("/login");

  const profile = await db.profile.findUnique({ where: { id: user.id }, select: { id: true } });
  if (profile) redirect("/dashboard");

  return <OnboardingForm />;
}
