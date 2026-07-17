"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { ACHIEVEMENTS } from "@/lib/achievements";

export interface UnlockedInfo {
  key: string;
  unlockedAt: string; // pre-formatted display date
}

interface AchievementsGridProps {
  unlocked: UnlockedInfo[];
}

export function AchievementsGrid({ unlocked }: AchievementsGridProps) {
  const unlockedMap = new Map(unlocked.map((u) => [u.key, u.unlockedAt]));

  return (
    <GlassCard>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-text-primary">Achievements</p>
        <p className="text-xs text-text-tertiary">
          {unlocked.length} / {ACHIEVEMENTS.length}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const unlockedAt = unlockedMap.get(a.key);
          const isUnlocked = unlockedAt !== undefined;
          return (
            <div
              key={a.key}
              className={cn(
                "control flex flex-col items-center gap-1 border p-3 text-center transition-opacity",
                isUnlocked
                  ? "border-accent-warning/30 bg-accent-warning/10"
                  : "border-white/10 bg-white/5 opacity-50"
              )}
            >
              <span className="text-2xl" aria-hidden>
                {isUnlocked ? a.icon : "🔒"}
              </span>
              <p className="text-xs font-medium text-text-primary">{a.label}</p>
              <p className="text-[10px] text-text-tertiary">{a.description}</p>
              {isUnlocked && <p className="text-[10px] text-accent-warning">{unlockedAt}</p>}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
