"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { loginSchema, magicLinkSchema, type LoginInput, type MagicLinkInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const passwordForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const magicLinkForm = useForm<MagicLinkInput>({ resolver: zodResolver(magicLinkSchema) });

  async function onPasswordSubmit(values: LoginInput) {
    setServerError(null);
    setIsSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    setIsSubmitting(false);

    if (error) {
      setServerError(error.message);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  async function onMagicLinkSubmit(values: MagicLinkInput) {
    setServerError(null);
    setIsSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
        // Only sign in existing users via magic link -- new accounts go
        // through /signup, which sets up onboarding expectations properly.
        shouldCreateUser: false,
      },
    });
    setIsSubmitting(false);

    if (error) {
      setServerError(
        error.message.toLowerCase().includes("signups not allowed")
          ? "No account found for that email. Create one instead?"
          : error.message
      );
      return;
    }
    setMagicLinkSent(true);
  }

  async function signInWithGoogle() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}` },
    });
  }

  if (magicLinkSent) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center">
          <h1 className="font-display text-xl font-bold text-text-primary">Check your email</h1>
          <p className="mt-2 text-sm text-text-secondary">
            We&apos;ve sent a sign-in link to {magicLinkForm.getValues("email")} -- open it on this device to
            continue.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-text-secondary">Sign in to continue to Caltrax.</p>

        {mode === "password" ? (
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="mt-6 flex flex-col gap-4"
            noValidate
          >
            <div>
              <Input
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...passwordForm.register("email")}
              />
              {passwordForm.formState.errors.email && (
                <p className="mt-1 text-xs text-accent-danger">
                  {passwordForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                {...passwordForm.register("password")}
              />
              {passwordForm.formState.errors.password && (
                <p className="mt-1 text-xs text-accent-danger">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {serverError && <p className="text-sm text-accent-danger">{serverError}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setServerError(null);
                setMode("magic-link");
              }}
              className="touch-target focus-ring text-center text-sm text-accent-info hover:underline"
            >
              Email me a sign-in link instead
            </button>
          </form>
        ) : (
          <form
            onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)}
            className="mt-6 flex flex-col gap-4"
            noValidate
          >
            <div>
              <Input
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...magicLinkForm.register("email")}
              />
              {magicLinkForm.formState.errors.email && (
                <p className="mt-1 text-xs text-accent-danger">
                  {magicLinkForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {serverError && <p className="text-sm text-accent-danger">{serverError}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending…" : "Send sign-in link"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setServerError(null);
                setMode("password");
              }}
              className="touch-target focus-ring text-center text-sm text-accent-info hover:underline"
            >
              Use your password instead
            </button>
          </form>
        )}

        <div className="my-5 flex items-center gap-3 text-xs text-text-tertiary">
          <span className="h-px flex-1 bg-surface-raised" />
          or
          <span className="h-px flex-1 bg-surface-raised" />
        </div>

        <Button type="button" variant="secondary" className="w-full" onClick={signInWithGoogle}>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-text-secondary">
          New to Caltrax?{" "}
          <Link href="/signup" className="text-accent-info hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
