"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * The real Caltrax logo (icon + wordmark + "Track. Fuel. Achieve." tagline),
 * on its own fixed dark badge rather than adapting to light/dark mode --
 * the artwork has a solid near-black background baked in by design, the
 * same convention many brand marks use (a fixed-appearance lockup rather
 * than one that recolors itself). Framed in a rounded card here so it
 * reads as an intentional badge rather than a stray image dropped on the
 * page.
 */
export function LandingWordmark() {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-card shadow-raised">
      <Image
        src="/logo-full.webp"
        alt="Caltrax — Track. Fuel. Achieve."
        width={1123}
        height={943}
        priority
        className="w-full"
      />
      {/* The sweep: a solid panel that starts covering the whole logo and
          wipes off to the right on load, revealing the artwork underneath
          rather than fading it in -- reads as a deliberate reveal rather
          than a generic fade/slide entrance. */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0 bg-base"
      />
    </div>
  );
}
