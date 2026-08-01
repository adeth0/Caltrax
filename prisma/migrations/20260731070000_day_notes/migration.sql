-- CreateTable
CREATE TABLE "day_notes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "day_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "day_notes_userId_date_key" ON "day_notes"("userId", "date");

-- AddForeignKey
ALTER TABLE "day_notes" ADD CONSTRAINT "day_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
