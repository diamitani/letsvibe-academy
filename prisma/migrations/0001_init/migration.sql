-- LetsVibeAI Academy v2 — initial schema
-- Supabase-compatible Postgres. Enums are TEXT with CHECK constraints
-- (keeps the DDL diff-friendly; Prisma maps the TEXT columns to its enums).

-- Enums (TEXT + CHECK)
-- lesson kind: video | article | quiz | lab
-- company role: admin | member
-- resource kind: article | podcast | blog | course
-- issue status: draft | scheduled | sent

CREATE TABLE "Course" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT,
  "category" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "isFree" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Chapter" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseId" TEXT NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "isFreePreview" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Chapter_courseId_position_idx" ON "Chapter"("courseId", "position");

CREATE TABLE "Lesson" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chapterId" TEXT NOT NULL REFERENCES "Chapter"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "kind" TEXT NOT NULL CHECK ("kind" IN ('video','article','quiz','lab')),
  "contentUrl" TEXT,
  "bodyMd" TEXT,
  "position" INTEGER NOT NULL,
  "durationMin" INTEGER,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Lesson_chapterId_position_idx" ON "Lesson"("chapterId", "position");

CREATE TABLE "VideoTrack" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TrackVideo" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "trackId" TEXT NOT NULL REFERENCES "VideoTrack"("id") ON DELETE CASCADE,
  "youtubeId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "creator" TEXT,
  "duration" TEXT,
  "position" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "TrackVideo_trackId_position_idx" ON "TrackVideo"("trackId", "position");

CREATE TABLE "Enrollment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
  "enrolledAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Enrollment_userId_courseId_key" UNIQUE ("userId", "courseId")
);
CREATE INDEX "Enrollment_userId_idx" ON "Enrollment"("userId");

CREATE TABLE "Progress" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL REFERENCES "Lesson"("id") ON DELETE CASCADE,
  "completedAt" TIMESTAMPTZ(6),
  "watchPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Progress_userId_lessonId_key" UNIQUE ("userId", "lessonId")
);
CREATE INDEX "Progress_userId_idx" ON "Progress"("userId");

CREATE TABLE "Company" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CompanyMember" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member' CHECK ("role" IN ('admin','member')),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CompanyMember_companyId_userId_key" UNIQUE ("companyId", "userId")
);
CREATE INDEX "CompanyMember_userId_idx" ON "CompanyMember"("userId");

CREATE TABLE "SeatAssignment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,
  "courseId" TEXT NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SeatAssignment_courseId_userId_key" UNIQUE ("courseId", "userId")
);
CREATE INDEX "SeatAssignment_companyId_idx" ON "SeatAssignment"("companyId");
CREATE INDEX "SeatAssignment_userId_idx" ON "SeatAssignment"("userId");

CREATE TABLE "Certificate" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
  "code" TEXT NOT NULL UNIQUE,
  "issuedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Certificate_userId_courseId_key" UNIQUE ("userId", "courseId")
);
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");

CREATE TABLE "Tool" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT,
  "pricing" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Resource" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "kind" TEXT NOT NULL CHECK ("kind" IN ('article','podcast','blog','course')),
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "source" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Subscriber" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "source" TEXT,
  "subscribedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribedAt" TIMESTAMPTZ(6)
);

CREATE TABLE "NewsletterIssue" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "subject" TEXT NOT NULL,
  "bodyMd" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft' CHECK ("status" IN ('draft','scheduled','sent')),
  "scheduledFor" TIMESTAMPTZ(6),
  "sentAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
