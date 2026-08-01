-- CreateTable
CREATE TABLE "goal_presets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryGoal" "PrimaryGoal" NOT NULL,
    "activityLevel" "ActivityLevel" NOT NULL,
    "dietaryPreference" "DietaryPreference" NOT NULL,
    "targetWeightKg" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_presets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "goal_presets_userId_name_key" ON "goal_presets"("userId", "name");

-- AddForeignKey
ALTER TABLE "goal_presets" ADD CONSTRAINT "goal_presets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
