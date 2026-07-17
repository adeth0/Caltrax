"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { AchievementDef } from "@/lib/achievements";

interface NewAchievementBannerProps {
  achievements: AchievementDef[];
}

export function NewAchievementBanner({ achievements }: NewAchievementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel flex items-center gap-3 border-accent-warning/30 bg-accent-warning/10 p-4"
        >
          <span className="text-2xl">{achievements[0]!.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">
              Achievement unlocked: {achievements[0]!.label}
            </p>
            <p className="text-xs text-text-tertiary">
              {achievements[0]!.description}
              {achievements.length > 1 ? ` · +${achievements.length - 1} more` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="touch-target focus-ring control shrink-0 px-2 text-xs text-text-tertiary hover:text-text-secondary"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
