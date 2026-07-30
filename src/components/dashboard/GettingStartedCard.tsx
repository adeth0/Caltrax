import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { GettingStartedTip } from "@/lib/dashboardTips";

interface GettingStartedCardProps {
  tips: GettingStartedTip[];
}

/**
 * Only rendered when there's something genuinely useful left to suggest
 * -- getDashboardEngagement returns an empty list entirely once someone
 * has real history, so this never lingers as clutter for an established
 * user. Capped upstream at 3 items, so this always reads as "a couple of
 * quick next steps," not a task list.
 */
export function GettingStartedCard({ tips }: GettingStartedCardProps) {
  if (tips.length === 0) return null;

  return (
    <Card className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Get started</p>
      <div className="mt-3 flex flex-col gap-1.5">
        {tips.map((tip) => (
          <Link
            key={tip.key}
            href={tip.href}
            className="control focus-ring touch-target flex items-center gap-3 rounded-control bg-surface-raised px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-border-strong"
          >
            <span className="text-base" aria-hidden>
              {tip.icon}
            </span>
            <span className="flex-1">{tip.text}</span>
            <ChevronRight className="h-4 w-4 text-text-tertiary" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
