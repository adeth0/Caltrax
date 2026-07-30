"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, ScanLine, Sparkles, Watch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingWordmark } from "./LandingWordmark";
import { LandingStickyNav } from "./LandingStickyNav";
import { LandingFeatureSection } from "./LandingFeatureSection";
import { BarcodeVisual, InsightVisual, MealScanVisual, WearableVisual } from "./LandingVisuals";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

/**
 * A proper scroll-driven product page -- each feature gets its own full
 * "moment" revealed as you scroll to it (LandingFeatureSection), rather
 * than a static grid dumped below the fold all at once. Smooth scrolling
 * is already global (globals.css), so the only piece needed here is the
 * per-section reveal timing and the sticky nav that appears once the
 * hero has scrolled away.
 */
export function LandingHero() {
  return (
    <>
      <LandingStickyNav />

      <main>
        {/* Hero -- full viewport, the one place the logo sweep-reveal happens */}
        <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
          <LandingWordmark />

          <motion.p
            {...fadeUp(0.15)}
            className="mt-5 max-w-xl text-balance text-lg text-text-secondary sm:text-xl"
          >
            Nutrition and fitness tracking done properly — accurate logging, meaningful insight, and a design
            that stays out of your way.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-w-40">
              <Link href="/signup">Get started</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="min-w-40">
              <Link href="/login">Sign in</Link>
            </Button>
          </motion.div>
        </section>

        {/* Each feature gets its own scroll "moment" instead of a static grid */}
        <LandingFeatureSection
          icon={Camera}
          eyebrow="Meal scan"
          title="Snap a plate, get the numbers"
          description="Photograph a meal and Caltrax identifies each item, estimating calories and macros — reviewable and editable before anything gets logged."
          iconBgClass="bg-macro-carbs/15"
          iconColorClass="text-macro-carbs"
          visual={<MealScanVisual />}
        />

        <LandingFeatureSection
          icon={ScanLine}
          eyebrow="Barcode scanner"
          title="Packaged food, logged in seconds"
          description="Point your camera at a barcode and Caltrax pulls accurate nutrition data instantly — no typing, no searching."
          iconBgClass="bg-brand/15"
          iconColorClass="text-brand"
          reversed
          visual={<BarcodeVisual />}
        />

        <LandingFeatureSection
          icon={Watch}
          eyebrow="Wearable sync"
          title="Your activity, automatically"
          description="Connect Fitbit, Withings, Oura, or Whoop — steps and active calories flow straight into your daily budget, and smart-scale weigh-ins log themselves."
          iconBgClass="bg-macro-fat/15"
          iconColorClass="text-macro-fat"
          visual={<WearableVisual />}
        />

        <LandingFeatureSection
          icon={Sparkles}
          eyebrow="Real insight"
          title="Understand the trend, not just the number"
          description="Weekly and monthly reports that explain what's actually working — where your macros land against your goals, and what to adjust."
          iconBgClass="bg-macro-protein/15"
          iconColorClass="text-macro-protein"
          reversed
          visual={<InsightVisual />}
        />

        {/* Closing CTA */}
        <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
          <h2 className="font-display text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
            Start tracking properly
          </h2>
          <Button asChild size="lg" className="min-w-48">
            <Link href="/signup">Get started — it&apos;s free</Link>
          </Button>
        </section>

        <footer className="pb-10 text-center text-xs text-text-tertiary">
          © {new Date().getFullYear()} Caltrax
        </footer>
      </main>
    </>
  );
}
