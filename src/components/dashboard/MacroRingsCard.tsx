"use client";

import { Card } from "@/components/ui/Card";
import type { MacroTargets } from "@/types";

interface MacroRingsCardProps {
  targets: MacroTargets;
  consumed: Pick<MacroTargets, "proteinG" | "carbsG" | "fatG" | "fibreG">;
}

interface MacroDef {
  label: string;
  value: number;
  target: number;
  colorClass: string;
}

function MacroTile({ label, value, target, colorClass }: MacroDef) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div>
      <div className={`h-[3px] rounded-full ${colorClass}`} />
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">{label}</p>
      <p className="mt-0.5 font-display text-xl font-bold tabular-nums text-text-primary">
        {Math.round(value)}g
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Deliberately bars, not rings -- see the design brief. A ring is the
 * generic fitness-app default; a flat colored bar under a tabular number
 * reads closer to the nutrition-label vernacular the rest of the app uses,
 * and the three/four macro colors do real work here (encoding which
 * macro is which), not decoration. */
export function MacroRingsCard({ targets, consumed }: MacroRingsCardProps) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Macros</p>
      <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
        <MacroTile
          label="Protein"
          value={consumed.proteinG}
          target={targets.proteinG}
          colorClass="bg-macro-protein"
        />
        <MacroTile
          label="Carbs"
          value={consumed.carbsG}
          target={targets.carbsG}
          colorClass="bg-macro-carbs"
        />
        <MacroTile label="Fat" value={consumed.fatG} target={targets.fatG} colorClass="bg-macro-fat" />
        <MacroTile
          label="Fibre"
          value={consumed.fibreG}
          target={targets.fibreG}
          colorClass="bg-macro-fibre"
        />
      </div>
    </Card>
  );
}
