import { redirect } from "next/navigation";
import { AppShell } from "@/components/nav/AppShell";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts already redirects signed-out users to /login before we get
  // here, but keep this as a defensive fallback.
  if (!user) redirect("/login");

  const profile = await db.profile.findUnique({ where: { id: user.id }, select: { id: true } });
  if (!profile) redirect("/onboarding");

  return <AppShell>{children}</AppShell>;
}
