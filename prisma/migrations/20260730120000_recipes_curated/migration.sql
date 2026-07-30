-- CreateEnum
CREATE TYPE "MealCategory" AS ENUM ('BREAKFAST', 'BRUNCH', 'LUNCH', 'TEA', 'SNACK');

-- CreateEnum
CREATE TYPE "RecipeSource" AS ENUM ('CURATED', 'USER');

-- AlterTable: userId becomes optional (curated recipes belong to no one),
-- and every new descriptive/display field for a real recipe.
ALTER TABLE "recipes" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "recipes" ADD COLUMN "source" "RecipeSource" NOT NULL DEFAULT 'USER';
ALTER TABLE "recipes" ADD COLUMN "description" TEXT;
ALTER TABLE "recipes" ADD COLUMN "category" "MealCategory";
ALTER TABLE "recipes" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "recipes" ADD COLUMN "prepMinutes" INTEGER;
ALTER TABLE "recipes" ADD COLUMN "cookMinutes" INTEGER;

-- AlterTable
ALTER TABLE "recipe_items" ADD COLUMN "displayLabel" TEXT;

-- CreateTable
CREATE TABLE "recipe_steps" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "durationSeconds" INTEGER,

    CONSTRAINT "recipe_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ratings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipe_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_recipes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipe_steps_recipeId_idx" ON "recipe_steps"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ratings_userId_recipeId_key" ON "recipe_ratings"("userId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_recipes_userId_recipeId_key" ON "saved_recipes"("userId", "recipeId");

-- CreateIndex
CREATE INDEX "recipes_source_category_idx" ON "recipes"("source", "category");

-- AddForeignKey
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ratings" ADD CONSTRAINT "recipe_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ratings" ADD CONSTRAINT "recipe_ratings_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
