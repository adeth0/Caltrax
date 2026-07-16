import { cn } from "@/lib/utils";
import { MICRONUTRIENTS, type MicronutrientIntake } from "@/lib/micronutrients";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Sex } from "@/types";

interface MicronutrientsCardProps {
  intake: MicronutrientIntake;
  sex: Sex;
  hasLoggedToday: boolean;
}

function formatAmount(value: number, unit: "mg" | "mcg"): string {
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded}${unit}`;
}

export function MicronutrientsCard({ intake, sex, hasLoggedToday }: MicronutrientsCardProps) {
  return (
    <GlassCard>
      <p className="text-sm font-medium text-text-primary">Micronutrients today</p>
      <p className="mt-0.5 text-xs text-text-tertiary">
        Against standard adult daily targets — not personalised medical advice.
      </p>

      {!hasLoggedToday ? (
        <p className="mt-3 text-sm text-text-tertiary">
          Log a meal today to see your micronutrient breakdown.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {MICRONUTRIENTS.map((def) => {
            const value = intake[def.key];
            const target = def.target(sex);
            const pct = target > 0 ? (value / target) * 100 : 0;
            const isOverLimit = def.direction === "max" && pct > 100;
            const isOnTrack = def.direction === "min" ? pct >= 100 : pct <= 100;

            const barColor = isOverLimit
              ? "bg-accent-danger"
              : isOnTrack
                ? "bg-accent-success"
                : pct >= 50
                  ? "bg-accent-warning"
                  : "bg-white/25";

            return (
              <div key={def.key}>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-xs font-medium text-text-secondary">{def.label}</span>
                  <span className="text-[10px] text-text-tertiary">{Math.round(pct)}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-500 ease-apple", barColor)}
                    style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-text-tertiary">
                  {formatAmount(value, def.unit)} / {formatAmount(target, def.unit)}
                  {def.direction === "max" ? " limit" : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
