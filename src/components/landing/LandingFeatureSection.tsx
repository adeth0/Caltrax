"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface LandingFeatureSectionProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  /** Full literal class names -- Tailwind's build-time scanner can't
   * resolve interpolated strings like `${x}/15`, so both are passed
   * whole rather than derived from one another. */
  iconBgClass: string;
  iconColorClass: string;
  reversed?: boolean;
  visual: React.ReactNode;
}

/**
 * One full "moment" per feature, revealed as the person scrolls to it
 * rather than all visible at once in a grid -- the thing that actually
 * makes a page feel like an Apple product page instead of a features
 * list. whileInView + viewport={{ once: true }} keeps this cheap (no
 * continuous scroll-position tracking) while still feeling alive.
 */
export function LandingFeatureSection({
  icon: Icon,
  eyebrow,
  title,
  description,
  iconBgClass,
  iconColorClass,
  reversed = false,
  visual,
}: LandingFeatureSectionProps) {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 py-20 sm:py-28 md:gap-16">
      <div
        className={`flex w-full flex-col items-center gap-10 md:flex-row md:gap-16 ${
          reversed ? "md:flex-row-reverse" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 text-center md:text-left"
        >
          <div className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${iconBgClass}`}>
            <Icon className={`h-5 w-5 ${iconColorClass}`} />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">{eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-balance text-base text-text-secondary sm:text-lg">{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          {visual}
        </motion.div>
      </div>
    </section>
  );
}
