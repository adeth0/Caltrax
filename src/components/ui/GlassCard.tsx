import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

/**
 * The base glass surface every dashboard widget, sheet and modal is built
 * from. Do not reimplement blur/border/radius ad hoc in a feature
 * component — compose on top of this so a future theme change (e.g.
 * blur intensity) only needs to happen in one place.
 */
export function GlassCard({ className, padded = true, children, ...rest }: GlassCardProps) {
  return (
    <div className={clsx("glass-panel", padded && "p-5 sm:p-6", className)} {...rest}>
      {children}
    </div>
  );
}
