-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "servings" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_items" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "recipe_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favourites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favourites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipes_userId_idx" ON "recipes"("userId");

-- CreateIndex
CREATE INDEX "recipe_items_recipeId_idx" ON "recipe_items"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "favourites_userId_foodId_key" ON "favourites"("userId", "foodId");

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_items" ADD CONSTRAINT "recipe_items_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_items" ADD CONSTRAINT "recipe_items_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
