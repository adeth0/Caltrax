-- AlterTable
ALTER TABLE "exercises" ADD COLUMN "userId" TEXT;

-- CreateIndex
CREATE INDEX "exercises_userId_idx" ON "exercises"("userId");

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
