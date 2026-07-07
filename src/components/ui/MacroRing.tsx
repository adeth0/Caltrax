"use client";

import { motion } from "framer-motion";

interface MacroRingProps {
  label: string;
  value: number;
  target: number;
  unit?: string;
  color: string; // resolved CSS color, e.g. "var(--tw-color-macro-protein)" or a hex
  size?: number;
  strokeWidth?: number;
}

/**
 * A single animated progress ring. Used both for the big "calories
 * remaining" hero ring and the smaller protein/carbs/fat/fibre rings.
 * Colour is passed in explicitly so callers can apply the design
 * system's semantic accents (info/success/warning/danger) or the
 * macro-specific hues, per the token system in tailwind.config.ts.
 */
export function MacroRing({
  label,
  value,
  target,
  unit = "g",
  color,
  size = 96,
  strokeWidth = 8,
}: MacroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(1.15, value / target) : 0; // allow slight overflow visual
  const dashOffset = circumference * (1 - Math.min(1, pct));

  return (
    <div className="flex flex-col items-center gap-2" role="img" aria-label={`${label}: ${value} of ${target}${unit}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-white/10"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            strokeLinecap="round"
            className="fill-none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold text-text-primary">{Math.round(value)}</span>
          <span className="text-[10px] text-text-tertiary">/ {Math.round(target)}{unit}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  );
}
