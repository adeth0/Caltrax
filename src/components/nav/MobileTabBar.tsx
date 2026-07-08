"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
              "control focus-ring touch-target flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium",
              isActive ? "text-accent-info" : "text-text-tertiary"
            )}
          >
            <Icon className="h-6 w-6" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
