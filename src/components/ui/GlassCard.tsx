import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  /** Adds a subtle lift + glow on hover — opt in for cards that are themselves a tap target. */
  hoverable?: boolean;
}

/**
 * The base glass surface every dashboard widget, sheet and modal is built
 * from. Do not reimplement blur/border/radius ad hoc in a feature
 * component — compose on top of this so a future theme change (e.g.
 * blur intensity) only needs to happen in one place.
 */
export function GlassCard({
  className,
  padded = true,
  hoverable = false,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={clsx(
        "glass-panel",
        padded && "p-5 sm:p-6",
        hoverable &&
          "cursor-pointer transition-[transform,box-shadow] duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-glow-sm active:translate-y-0 active:scale-[0.99]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
