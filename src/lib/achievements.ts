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
  { key: "streak_90", label: "Quarter Streak", description: "Logged a meal 90 days in a row", icon: "🌟" },
  { key: "century_club", label: "Century Club", description: "Logged 100 meals total", icon: "💯" },
  { key: "five_hundred_club", label: "500 Club", description: "Logged 500 meals total", icon: "🎖️" },
  { key: "first_weigh_in", label: "First Weigh-in", description: "Logged your first weight", icon: "⚖️" },
  { key: "ten_weigh_ins", label: "Consistent Tracker", description: "Logged 10 weigh-ins", icon: "📈" },
  { key: "fifty_weigh_ins", label: "Data Devotee", description: "Logged 50 weigh-ins", icon: "📊" },
  {
    key: "goal_weight_reached",
    label: "Goal Reached",
    description: "Hit your target weight",
    icon: "🎯",
  },
  { key: "first_recipe", label: "Recipe Creator", description: "Created your first recipe", icon: "📖" },
  {
    key: "three_recipes",
    label: "Recipe Collector",
    description: "Created 3 recipes",
    icon: "📚",
  },
  { key: "first_plan", label: "Planner", description: "Planned a meal ahead of time", icon: "🗓️" },
  {
    key: "meal_prep_master",
    label: "Meal Prep Master",
    description: "Planned 7 meals ahead of time",
    icon: "🧑‍🍳",
  },
  {
    key: "early_bird",
    label: "Early Bird",
    description: "Logged breakfast before 9am, 3 times",
    icon: "🌅",
  },
  { key: "hydration_hero", label: "Hydration Hero", description: "Logged water 20 times", icon: "💧" },
  {
    key: "first_wearable",
    label: "Connected",
    description: "Linked a wearable device or smart scale",
    icon: "⌚",
  },
  {
    key: "first_ai_scan",
    label: "Smart Scanner",
    description: "Logged a meal using the AI photo scan",
    icon: "📸",
  },
  {
    key: "five_favourites",
    label: "Favourites Collector",
    description: "Favourited 5 foods",
    icon: "⭐",
  },
  { key: "first_workout", label: "First Rep", description: "Logged your first workout", icon: "🏋️" },
  {
    key: "ten_workouts",
    label: "Gym Regular",
    description: "Logged 10 workouts",
    icon: "💪",
  },
  {
    key: "fifty_workouts",
    label: "Workout Warrior",
    description: "Logged 50 workouts",
    icon: "🦾",
  },
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
  const [
    already,
    profile,
    mealDates,
    weightCount,
    latestWeight,
    recipeCount,
    planCount,
    breakfastDates,
    waterCount,
    wearableCount,
    aiScanCount,
    favouriteCount,
    workoutCount,
  ] = await Promise.all([
    db.unlockedAchievement.findMany({ where: { userId }, select: { key: true } }),
    db.profile.findUnique({ where: { id: userId }, select: { timezone: true, targetWeightKg: true } }),
    db.mealEntry.findMany({ where: { userId }, select: { loggedAt: true } }),
    db.weightLog.count({ where: { userId } }),
    db.weightLog.findFirst({ where: { userId }, orderBy: { loggedAt: "desc" }, select: { weightKg: true } }),
    db.recipe.count({ where: { userId } }),
    db.plannedMeal.count({ where: { userId } }),
    db.mealEntry.findMany({
      where: { userId, mealType: "BREAKFAST" },
      select: { loggedAt: true },
    }),
    db.waterLog.count({ where: { userId } }),
    db.wearableConnection.count({ where: { userId } }),
    // AI meal-scan foods are exactly "custom foods this user created that
    // have a photo" -- the meal-photo flow is the only path that sets
    // both ownerId and imageUrl together.
    db.food.count({ where: { ownerId: userId, imageUrl: { not: null } } }),
    db.favourite.count({ where: { userId } }),
    db.workout.count({ where: { userId } }),
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

  const goalWeightReached =
    profile?.targetWeightKg !== undefined &&
    profile?.targetWeightKg !== null &&
    latestWeight !== null &&
    Math.abs(latestWeight.weightKg - profile.targetWeightKg) <= 0.5;

  const met: Record<string, boolean> = {
    first_log: mealDates.length >= 1,
    streak_7: longestStreak >= 7,
    streak_30: longestStreak >= 30,
    streak_90: longestStreak >= 90,
    century_club: mealDates.length >= 100,
    five_hundred_club: mealDates.length >= 500,
    first_weigh_in: weightCount >= 1,
    ten_weigh_ins: weightCount >= 10,
    fifty_weigh_ins: weightCount >= 50,
    goal_weight_reached: goalWeightReached,
    first_recipe: recipeCount >= 1,
    three_recipes: recipeCount >= 3,
    first_plan: planCount >= 1,
    meal_prep_master: planCount >= 7,
    early_bird: earlyBreakfastDates.size >= 3,
    hydration_hero: waterCount >= 20,
    first_wearable: wearableCount >= 1,
    first_ai_scan: aiScanCount >= 1,
    five_favourites: favouriteCount >= 5,
    first_workout: workoutCount >= 1,
    ten_workouts: workoutCount >= 10,
    fifty_workouts: workoutCount >= 50,
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
