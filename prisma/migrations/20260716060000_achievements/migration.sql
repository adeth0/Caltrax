-- CreateTable
CREATE TABLE "unlocked_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unlocked_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unlocked_achievements_userId_key_key" ON "unlocked_achievements"("userId", "key");

-- AddForeignKey
ALTER TABLE "unlocked_achievements" ADD CONSTRAINT "unlocked_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
