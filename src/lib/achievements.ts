import { db } from "@/lib/db";

export interface AchievementDef {
  key: string;
  label: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { key: "first_log", label: "First Log", description: "Logged your first meal", icon: "🍽️" },
  { key: "streak_7", label: "Week Streak", description: "Logged a meal 7 days in a row", icon: "🔥" },
  { key: "streak_30", label: "Month Streak", description: "Logged a meal 30 days in a row", icon: "🏆" },
  { key: "century_club", label: "Century Club", description: "Logged 100 meals total", icon: "💯" },
  { key: "first_weigh_in", label: "First Weigh-in", description: "Logged your first weight", icon: "⚖️" },
  { key: "ten_weigh_ins", label: "Consistent Tracker", description: "Logged 10 weigh-ins", icon: "📈" },
  { key: "first_recipe", label: "Recipe Creator", description: "Created your first recipe", icon: "📖" },
  { key: "first_plan", label: "Planner", description: "Planned a meal ahead of time", icon: "🗓️" },
  {
    key: "early_bird",
    label: "Early Bird",
    description: "Logged breakfast before 9am, 3 times",
    icon: "🌅",
  },
  { key: "hydration_hero", label: "Hydration Hero", description: "Logged water 20 times", icon: "💧" },
];

/** Length of the longest run of consecutive calendar days present in a set of "yyyy-MM-dd" strings. */
function longestConsecutiveStreak(dateStrings: Set<string>): number {
  if (dateStrings.size === 0) return 0;
  const dates = [...dateStrings].map((d) => new Date(`${d}T00:00:00.000Z`).getTime()).sort((a, b) => a - b);
  const DAY_MS = 24 * 60 * 60 * 1000;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = dates[i - 1]!;
    const curr = dates[i]!;
    if (curr - prev === DAY_MS) {
      current += 1;
      longest = Math.max(longest, current);
    } else if (curr !== prev) {
      current = 1;
    }
  }
  return longest;
}

/**
 * Checks every achievement definition against the user's current data and
 * persists any newly-met ones. Cheap enough (a handful of counts/selects) to
 * call on every dashboard/progress load rather than needing a background job.
 * Returns the definitions newly unlocked by this call (empty most of the
 * time, once a user has been using the app for a while).
 */
export async function checkAndUnlockAchievements(userId: string): Promise<AchievementDef[]> {
  const [already, profile, mealDates, weightCount, recipeCount, planCount, breakfastDates, waterCount] =
    await Promise.all([
      db.unlockedAchievement.findMany({ where: { userId }, select: { key: true } }),
      db.profile.findUnique({ where: { id: userId }, select: { timezone: true } }),
      db.mealEntry.findMany({ where: { userId }, select: { loggedAt: true } }),
      db.weightLog.count({ where: { userId } }),
      db.recipe.count({ where: { userId } }),
      db.plannedMeal.count({ where: { userId } }),
      db.mealEntry.findMany({
        where: { userId, mealType: "BREAKFAST" },
        select: { loggedAt: true },
      }),
      db.waterLog.count({ where: { userId } }),
    ]);

  const alreadyUnlocked = new Set(already.map((a: (typeof already)[number]) => a.key));
  const timezone = profile?.timezone ?? "UTC";
  const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: timezone });

  const mealDateSet: Set<string> = new Set(
    mealDates.map((m: (typeof mealDates)[number]) => dayFmt.format(m.loggedAt))
  );
  const longestStreak = longestConsecutiveStreak(mealDateSet);

  const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, hour: "2-digit", hour12: false });
  const earlyBreakfastDates = new Set(
    breakfastDates
      .filter((b: (typeof breakfastDates)[number]) => Number(hourFmt.format(b.loggedAt)) < 9)
      .map((b: (typeof breakfastDates)[number]) => dayFmt.format(b.loggedAt))
  );

  const met: Record<string, boolean> = {
    first_log: mealDates.length >= 1,
    streak_7: longestStreak >= 7,
    streak_30: longestStreak >= 30,
    century_club: mealDates.length >= 100,
    first_weigh_in: weightCount >= 1,
    ten_weigh_ins: weightCount >= 10,
    first_recipe: recipeCount >= 1,
    first_plan: planCount >= 1,
    early_bird: earlyBreakfastDates.size >= 3,
    hydration_hero: waterCount >= 20,
  };

  const newlyUnlocked = ACHIEVEMENTS.filter((a) => met[a.key] && !alreadyUnlocked.has(a.key));

  if (newlyUnlocked.length > 0) {
    await db.unlockedAchievement.createMany({
      data: newlyUnlocked.map((a) => ({ userId, key: a.key })),
      skipDuplicates: true,
    });
  }

  return newlyUnlocked;
}
