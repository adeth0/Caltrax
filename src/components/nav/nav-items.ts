import type { LucideIcon } from "lucide-react";
import { BarChart3, Home, PlusCircle, Settings, Utensils } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Single source of truth for primary navigation — desktop sidebar and mobile tab bar both read this. */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", label: "Today", icon: Home },
  { href: "/log", label: "Log", icon: PlusCircle },
  { href: "/foods", label: "Foods", icon: Utensils },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];
