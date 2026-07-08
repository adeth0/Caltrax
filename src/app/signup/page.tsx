"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export default function SignupPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupInput) {
    setServerError(null);
    setIsSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=/onboarding` },
    });
    setIsSubmitting(false);

    if (error) {
      setServerError(error.message);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <GlassCard className="w-full max-w-sm text-center">
          <h1 className="font-display text-xl font-semibold text-text-primary">Check your email</h1>
          <p className="mt-2 text-sm text-text-secondary">
            We&apos;ve sent a confirmation link — open it to finish creating your account.
          </p>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Create your account</h1>
        <p className="mt-1 text-sm text-text-secondary">Start tracking with Caltrax.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
          <div>
            <Input type="email" placeholder="Email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-accent-danger">{errors.email.message}</p>}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && <p className="mt-1 text-xs text-accent-danger">{errors.password.message}</p>}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-accent-danger">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-accent-danger">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-accent-info hover:underline">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </main>
  );
}
