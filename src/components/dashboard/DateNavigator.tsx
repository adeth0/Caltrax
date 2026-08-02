"use client";

import { addDays, format, startOfWeek } from "date-fns";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface DateNavigatorProps {
  viewDateStr: string;
  /** Dates (as "yyyy-MM-dd") within the shown week that already have at least one logged meal -- drives the checkmark. */
  loggedDateStrs: string[];
}

/**
 * A horizontal week strip -- one row of 7 days, each showing its date
 * number and a checkmark if anything was logged that day -- rather than
 * simple prev/next arrows. Matches the reference screenshot's date
 * browsing bar directly. Always shows the week containing the day
 * currently being viewed, so navigating across a week boundary still
 * makes sense (the strip re-centres around whatever day you land on).
 */
export function DateNavigator({ viewDateStr, loggedDateStrs }: DateNavigatorProps) {
  const router = useRouter();
  const viewDate = new Date(`${viewDateStr}T00:00:00`);
  const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
  const loggedSet = new Set(loggedDateStrs);
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <Card className="mb-4">
      <div className="flex justify-between gap-1">
        {days.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const isSelected = dayStr === viewDateStr;
          const isToday = dayStr === todayStr;
          const hasLogged = loggedSet.has(dayStr);

          return (
            <button
              key={dayStr}
              type="button"
              onClick={() => router.push(`/dashboard?date=${dayStr}`)}
              className={cn(
                "control focus-ring flex flex-1 flex-col items-center gap-1 rounded-control py-1.5 transition-colors",
                isSelected ? "bg-brand/15" : "hover:bg-surface-raised"
              )}
            >
              <span
                className={cn(
                  "text-sm tabular-nums",
                  isSelected
                    ? "font-bold text-brand"
                    : isToday
                      ? "font-semibold text-text-primary"
                      : "text-text-secondary"
                )}
              >
                {format(day, "d")}
              </span>
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full",
                  hasLogged ? "bg-brand text-brand-foreground" : "bg-surface-raised text-text-tertiary"
                )}
              >
                {hasLogged && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
