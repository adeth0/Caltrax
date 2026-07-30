import { Camera, ScanLine } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function MealScanVisual() {
  return (
    <Card className="mx-auto max-w-sm">
      <div className="flex items-center gap-3">
        <div className="bg-macro-carbs/20 flex h-16 w-16 shrink-0 items-center justify-center rounded-lg">
          <Camera className="h-6 w-6 text-macro-carbs" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-tertiary">Analyzing photo…</p>
          <p className="mt-1 text-sm font-medium text-text-primary">Grilled chicken &amp; rice bowl</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {[
          { name: "Chicken breast", kcal: 248 },
          { name: "Jasmine rice", kcal: 206 },
          { name: "Mixed vegetables", kcal: 64 },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-control bg-surface-raised p-2.5"
          >
            <span className="text-sm text-text-secondary">{item.name}</span>
            <span className="text-sm font-semibold tabular-nums text-text-primary">{item.kcal} kcal</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function BarcodeVisual() {
  return (
    <Card className="mx-auto max-w-sm">
      <div className="flex items-center justify-center rounded-control bg-surface-raised py-8">
        <ScanLine className="h-10 w-10 text-brand" strokeWidth={1.5} />
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Scanned</p>
        <div className="label-rule" />
        <div className="label-rule-thin" />
        <p className="font-display text-lg font-bold text-text-primary">Greek Yoghurt, Plain</p>
        <p className="mt-1 text-sm text-text-tertiary">59 kcal · 10g protein per 100g</p>
      </div>
    </Card>
  );
}

export function WearableVisual() {
  return (
    <Card className="mx-auto max-w-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Calories remaining</p>
      <div className="label-rule" />
      <div className="label-rule-thin" />
      <p className="font-display text-4xl font-black tabular-nums text-text-primary">
        1,340 <span className="text-base font-medium text-text-secondary">kcal</span>
      </p>
      <div className="mt-3 flex gap-4 text-sm text-text-secondary">
        <span>
          Goal <b className="font-semibold text-text-primary">2,200</b>
        </span>
        <span>
          Exercise <b className="font-semibold text-accent-success">+340</b>
        </span>
      </div>
    </Card>
  );
}

export function InsightVisual() {
  const rows = [
    { label: "Protein", pct: 78, color: "bg-macro-protein" },
    { label: "Carbs", pct: 92, color: "bg-macro-carbs" },
    { label: "Fat", pct: 61, color: "bg-macro-fat" },
  ];
  return (
    <Card className="mx-auto max-w-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">This week vs. goal</p>
      <div className="mt-4 flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text-secondary">{row.label}</span>
              <span className="font-semibold tabular-nums text-text-primary">{row.pct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
