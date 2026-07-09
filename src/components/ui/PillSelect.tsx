"use client";

import { cn } from "@/lib/utils";

interface PillOption {
  value: string;
  label: string;
  hint?: string;
}

interface PillSelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: PillOption[];
  columns?: 1 | 2;
}

/**
 * Grid of large, thumb-friendly toggle buttons for a single-choice enum
 * field. Used across onboarding/settings instead of a native <select> —
 * selects are fiddly on touch devices and hide all options behind a tap.
 */
export function PillSelect({ name, value, onChange, options, columns = 1 }: PillSelectProps) {
  return (
    <div className={cn("grid gap-2", columns === 2 ? "grid-cols-2" : "grid-cols-1")} role="radiogroup">
      <input type="hidden" name={name} value={value} />
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "control focus-ring touch-target flex flex-col items-start gap-0.5 border px-4 py-2.5 text-left text-sm transition-colors",
              isActive
                ? "border-accent-info/50 bg-accent-info/15 text-text-primary"
                : "border-white/10 bg-white/5 text-text-secondary hover:bg-white/10"
            )}
          >
            <span className="font-medium">{option.label}</span>
            {option.hint && <span className="text-xs text-text-tertiary">{option.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}
