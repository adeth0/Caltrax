const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface FoodMacroRingProps {
  carbsPct: number;
  fatPct: number;
  proteinPct: number;
  calories: number;
}

/** A tri-color ring (carbs/fat/protein) for one food, sized for an inline review card -- not the dashboard's larger daily-progress ring, a different, smaller component for a different purpose. */
export function FoodMacroRing({ carbsPct, fatPct, proteinPct, calories }: FoodMacroRingProps) {
  const carbsLength = (carbsPct / 100) * CIRCUMFERENCE;
  const fatLength = (fatPct / 100) * CIRCUMFERENCE;
  const proteinLength = (proteinPct / 100) * CIRCUMFERENCE;

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="var(--surface-raised)" strokeWidth="7" />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="var(--macro-carbs)"
          strokeWidth="7"
          strokeDasharray={`${carbsLength} ${CIRCUMFERENCE}`}
          strokeDashoffset={0}
        />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="var(--macro-fat)"
          strokeWidth="7"
          strokeDasharray={`${fatLength} ${CIRCUMFERENCE}`}
          strokeDashoffset={-carbsLength}
        />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="var(--macro-protein)"
          strokeWidth="7"
          strokeDasharray={`${proteinLength} ${CIRCUMFERENCE}`}
          strokeDashoffset={-(carbsLength + fatLength)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs font-bold tabular-nums text-text-primary">{calories}</p>
        <p className="text-[8px] text-text-tertiary">Cal</p>
      </div>
    </div>
  );
}
