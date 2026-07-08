"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Centralised place to wire real error reporting (Sentry, etc.) later.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="w-full max-w-sm text-center">
        <h2 className="font-display text-lg font-semibold text-text-primary">Something went wrong</h2>
        <p className="mt-2 text-sm text-text-secondary">
          The page hit an unexpected error. You can try again, or head back to the dashboard.
        </p>
        <Button className="mt-5 w-full" onClick={reset}>
          Try again
        </Button>
      </GlassCard>
    </div>
  );
}
