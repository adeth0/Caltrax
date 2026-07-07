"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

interface HydrationCardProps {
  consumedMl: number;
  targetMl: number;
  onAdd?: (ml: number) => void;
}

const QUICK_ADD_ML = [250, 500, 750];

export function HydrationCard({ consumedMl, targetMl, onAdd }: HydrationCardProps) {
  const pct = targetMl > 0 ? Math.min(1, consumedMl / targetMl) : 0;

  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">Hydration</p>
        <p className="text-xs text-text-tertiary">
          {(consumedMl / 1000).toFixed(1)}L / {(targetMl / 1000).toFixed(1)}L
        </p>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-pill bg-white/10">
        <motion.div
          className="h-full rounded-pill bg-accent-info"
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-4 flex gap-2">
        {QUICK_ADD_ML.map((ml) => (
          <button
            key={ml}
            type="button"
            onClick={() => onAdd?.(ml)}
            className="control focus-ring touch-target flex-1 bg-white/5 text-sm text-text-secondary hover:bg-white/10"
          >
            +{ml >= 1000 ? `${ml / 1000}L` : `${ml}ml`}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
