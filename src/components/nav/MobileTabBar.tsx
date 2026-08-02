"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Droplet, Dumbbell, Scale, Utensils, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "./nav-items";
import { QuickWeightModal } from "./QuickWeightModal";
import { QuickWaterModal } from "./QuickWaterModal";

const SPEED_DIAL_OPTIONS = [
  { key: "food", label: "Food", icon: Utensils },
  { key: "exercise", label: "Exercise", icon: Dumbbell },
  { key: "weight", label: "Weight", icon: Scale },
  { key: "water", label: "Water", icon: Droplet },
] as const;

export function MobileTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showSpeedDial, setShowSpeedDial] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const logItem = PRIMARY_NAV.find((item) => item.href === "/log")!;
  const otherItems = PRIMARY_NAV.filter((item) => item.href !== "/log");
  const LogIcon = logItem.icon;

  function handleSpeedDialSelect(key: (typeof SPEED_DIAL_OPTIONS)[number]["key"]) {
    setShowSpeedDial(false);
    if (key === "food") router.push("/log");
    else if (key === "exercise") router.push("/log?mode=workout");
    else if (key === "weight") setShowWeightModal(true);
    else if (key === "water") setShowWaterModal(true);
  }

  return (
    <>
      <AnimatePresence>
        {showSpeedDial && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSpeedDial(false)}
            />
            <div className="fixed inset-x-0 bottom-24 z-40 flex justify-center gap-4 md:hidden">
              {SPEED_DIAL_OPTIONS.map((opt, i) => (
                <motion.button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSpeedDialSelect(opt.key)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ delay: i * 0.04 }}
                  className="focus-ring flex flex-col items-center gap-1.5"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-raised">
                    <opt.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-text-primary shadow">
                    {opt.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      <nav
        className="card-surface fixed inset-x-4 bottom-4 z-40 flex items-center justify-between px-2 py-2 md:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
      >
        {otherItems.slice(0, 3).map((item) => (
          <TabLink key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
        ))}

        {/* Log is the single most-frequent action, so it gets a raised, distinguished
            treatment rather than competing equally with the other five tabs. A long
            press or dedicated tap now opens a speed-dial for Food/Exercise/Weight/Water
            (matching the reference screenshot's expanding "+" pattern), rather than
            only ever navigating straight to /log. */}
        <button
          type="button"
          onClick={() => setShowSpeedDial((v) => !v)}
          aria-label={showSpeedDial ? "Close quick actions" : "Quick log"}
          className="focus-ring relative -mt-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-raised transition-transform active:scale-[0.94]"
        >
          {showSpeedDial ? <X className="h-7 w-7" /> : <LogIcon className="h-7 w-7" />}
        </button>

        {otherItems.slice(3).map((item) => (
          <TabLink key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
        ))}
      </nav>

      <QuickWeightModal open={showWeightModal} onOpenChange={setShowWeightModal} />
      <QuickWaterModal open={showWaterModal} onOpenChange={setShowWaterModal} />
    </>
  );
}

function TabLink({ item, isActive }: { item: (typeof PRIMARY_NAV)[number]; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "control focus-ring touch-target relative flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium",
        isActive ? "text-brand" : "text-text-tertiary"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="mobile-nav-active"
          className="bg-brand/12 absolute inset-x-1 inset-y-0.5 rounded-control"
          transition={{ type: "spring", stiffness: 420, damping: 38 }}
        />
      )}
      <Icon className="relative z-10 h-6 w-6" />
      <span className="relative z-10">{item.label}</span>
    </Link>
  );
}
