-- LetsVibeAI expansion: marketplace, lab configs, newsletter media
-- Adds MarketplaceListing, LabConfig; extends NewsletterIssue with slug/videoUrl/audioUrl.

CREATE TABLE "MarketplaceListing" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "installMd" TEXT,
    "sourceUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MarketplaceListing_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MarketplaceListing_slug_key" ON "MarketplaceListing"("slug");
CREATE INDEX "MarketplaceListing_category_idx" ON "MarketplaceListing"("category");

CREATE TABLE "LabConfig" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "runtime" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "runCommand" TEXT NOT NULL,
    "tests" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LabConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LabConfig_lessonId_key" ON "LabConfig"("lessonId");

ALTER TABLE "LabConfig"
    ADD CONSTRAINT "LabConfig_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "NewsletterIssue"
    ADD COLUMN "slug" TEXT,
    ADD COLUMN "videoUrl" TEXT,
    ADD COLUMN "audioUrl" TEXT;

CREATE UNIQUE INDEX "NewsletterIssue_slug_key" ON "NewsletterIssue"("slug");
