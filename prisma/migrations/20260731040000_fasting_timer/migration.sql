-- CreateTable
CREATE TABLE "fasting_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "targetHours" INTEGER,

    CONSTRAINT "fasting_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fasting_sessions_userId_startedAt_idx" ON "fasting_sessions"("userId", "startedAt");

-- AddForeignKey
ALTER TABLE "fasting_sessions" ADD CONSTRAINT "fasting_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
