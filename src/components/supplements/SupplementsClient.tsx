"use client";

import { useMemo, useState, useTransition } from "react";
import { Dumbbell, Droplet, Gem, Package, Pill, X, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { deleteSupplementLogAction, logSupplementAction } from "@/app/(app)/foods/actions";

export type SupplementCategoryValue = "PROTEIN" | "VITAMIN" | "MINERAL" | "OMEGA3" | "PERFORMANCE" | "OTHER";

export interface SupplementSummary {
  id: string;
  name: string;
  brand: string | null;
  category: SupplementCategoryValue;
  servingLabel: string;
  activeIngredient: string;
  summary: string;
  caloriesPerServing: number | null;
  proteinPerServing: number | null;
}

export interface LoggedSupplement {
  id: string;
  supplementId: string;
  supplementName: string;
  servingsTaken: number;
}

/** A supplement suggested based on the person's stated goal and diet, with a plain-language reason -- see src/lib/supplementSuggestions.ts. */
export interface SuggestedSupplement extends SupplementSummary {
  reason: string;
}

const CATEGORY_META: Record<
  SupplementCategoryValue,
  { label: string; icon: typeof Pill; colorClass: string }
> = {
  PROTEIN: { label: "Protein", icon: Dumbbell, colorClass: "text-macro-protein" },
  VITAMIN: { label: "Vitamins", icon: Pill, colorClass: "text-macro-carbs" },
  MINERAL: { label: "Minerals", icon: Gem, colorClass: "text-brand" },
  OMEGA3: { label: "Omega-3", icon: Droplet, colorClass: "text-accent-info" },
  PERFORMANCE: { label: "Performance", icon: Zap, colorClass: "text-accent-warning" },
  OTHER: { label: "Other", icon: Package, colorClass: "text-macro-fibre" },
};

const CATEGORY_FILTERS: { value: SupplementCategoryValue | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "PROTEIN", label: "Protein" },
  { value: "PERFORMANCE", label: "Performance" },
  { value: "VITAMIN", label: "Vitamins" },
  { value: "MINERAL", label: "Minerals" },
  { value: "OMEGA3", label: "Omega-3" },
  { value: "OTHER", label: "Other" },
];

interface SupplementsClientProps {
  supplements: SupplementSummary[];
  suggestedSupplements: SuggestedSupplement[];
  todayLogs: LoggedSupplement[];
}

export function SupplementsClient({ supplements, suggestedSupplements, todayLogs }: SupplementsClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SupplementCategoryValue | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    let list = supplements;
    if (category !== "all") list = list.filter((s) => s.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.activeIngredient.toLowerCase().includes(q)
      );
    }
    return list;
  }, [supplements, query, category]);

  function handleLog(supplementId: string) {
    startTransition(async () => {
      await logSupplementAction(supplementId, 1);
    });
  }

  function handleRemoveLog(logId: string) {
    startTransition(async () => {
      await deleteSupplementLogAction(logId);
    });
  }

  return (
    <div>
      {suggestedSupplements.length > 0 && query.trim() === "" && category === "all" && (
        <Card className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Recommended for your goals
          </p>
          <div className="mt-2 flex flex-col gap-2.5">
            {suggestedSupplements.map((supp) => (
              <div key={supp.id} className="rounded-control bg-surface-raised p-3">
                <p className="text-sm font-semibold text-text-primary">{supp.name}</p>
                <p className="mt-0.5 text-xs text-text-tertiary">{supp.reason}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-tertiary">
            A general starting point based on your goal and diet -- see the Learn section for the evidence
            behind each one.
          </p>
        </Card>
      )}

      {todayLogs.length > 0 && (
        <Card className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Taken today</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {todayLogs.map((log) => (
              <span
                key={log.id}
                className="flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1.5 text-sm text-text-primary"
              >
                {log.supplementName}
                {log.servingsTaken !== 1 && <span className="text-text-tertiary">×{log.servingsTaken}</span>}
                <button
                  type="button"
                  onClick={() => handleRemoveLog(log.id)}
                  disabled={isPending}
                  aria-label={`Remove ${log.supplementName}`}
                  className="touch-target focus-ring -mr-1 text-text-tertiary hover:text-accent-danger"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </Card>
      )}

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search supplements…"
        className="mb-3"
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_FILTERS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={cn(
              "control focus-ring touch-target shrink-0 px-3 py-1.5 text-sm font-medium",
              category === c.value
                ? "bg-brand text-brand-foreground"
                : "bg-surface-raised text-text-secondary hover:bg-border-strong"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-tertiary">No supplements match that search.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((supp) => {
            const meta = CATEGORY_META[supp.category];
            const Icon = meta.icon;
            const isExpanded = expandedId === supp.id;
            return (
              <Card key={supp.id} padded={false} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : supp.id)}
                  className="control flex w-full items-center gap-3 p-4 text-left"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-raised",
                      meta.colorClass
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">{supp.name}</p>
                    <p className="truncate text-xs text-text-tertiary">
                      {supp.servingLabel} · {supp.activeIngredient}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLog(supp.id);
                    }}
                  >
                    + Log
                  </Button>
                </button>
                {isExpanded && (
                  <div className="border-t border-border px-4 py-3">
                    <p className="text-sm text-text-secondary">{supp.summary}</p>
                    {(supp.caloriesPerServing || supp.proteinPerServing) && (
                      <p className="mt-2 text-xs text-text-tertiary">
                        {supp.caloriesPerServing ? `${Math.round(supp.caloriesPerServing)} kcal` : ""}
                        {supp.caloriesPerServing && supp.proteinPerServing ? " · " : ""}
                        {supp.proteinPerServing ? `${Math.round(supp.proteinPerServing)}g protein` : ""}
                        {" per serving"}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
