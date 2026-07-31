"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  /** Optional explicit destination -- falls back to router.back() (browser history) when omitted. */
  href?: string;
  label?: string;
  className?: string;
}

/**
 * A real, visually-obvious back button -- not a bare "← Back" text link.
 * The old text link technically met the 44px touch-target minimum via
 * min-height, but a thin line of text doesn't look or feel like
 * something to tap, and its actual clickable width was only as wide as
 * the text itself. This gives it a filled background, generous padding
 * well beyond the 44px minimum, and a real icon, so it's unambiguous
 * both visually and as a tap target.
 */
export function BackButton({ href, label = "Back", className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (href ? router.push(href) : router.back())}
      className={`control focus-ring touch-target flex items-center gap-1 rounded-full bg-surface-raised py-2.5 pl-2.5 pr-4 text-sm font-medium text-text-secondary transition-colors hover:bg-border-strong hover:text-text-primary ${className}`}
    >
      <ChevronLeft className="h-5 w-5" />
      {label}
    </button>
  );
}
