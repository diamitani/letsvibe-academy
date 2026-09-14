-- LetsVibeAI Academy v2 — convert TEXT+CHECK enum columns to native Postgres
-- enums so they match schema.prisma (Prisma maps its enums to native types,
-- not to TEXT columns). 0001 created TEXT columns; this migrates them in place.
-- The CHECK constraints must be dropped first: Postgres re-validates them on
-- ALTER TYPE and enum = text has no operator.

CREATE TYPE "LessonKind" AS ENUM ('video', 'article', 'quiz', 'lab');
CREATE TYPE "CompanyRole" AS ENUM ('admin', 'member');
CREATE TYPE "ResourceKind" AS ENUM ('article', 'podcast', 'blog', 'course');
CREATE TYPE "IssueStatus" AS ENUM ('draft', 'scheduled', 'sent');

ALTER TABLE "Lesson" DROP CONSTRAINT IF EXISTS "Lesson_kind_check";
ALTER TABLE "Lesson" ALTER COLUMN "kind" TYPE "LessonKind" USING "kind"::"LessonKind";

ALTER TABLE "CompanyMember" DROP CONSTRAINT IF EXISTS "CompanyMember_role_check";
ALTER TABLE "CompanyMember" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "CompanyMember" ALTER COLUMN "role" TYPE "CompanyRole" USING "role"::"CompanyRole";
ALTER TABLE "CompanyMember" ALTER COLUMN "role" SET DEFAULT 'member'::"CompanyRole";

ALTER TABLE "Resource" DROP CONSTRAINT IF EXISTS "Resource_kind_check";
ALTER TABLE "Resource" ALTER COLUMN "kind" TYPE "ResourceKind" USING "kind"::"ResourceKind";

ALTER TABLE "NewsletterIssue" DROP CONSTRAINT IF EXISTS "NewsletterIssue_status_check";
ALTER TABLE "NewsletterIssue" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "NewsletterIssue" ALTER COLUMN "status" TYPE "IssueStatus" USING "status"::"IssueStatus";
ALTER TABLE "NewsletterIssue" ALTER COLUMN "status" SET DEFAULT 'draft'::"IssueStatus";
