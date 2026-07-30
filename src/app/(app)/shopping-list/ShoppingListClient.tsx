"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  addManualShoppingItemAction,
  clearCheckedItemsAction,
  deleteShoppingItemAction,
  toggleShoppingItemAction,
} from "./actions";

export interface ShoppingItem {
  id: string;
  label: string;
  checked: boolean;
  recipeName: string | null;
}

export function ShoppingListClient({ items }: { items: ShoppingItem[] }) {
  const router = useRouter();
  const [newItem, setNewItem] = useState("");
  const [isPending, startTransition] = useTransition();

  const groups = useMemo(() => {
    const map = new Map<string, ShoppingItem[]>();
    for (const item of items) {
      const key = item.recipeName ?? "Other items";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return [...map.entries()];
  }, [items]);

  const checkedCount = items.filter((i) => i.checked).length;

  function handleAdd() {
    const label = newItem.trim();
    if (!label) return;
    setNewItem("");
    startTransition(async () => {
      await addManualShoppingItemAction(label);
      router.refresh();
    });
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleShoppingItemAction(id);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteShoppingItemAction(id);
      router.refresh();
    });
  }

  function handleClearChecked() {
    startTransition(async () => {
      await clearCheckedItemsAction();
      router.refresh();
    });
  }

  return (
    <main className="mx-auto max-w-2xl p-4 pb-24 sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Shopping List</h1>
          <p className="text-sm text-text-tertiary">
            Add ingredients straight from any recipe, or jot down anything else you need.
          </p>
        </div>
        {checkedCount > 0 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClearChecked}
            disabled={isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear {checkedCount} checked
          </Button>
        )}
      </header>

      <Card className="mb-4">
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add an item…"
            className="flex-1"
          />
          <Button type="button" onClick={handleAdd} disabled={isPending || !newItem.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-tertiary">
          Nothing on your list yet — add items from a recipe or type one above.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map(([groupName, groupItems]) => (
            <div key={groupName}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {groupName}
              </p>
              <div className="flex flex-col gap-1.5">
                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-control bg-surface-raised px-3 py-2.5"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id)}
                      disabled={isPending}
                      aria-label={item.checked ? "Mark as not bought" : "Mark as bought"}
                      className={cn(
                        "touch-target focus-ring flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        item.checked ? "border-brand bg-brand text-brand-foreground" : "border-border"
                      )}
                    >
                      {item.checked && <Check className="h-3 w-3" />}
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        item.checked ? "text-text-tertiary line-through" : "text-text-primary"
                      )}
                    >
                      {item.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      aria-label={`Remove ${item.label}`}
                      className="touch-target focus-ring text-text-tertiary hover:text-accent-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
