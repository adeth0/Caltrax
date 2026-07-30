"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

const PHRASES = [
  "Consistency beats perfection.",
  "Every log brings clarity.",
  "Small steps. Real results.",
  "Fuel today. Achieve tomorrow.",
  "You're already ahead — you showed up.",
];

const PHRASE_DURATION_MS = 2200;

interface WelcomeSplashProps {
  name: string | null;
}

/**
 * A short, skippable cinematic moment shown once, right after onboarding
 * finishes -- not a generic loading screen. Cycles a handful of on-theme
 * phrases with a gauge-sweep ring around the app icon (echoing the actual
 * logo's dial motif), then settles on a personal welcome with the entry
 * point into the app. Reduced-motion preference skips straight to that
 * final state instead of forcing anyone through the sequence.
 */
export function WelcomeSplash({ name }: WelcomeSplashProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [timerDone, setTimerDone] = useState(false);
  const done = prefersReducedMotion === true || timerDone;

  useEffect(() => {
    if (prefersReducedMotion) return; // nothing to animate -- `done` above is already true
    if (phraseIndex >= PHRASES.length - 1) {
      const finishTimer = setTimeout(() => setTimerDone(true), PHRASE_DURATION_MS);
      return () => clearTimeout(finishTimer);
    }
    const timer = setTimeout(() => setPhraseIndex((i) => i + 1), PHRASE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phraseIndex, prefersReducedMotion]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base px-4">
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="touch-target focus-ring absolute right-4 top-4 text-sm text-text-tertiary hover:text-text-secondary"
      >
        Skip
      </button>

      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--border)" strokeWidth="2" />
          {!prefersReducedMotion && (
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: PHRASES.length * (PHRASE_DURATION_MS / 1000), ease: "linear" }}
            />
          )}
        </svg>
        <Image src="/icons/icon-192.png" alt="" width={72} height={72} className="rounded-2xl" priority />
      </div>

      <div className="mt-10 h-16 max-w-md text-center">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-xl font-bold text-text-primary sm:text-2xl"
            >
              {PHRASES[phraseIndex]}
            </motion.p>
          ) : (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-2xl font-black text-text-primary sm:text-3xl">
                Welcome to Caltrax{name ? `, ${name}` : ""}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button size="lg" className="mt-8 min-w-48" onClick={() => router.push("/dashboard")}>
              Enter Caltrax
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
