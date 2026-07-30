-- CreateEnum
CREATE TYPE "SupplementCategory" AS ENUM ('PROTEIN', 'VITAMIN', 'MINERAL', 'OMEGA3', 'PERFORMANCE', 'OTHER');

-- CreateTable
CREATE TABLE "supplements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" "SupplementCategory" NOT NULL,
    "servingLabel" TEXT NOT NULL,
    "activeIngredient" TEXT NOT NULL,
    "caloriesPerServing" DOUBLE PRECISION,
    "proteinPerServing" DOUBLE PRECISION,
    "summary" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplement_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "supplementId" TEXT NOT NULL,
    "servingsTaken" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplement_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "supplements_category_idx" ON "supplements"("category");

-- CreateIndex
CREATE INDEX "supplement_logs_userId_loggedAt_idx" ON "supplement_logs"("userId", "loggedAt");

-- AddForeignKey
ALTER TABLE "supplement_logs" ADD CONSTRAINT "supplement_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplement_logs" ADD CONSTRAINT "supplement_logs_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "supplements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
