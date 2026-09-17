/**
 * LetsVibeAI — seed tool guides from seed-data/guides/*.json.
 *
 * Each JSON file: { slug, title, description, category, level, chapters: [...] }
 * Upserts as Course (category='guide') -> Chapter -> Lesson(kind='article').
 * Safe to re-run: keyed on slug + position.
 *
 * Run: npx tsx scripts/seed-guides.ts
 * Requires: DATABASE_URL / DIRECT_URL set and `prisma generate` run.
 */
import { PrismaClient } from "@prisma/client";
import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const guidesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "seed-data", "guides");

type GuideLesson = {
  title: string;
  kind: string;
  bodyMd: string;
  position: number;
  durationMin?: number;
};
type GuideChapter = { title: string; position: number; lessons: GuideLesson[] };
type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  chapters: GuideChapter[];
};

async function main() {
  const files = readdirSync(guidesDir).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} guide(s).`);

  for (const file of files) {
    const guide: Guide = JSON.parse(readFileSync(join(guidesDir, file), "utf8"));
    console.log(`Seeding guide: ${guide.slug} (${guide.chapters.length} chapters)`);

    const course = await prisma.course.upsert({
      where: { slug: guide.slug },
      update: {
        title: guide.title,
        description: guide.description,
        category: "guide",
        level: guide.level,
        isPublished: true,
        isFree: true,
      },
      create: {
        slug: guide.slug,
        title: guide.title,
        description: guide.description,
        category: "guide",
        level: guide.level,
        isPublished: true,
        isFree: true,
      },
    });

    for (const ch of guide.chapters) {
      const existing = await prisma.chapter.findFirst({
        where: { courseId: course.id, position: ch.position },
      });
      const chapter = existing
        ? await prisma.chapter.update({
            where: { id: existing.id },
            data: { title: ch.title, isPublished: true, isFreePreview: true },
          })
        : await prisma.chapter.create({
            data: {
              courseId: course.id,
              position: ch.position,
              title: ch.title,
              isPublished: true,
              isFreePreview: true,
            },
          });

      for (const l of ch.lessons) {
        const data = {
          title: l.title,
          kind: "article" as const,
          bodyMd: l.bodyMd,
          durationMin: l.durationMin ?? null,
        };
        const existingLesson = await prisma.lesson.findFirst({
          where: { chapterId: chapter.id, position: l.position },
        });
        if (existingLesson) {
          await prisma.lesson.update({ where: { id: existingLesson.id }, data });
        } else {
          await prisma.lesson.create({
            data: { chapterId: chapter.id, position: l.position, ...data },
          });
        }
      }
    }
    console.log(`  done: ${guide.slug}`);
  }

  console.log("All guides seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
