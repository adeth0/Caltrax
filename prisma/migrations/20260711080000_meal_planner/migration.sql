-- CreateTable
CREATE TABLE "planned_meals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "mealType" "MealType" NOT NULL,
    "foodId" TEXT,
    "servingGrams" DOUBLE PRECISION,
    "recipeId" TEXT,
    "servingsCount" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planned_meals_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "planned_meals_food_xor_recipe" CHECK ((("foodId" IS NOT NULL) AND ("recipeId" IS NULL)) OR (("foodId" IS NULL) AND ("recipeId" IS NOT NULL)))
);

-- CreateIndex
CREATE INDEX "planned_meals_userId_date_idx" ON "planned_meals"("userId", "date");

-- AddForeignKey
ALTER TABLE "planned_meals" ADD CONSTRAINT "planned_meals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planned_meals" ADD CONSTRAINT "planned_meals_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planned_meals" ADD CONSTRAINT "planned_meals_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
