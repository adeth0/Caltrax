import { db } from "@/lib/db";
import { format, subDays } from "date-fns";

export interface GettingStartedTip {
  key: string;
  icon: string;
  text: string;
  href: string;
}

/** Length of the current active streak (consecutive days ending today or
 * yesterday) -- distinct from achievements.ts's longestConsecutiveStreak,
 * which tracks the best-ever run for unlocking a badge. This is the
 * "don't break the chain" number that actually motivates showing up
 * again tomorrow, so it only counts if it's still alive right now. */
function currentStreak(dateStrings: Set<string>): number {
  if (dateStrings.size === 0) return 0;
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  // If neither today nor yesterday has a log, the streak is over -- don't
  // show a stale number that implies it's still going.
  if (!dateStrings.has(today) && !dateStrings.has(yesterday)) return 0;

  let count = 0;
  const cursor = dateStrings.has(today) ? new Date() : subDays(new Date(), 1);
  for (;;) {
    const key = format(cursor, "yyyy-MM-dd");
    if (!dateStrings.has(key)) break;
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export interface DashboardEngagement {
  currentStreak: number;
  tips: GettingStartedTip[];
}

/**
 * Adaptive "getting started" checklist -- only shows things the person
 * genuinely hasn't done yet, and returns an empty list entirely once
 * they're past the point of needing pointers (more than a handful of
 * meals logged), so this never lingers as clutter for an established
 * user. Deliberately capped at 3 items even for a brand-new account,
 * so it reads as "a few quick next steps" rather than a wall of tasks.
 */
export async function getDashboardEngagement(userId: string): Promise<DashboardEngagement> {
  const [mealDates, weightCount, wearableCount, aiScanCount, recipeCount] = await Promise.all([
    db.mealEntry.findMany({ where: { userId }, select: { loggedAt: true } }),
    db.weightLog.count({ where: { userId } }),
    db.wearableConnection.count({ where: { userId } }),
    db.food.count({ where: { ownerId: userId, imageUrl: { not: null } } }),
    db.recipe.count({ where: { userId } }),
  ]);

  const dateSet = new Set(mealDates.map((m: (typeof mealDates)[number]) => format(m.loggedAt, "yyyy-MM-dd")));
  const mealCount = mealDates.length;

  // Once someone has real history, they no longer need onboarding-style
  // pointers -- showing these to an established user would just be
  // clutter, not help.
  const isEstablished = mealCount >= 10;

  const tips: GettingStartedTip[] = [];
  if (!isEstablished) {
    if (mealCount === 0) {
      tips.push({ key: "log_meal", icon: "🍽️", text: "Log your first meal", href: "/log" });
    }
    if (weightCount === 0) {
      tips.push({ key: "log_weight", icon: "⚖️", text: "Log your starting weight", href: "/progress" });
    }
    if (mealCount > 0 && aiScanCount === 0) {
      tips.push({ key: "try_scan", icon: "📸", text: "Try the AI meal scan", href: "/log" });
    }
    if (mealCount > 0 && wearableCount === 0) {
      tips.push({
        key: "connect_wearable",
        icon: "⌚",
        text: "Connect a wearable device",
        href: "/settings",
      });
    }
    if (mealCount > 2 && recipeCount === 0) {
      tips.push({ key: "save_recipe", icon: "📖", text: "Save your first recipe", href: "/foods" });
    }
  }

  return {
    currentStreak: currentStreak(dateSet),
    tips: tips.slice(0, 3),
  };
}
