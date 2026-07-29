"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const accountDeleted = searchParams.get("accountDeleted") === "1";
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
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=/onboarding` },
    });
    setIsSubmitting(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    // Supabase deliberately returns a success-looking response even when
    // the email is already registered (to avoid leaking which emails
    // exist) -- the documented way to tell the difference is an empty
    // identities array on the returned user. Without this check, someone
    // with an existing account gets told to "check your email" for a
    // confirmation link that's never coming, with no way back in.
    if (data.user && data.user.identities?.length === 0) {
      setServerError("An account already exists for this email. Try signing in instead.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center">
          <h1 className="font-display text-xl font-bold text-text-primary">Check your email</h1>
          <p className="mt-2 text-sm text-text-secondary">
            We&apos;ve sent a confirmation link — open it to finish creating your account.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        {accountDeleted && (
          <p className="border-accent-success/30 bg-accent-success/10 mb-4 rounded-control border p-3 text-sm text-accent-success">
            Your account and all its data have been permanently deleted.
          </p>
        )}
        <h1 className="font-display text-2xl font-bold text-text-primary">Create your account</h1>
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
      </Card>
    </main>
  );
}
