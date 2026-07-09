import { endOfDay, startOfDay } from "date-fns";

/**
 * Returns the start/end of "today" on the server clock (UTC on Vercel).
 * V1 simplification: not yet timezone-aware per-user — a user far from UTC
 * may see their day roll over a few hours early/late. Revisit by storing
 * the user's IANA timezone on `Profile` and computing this with it
 * (e.g. via `date-fns-tz`) before this becomes a user-facing complaint.
 */
export function getTodayRange(): { start: Date; end: Date } {
  const now = new Date();
  return { start: startOfDay(now), end: endOfDay(now) };
}

export function getLastNDaysRange(days: number): { start: Date; end: Date } {
  const now = new Date();
  const start = startOfDay(now);
  start.setDate(start.getDate() - (days - 1));
  return { start, end: endOfDay(now) };
}
