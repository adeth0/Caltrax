import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";

// Must match the cron schedule in vercel.json — this is the trailing
// window (in minutes) a reminder's target time is allowed to fall inside
// of "now" to still fire, so a 15-minute cron interval doesn't miss a
// reminder set for e.g. "07:23" just because the cron only ticks on the
// quarter-hour. If you change the vercel.json schedule, change this too.
const WINDOW_MINUTES = 15;

const TITLES: Record<string, string> = {
  meal: "Meal reminder",
  water: "Hydration check-in",
  exercise: "Exercise reminder",
  weight_check: "Weigh-in reminder",
  supplement: "Supplement reminder",
  custom: "Reminder",
};

function minutesSinceMidnight(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function isSameLocalDay(a: Date, b: Date, timezone: string): boolean {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(a) === fmt.format(b);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const reminders = await db.reminder.findMany({
    where: { active: true },
    include: { user: { select: { id: true, timezone: true, notificationsEnabled: true } } },
  });

  let sent = 0;
  let skipped = 0;

  for (const reminder of reminders) {
    if (!reminder.user.notificationsEnabled) {
      skipped++;
      continue;
    }

    if (reminder.lastFiredAt && isSameLocalDay(reminder.lastFiredAt, now, reminder.user.timezone)) {
      skipped++;
      continue;
    }

    const nowInTz = new Intl.DateTimeFormat("en-GB", {
      timeZone: reminder.user.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now); // "HH:mm"

    const nowMinutes = minutesSinceMidnight(nowInTz);
    const targetMinutes = minutesSinceMidnight(reminder.time);
    let diff = nowMinutes - targetMinutes;
    if (diff < 0) diff += 24 * 60; // handle wrap around midnight

    if (diff < 0 || diff >= WINDOW_MINUTES) {
      skipped++;
      continue;
    }

    await sendPushToUser(reminder.userId, {
      title: TITLES[reminder.type] ?? "Reminder",
      body: reminder.label,
      url: "/log",
    });
    await db.reminder.update({ where: { id: reminder.id }, data: { lastFiredAt: now } });
    sent++;
  }

  return NextResponse.json({ checked: reminders.length, sent, skipped });
}
