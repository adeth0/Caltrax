"use client";

import { motion } from "framer-motion";

/**
 * Placeholder for the real logo (caltrax_logo.png) -- swap the content of
 * this component for an <img src="/logo.png" ... /> once that asset is
 * added to /public. Everything else on the landing page (the sweep-in
 * animation wrapper, sizing, spacing) is already built around this
 * component's box, so dropping the real image in is a one-line change
 * here rather than a page-wide edit.
 */
export function LandingWordmark() {
  return (
    <div className="relative overflow-hidden">
      <motion.span
        initial={{ x: "-110%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block font-display text-5xl font-black tracking-tight text-text-primary sm:text-6xl"
      >
        Caltrax
      </motion.span>
    </div>
  );
}
