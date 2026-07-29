"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "./nav-items";

export function MobileTabBar() {
  const pathname = usePathname();
  const logItem = PRIMARY_NAV.find((item) => item.href === "/log")!;
  const otherItems = PRIMARY_NAV.filter((item) => item.href !== "/log");
  const LogIcon = logItem.icon;

  return (
    <nav
      className="card-surface fixed inset-x-4 bottom-4 z-40 flex items-center justify-between px-2 py-2 md:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
    >
      {otherItems.slice(0, 2).map((item) => (
        <TabLink key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
      ))}

      {/* Log is the single most-frequent action, so it gets a raised, distinguished
          treatment rather than competing equally with the other five tabs. Always
          brand-colored regardless of active state -- it's the one constant
          call-to-action in the bar, not a route indicator like the others. */}
      <Link
        href={logItem.href}
        aria-label={logItem.label}
        className="focus-ring relative -mt-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-raised transition-transform active:scale-[0.94]"
      >
        <LogIcon className="h-7 w-7" />
      </Link>

      {otherItems.slice(2).map((item) => (
        <TabLink key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
      ))}
    </nav>
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
