-- CreateTable
CREATE TABLE "progress_photos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "note" TEXT,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "progress_photos_userId_loggedAt_idx" ON "progress_photos"("userId", "loggedAt");

-- AddForeignKey
ALTER TABLE "progress_photos" ADD CONSTRAINT "progress_photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
