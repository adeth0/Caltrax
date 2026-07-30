-- AlterTable
ALTER TABLE "recipes" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: existing (and future) CURATED recipes are always considered
-- published -- the isPublished flag only meaningfully applies to USER
-- recipes, which are private by default.
UPDATE "recipes" SET "isPublished" = true WHERE "source" = 'CURATED';

-- CreateIndex
CREATE INDEX "recipes_source_isPublished_idx" ON "recipes"("source", "isPublished");
