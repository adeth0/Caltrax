import {
  Apple,
  Carrot,
  Drumstick,
  Egg,
  Milk,
  Nut,
  Package,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from "lucide-react";

export interface FoodCategoryVisual {
  icon: LucideIcon;
  /** Tailwind background + text color classes for the icon's circular badge. */
  colorClasses: string;
}

const CATEGORY_VISUALS: Record<string, FoodCategoryVisual> = {
  meat: { icon: Drumstick, colorClasses: "bg-[#5a3226]/20 text-[#c98a6b]" },
  protein: { icon: Egg, colorClasses: "bg-[#5a4a26]/20 text-[#d4b96a]" },
  vegetable: { icon: Carrot, colorClasses: "bg-[#2d4a2d]/20 text-[#7fb37f]" },
  fruit: { icon: Apple, colorClasses: "bg-[#5a2626]/20 text-[#d47f7f]" },
  grain: { icon: Wheat, colorClasses: "bg-[#5a4a1f]/20 text-[#d4b45f]" },
  dairy: { icon: Milk, colorClasses: "bg-[#25405a]/20 text-[#7fa8c9]" },
  nuts: { icon: Nut, colorClasses: "bg-[#3d2f1f]/20 text-[#b08a5f]" },
  pantry: { icon: Package, colorClasses: "bg-surface-raised text-text-tertiary" },
};

const FALLBACK_VISUAL: FoodCategoryVisual = {
  icon: UtensilsCrossed,
  colorClasses: "bg-surface-raised text-text-tertiary",
};

export function getFoodCategoryVisual(category: string | null | undefined): FoodCategoryVisual {
  if (!category) return FALLBACK_VISUAL;
  return CATEGORY_VISUALS[category.toLowerCase()] ?? FALLBACK_VISUAL;
}
