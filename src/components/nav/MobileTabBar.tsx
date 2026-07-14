"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "./nav-items";

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="glass-panel fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-card px-2 py-2 md:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
    >
      {PRIMARY_NAV.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "control focus-ring touch-target relative flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium",
              isActive ? "text-accent-info" : "text-text-tertiary"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-active"
                className="bg-accent-info/12 absolute inset-x-1 inset-y-0.5 rounded-control"
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
              />
            )}
            <Icon className="relative z-10 h-6 w-6" />
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
