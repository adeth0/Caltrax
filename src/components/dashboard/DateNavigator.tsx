"use client";

import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function DateNavigator({ viewDateStr }: { viewDateStr: string }) {
  const router = useRouter();
  const viewDate = new Date(`${viewDateStr}T00:00:00`);

  function goTo(dateStr: string) {
    router.push(`/dashboard?date=${dateStr}`);
  }

  const prevDate = format(addDays(viewDate, -1), "yyyy-MM-dd");
  const nextDate = format(addDays(viewDate, 1), "yyyy-MM-dd");

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goTo(prevDate)}
          aria-label="Previous day"
          className="control focus-ring touch-target flex items-center justify-center rounded-full text-text-secondary hover:bg-surface-raised hover:text-text-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="text-sm font-semibold text-text-primary">{format(viewDate, "EEEE — d MMMM")}</p>
        <button
          type="button"
          onClick={() => goTo(nextDate)}
          aria-label="Next day"
          className="control focus-ring touch-target flex items-center justify-center rounded-full text-text-secondary hover:bg-surface-raised hover:text-text-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </Card>
  );
}
