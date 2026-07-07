"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { MacroRing } from "@/components/ui/MacroRing";
import type { MacroTargets } from "@/types";

interface MacroRingsCardProps {
  targets: MacroTargets;
  consumed: Pick<MacroTargets, "proteinG" | "carbsG" | "fatG" | "fibreG">;
}

export function MacroRingsCard({ targets, consumed }: MacroRingsCardProps) {
  return (
    <GlassCard>
      <p className="mb-4 text-sm text-text-secondary">Macros</p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <MacroRing label="Protein" value={consumed.proteinG} target={targets.proteinG} color="#60A5FA" />
        <MacroRing label="Carbs" value={consumed.carbsG} target={targets.carbsG} color="#FBBF24" />
        <MacroRing label="Fat" value={consumed.fatG} target={targets.fatG} color="#F472B6" />
        <MacroRing label="Fibre" value={consumed.fibreG} target={targets.fibreG} color="#4ADE80" />
      </div>
    </GlassCard>
  );
}
