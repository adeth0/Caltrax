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

export function getYesterdayRange(): { start: Date; end: Date } {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
}

/** Range for an arbitrary date, given as "yyyy-MM-dd" -- used by the Dashboard's date navigator. */
export function getDateRange(dateStr: string): { start: Date; end: Date } {
  const date = new Date(`${dateStr}T00:00:00`);
  return { start: startOfDay(date), end: endOfDay(date) };
}

/** Today's date as "yyyy-MM-dd", for comparing against a navigated date. */
export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
