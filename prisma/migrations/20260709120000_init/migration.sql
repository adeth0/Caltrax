-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE');

-- CreateEnum
CREATE TYPE "PrimaryGoal" AS ENUM ('LOSE_FAT', 'BUILD_MUSCLE', 'MAINTAIN_WEIGHT', 'IMPROVE_HEALTH', 'INCREASE_PROTEIN', 'ATHLETIC_PERFORMANCE', 'BODY_RECOMPOSITION');

-- CreateEnum
CREATE TYPE "DietaryPreference" AS ENUM ('NONE', 'VEGETARIAN', 'VEGAN', 'KETO', 'LOW_CARB', 'MEDITERRANEAN');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateEnum
CREATE TYPE "FoodSource" AS ENUM ('OPEN_FOOD_FACTS', 'USDA', 'CUSTOM');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "sex" "Sex" NOT NULL,
    "age" INTEGER NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "targetWeightKg" DOUBLE PRECISION,
    "activityLevel" "ActivityLevel" NOT NULL,
    "primaryGoal" "PrimaryGoal" NOT NULL,
    "targetRateKgPerWeek" DOUBLE PRECISION,
    "dietaryPreference" "DietaryPreference" NOT NULL DEFAULT 'NONE',
    "allergies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "heightUnit" TEXT NOT NULL DEFAULT 'cm',
    "volumeUnit" TEXT NOT NULL DEFAULT 'ml',
    "dailyWaterGoalMl" INTEGER,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foods" (
    "id" TEXT NOT NULL,
    "source" "FoodSource" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "barcode" TEXT,
    "servingSizeG" DOUBLE PRECISION,
    "servingSizeLabel" TEXT,
    "caloriesPer100g" DOUBLE PRECISION NOT NULL,
    "proteinPer100g" DOUBLE PRECISION NOT NULL,
    "carbsPer100g" DOUBLE PRECISION NOT NULL,
    "fatPer100g" DOUBLE PRECISION NOT NULL,
    "fibrePer100g" DOUBLE PRECISION,
    "sugarPer100g" DOUBLE PRECISION,
    "saturatedFatPer100g" DOUBLE PRECISION,
    "sodiumMgPer100g" DOUBLE PRECISION,
    "potassiumMgPer100g" DOUBLE PRECISION,
    "vitaminAPer100g" DOUBLE PRECISION,
    "vitaminCPer100g" DOUBLE PRECISION,
    "vitaminDPer100g" DOUBLE PRECISION,
    "vitaminEPer100g" DOUBLE PRECISION,
    "vitaminKPer100g" DOUBLE PRECISION,
    "calciumMgPer100g" DOUBLE PRECISION,
    "ironMgPer100g" DOUBLE PRECISION,
    "magnesiumMgPer100g" DOUBLE PRECISION,
    "zincMgPer100g" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "mealType" "MealType" NOT NULL,
    "servingQuantity" DOUBLE PRECISION NOT NULL,
    "servingUnitG" DOUBLE PRECISION NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weight_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "bodyFatPct" DOUBLE PRECISION,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weight_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountMl" INTEGER NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "water_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "foods_source_sourceId_key" ON "foods"("source", "sourceId");

-- CreateIndex
CREATE INDEX "foods_barcode_idx" ON "foods"("barcode");

-- CreateIndex
CREATE INDEX "meal_entries_userId_loggedAt_idx" ON "meal_entries"("userId", "loggedAt");

-- CreateIndex
CREATE INDEX "weight_logs_userId_loggedAt_idx" ON "weight_logs"("userId", "loggedAt");

-- CreateIndex
CREATE INDEX "water_logs_userId_loggedAt_idx" ON "water_logs"("userId", "loggedAt");

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_entries" ADD CONSTRAINT "meal_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_entries" ADD CONSTRAINT "meal_entries_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weight_logs" ADD CONSTRAINT "weight_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "water_logs" ADD CONSTRAINT "water_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
