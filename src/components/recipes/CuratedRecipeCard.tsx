import Link from "next/link";
import Image from "next/image";
import { Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_META, type MealCategoryValue } from "./recipeCategoryMeta";

export interface CuratedRecipeSummary {
  id: string;
  name: string;
  description: string | null;
  category: MealCategoryValue | null;
  imageUrl: string | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  caloriesPerServing: number;
  averageRating: number | null;
  ratingCount: number;
}

function RecipeThumbnail({ recipe }: { recipe: CuratedRecipeSummary }) {
  if (recipe.imageUrl) {
    return (
      <Image
        src={recipe.imageUrl}
        alt=""
        width={200}
        height={140}
        unoptimized
        className="h-32 w-full rounded-t-card object-cover"
      />
    );
  }
  const meta = recipe.category ? CATEGORY_META[recipe.category] : CATEGORY_META.LUNCH;
  const Icon = meta.icon;
  return (
    <div className="flex h-32 w-full items-center justify-center rounded-t-card bg-surface-raised">
      <Icon className={cn("h-9 w-9", meta.colorClass)} strokeWidth={1.5} />
    </div>
  );
}

export function CuratedRecipeCard({ recipe }: { recipe: CuratedRecipeSummary }) {
  return (
    <Link href={`/foods/recipes/${recipe.id}`} className="control focus-ring card-surface overflow-hidden">
      <RecipeThumbnail recipe={recipe} />
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-text-primary">{recipe.name}</p>
        <div className="mt-1 flex items-center justify-between text-xs text-text-tertiary">
          <span className="tabular-nums">{recipe.caloriesPerServing} kcal</span>
          {recipe.averageRating !== null ? (
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-accent-warning text-accent-warning" />
              {recipe.averageRating.toFixed(1)}
            </span>
          ) : (
            (recipe.prepMinutes ?? 0) + (recipe.cookMinutes ?? 0) > 0 && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {(recipe.prepMinutes ?? 0) + (recipe.cookMinutes ?? 0)}m
              </span>
            )
          )}
        </div>
      </div>
    </Link>
  );
}
