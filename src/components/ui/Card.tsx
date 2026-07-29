import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  /** Adds a subtle lift on hover -- opt in for cards that are themselves a tap target. */
  hoverable?: boolean;
}

/**
 * The base solid surface every dashboard widget, sheet and modal is built
 * from. Do not reimplement border/radius/background ad hoc in a feature
 * component -- compose on top of this so a future theme change only needs
 * to happen in one place. (Formerly GlassCard/.glass-panel -- renamed when
 * the design moved from a blurred "liquid glass" surface to a flat, solid
 * one; the role in the markup is identical.)
 */
export function Card({ className, padded = true, hoverable = false, children, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "card-surface",
        padded && "p-5 sm:p-6",
        hoverable &&
          "cursor-pointer transition-[transform,box-shadow] duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-raised active:translate-y-0 active:scale-[0.99]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
