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
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

const CALLBACK_ERROR_MESSAGES: Record<string, string> = {
  code_exchange_failed:
    "That confirmation link has expired or was already used. Try signing in, or sign up again.",
  otp_verify_failed:
    "That confirmation link has expired or was already used. Try signing in, or sign up again.",
  missing_code_or_token: "That link looks incomplete. Try opening it again from the original email.",
  unexpected_exception:
    "Something went wrong confirming your email. Please try signing in, or sign up again.",
  auth_callback_failed:
    "Something went wrong confirming your account. Please try signing in, or sign up again.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const callbackError = searchParams.get("error");
  const [serverError, setServerError] = useState<string | null>(
    callbackError
      ? (CALLBACK_ERROR_MESSAGES[callbackError] ?? "Something went wrong. Please try again.")
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
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

  async function signInWithGoogle() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}` },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-text-secondary">Sign in to continue to Caltrax.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
          <div>
            <Input type="email" placeholder="Email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-accent-danger">{errors.email.message}</p>}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && <p className="mt-1 text-xs text-accent-danger">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-sm text-accent-danger">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

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
