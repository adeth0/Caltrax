"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-base p-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src="/icons/icon-192.png" alt="" width={64} height={64} className="rounded-2xl shadow-lg" />
        <span className="font-display text-2xl font-bold text-text-primary">Caltrax</span>
      </div>

      <Card className="w-full max-w-sm">
        <h1 className="font-display text-xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-text-secondary">Sign in to continue tracking.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Email</label>
            <Input type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-accent-danger">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
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

        <Button
          type="button"
          variant="secondary"
          className="flex w-full items-center justify-center gap-2.5"
          onClick={signInWithGoogle}
        >
          <GoogleIcon className="h-4 w-4" />
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-text-secondary">
          New to Caltrax?{" "}
          <Link href="/signup" className="font-medium text-accent-info hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
