"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "./nav-items";
import { ThemeToggle } from "@/components/theme-toggle";

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card-surface sticky top-4 hidden h-[calc(100vh-2rem)] w-64 flex-col justify-between p-4 md:flex">
      <div>
        <div className="flex items-center gap-2 px-2 py-3">
          <Image src="/icons/icon-192.png" alt="" width={28} height={28} className="rounded-md" />
          <span className="font-display text-lg font-bold text-text-primary">Caltrax</span>
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
                  "control focus-ring relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "text-brand" : "text-text-secondary hover:bg-surface-raised"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-active"
                    className="control bg-brand/10 absolute inset-0"
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                )}
                <Icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10">{item.label}</span>
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
