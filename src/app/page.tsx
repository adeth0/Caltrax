import { redirect } from "next/navigation";

export default function RootPage() {
  // TODO(Phase 1 auth): redirect to /login when unauthenticated, and to
  // /onboarding when authenticated but no Profile row exists yet.
  redirect("/dashboard");
}
