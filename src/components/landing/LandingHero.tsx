"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, ScanLine, Sparkles, Watch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { LandingWordmark } from "./LandingWordmark";

const FEATURES = [
  {
    icon: Camera,
    title: "AI meal scan",
    description: "Photograph a plate and get an instant, editable calorie and macro estimate.",
  },
  {
    icon: ScanLine,
    title: "Barcode scanner",
    description: "Log packaged food in seconds — point your camera, confirm, done.",
  },
  {
    icon: Watch,
    title: "Wearable sync",
    description: "Connect Fitbit, Withings, Oura or Whoop for automatic activity and weigh-ins.",
  },
  {
    icon: Sparkles,
    title: "Real insight",
    description: "Weekly and monthly reports that explain what's working, not just raw numbers.",
  },
];

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

export function LandingHero() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <LandingWordmark />

      <motion.p
        {...fadeUp(0.15)}
        className="mt-5 max-w-xl text-balance text-lg text-text-secondary sm:text-xl"
      >
        Nutrition and fitness tracking done properly — accurate logging, meaningful insight, and a design that
        stays out of your way.
      </motion.p>

      <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="min-w-40">
          <Link href="/signup">Get started</Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="min-w-40">
          <Link href="/login">Sign in</Link>
        </Button>
      </motion.div>

      <motion.div {...fadeUp(0.45)} className="mt-20 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <feature.icon className="h-5 w-5 text-brand" />
            <p className="mt-3 font-display text-base font-bold text-text-primary">{feature.title}</p>
            <p className="mt-1 text-sm text-text-secondary">{feature.description}</p>
          </Card>
        ))}
      </motion.div>

      <p className="mt-16 text-xs text-text-tertiary">© {new Date().getFullYear()} Caltrax</p>
    </main>
  );
}
