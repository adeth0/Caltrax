import { CuratedRecipeCard, type CuratedRecipeSummary } from "./CuratedRecipeCard";
import { RecipesClient, type RecipeSummary } from "./RecipesClient";

interface MyRecipesClientProps {
  savedRecipes: CuratedRecipeSummary[];
  createdRecipes: RecipeSummary[];
}

/**
 * "My Recipes" -- two distinct sections rather than one merged list,
 * since a saved (bookmarked) curated recipe and one you've actually
 * created are meaningfully different things: a save is a link to
 * someone else's recipe, a created one is yours to edit or delete.
 * Both are still just one screen away from being logged.
 */
export function MyRecipesClient({ savedRecipes, createdRecipes }: MyRecipesClientProps) {
  const isEmpty = savedRecipes.length === 0 && createdRecipes.length === 0;

  if (isEmpty) {
    return (
      <p className="py-8 text-center text-sm text-text-tertiary">
        Nothing here yet — save a meal from &quot;Find meals&quot; or create your own recipe below.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {savedRecipes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Saved ({savedRecipes.length})
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {savedRecipes.map((recipe) => (
              <CuratedRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      <div>
        {savedRecipes.length > 0 && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Created by you ({createdRecipes.length})
          </p>
        )}
        <RecipesClient recipes={createdRecipes} />
      </div>
    </div>
  );
}
