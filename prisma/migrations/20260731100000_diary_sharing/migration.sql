-- CreateTable
CREATE TABLE "diary_shares" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diary_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "diary_shares_userId_key" ON "diary_shares"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "diary_shares_token_key" ON "diary_shares"("token");

-- AddForeignKey
ALTER TABLE "diary_shares" ADD CONSTRAINT "diary_shares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
