"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "./nav-items";
import { ThemeToggle } from "@/components/theme-toggle";

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] w-64 flex-col justify-between rounded-card p-4 md:flex">
      <div>
        <div className="px-2 py-3">
          <span className="font-display text-lg font-semibold text-text-primary">Caltrax</span>
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {PRIMARY_NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "control focus-ring flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-white/10 text-text-primary" : "text-text-secondary hover:bg-white/5"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-text-tertiary">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
