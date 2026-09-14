/**
 * LetsVibeAI Academy v2 — database seed.
 *
 * Loads the legacy content-library.js blob (evaluated with a `window` stub)
 * and upserts it into Postgres via Prisma. Safe to re-run: every write is
 * keyed on a unique field (upsert where the schema has one, findFirst +
 * create/update on the stable natural keys elsewhere).
 *
 * Run: npm run seed   (tsx scripts/seed-letsvibeai.ts)
 * Requires: DATABASE_URL / DIRECT_URL set and `prisma generate` run.
 */
import { PrismaClient } from "@prisma/client";
import { loadLibrary, buildSeedPlan } from "./seed-plan.mjs";

// Local literals so this file compiles even before `prisma generate` runs.
type LessonKindValue = "video" | "article" | "quiz" | "lab";
type ResourceKindValue = "article" | "podcast" | "blog" | "course";

const prisma = new PrismaClient();

async function main() {
  const plan = buildSeedPlan(loadLibrary());

  // ---- Courses -> Chapters -> Lessons
  for (const c of plan.courses) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        description: c.description,
        imageUrl: (c as { imageUrl?: string }).imageUrl ?? null,
        category: c.category,
        level: c.level,
        isPublished: c.isPublished,
        isFree: c.isFree,
      },
      create: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        imageUrl: (c as { imageUrl?: string }).imageUrl ?? null,
        category: c.category,
        level: c.level,
        isPublished: c.isPublished,
        isFree: c.isFree,
      },
    });

    for (const ch of c.chapters) {
      const existingChapter = await prisma.chapter.findFirst({
        where: { courseId: course.id, position: ch.position },
      });
      const chapter = existingChapter
        ? await prisma.chapter.update({
            where: { id: existingChapter.id },
            data: { title: ch.title, isPublished: ch.isPublished, isFreePreview: ch.isFreePreview },
          })
        : await prisma.chapter.create({
            data: {
              courseId: course.id,
              position: ch.position,
              title: ch.title,
              isPublished: ch.isPublished,
              isFreePreview: ch.isFreePreview,
            },
          });

      for (const l of ch.lessons) {
        const data = {
          title: l.title,
          kind: l.kind as LessonKindValue,
          contentUrl: l.contentUrl ?? null,
          bodyMd: l.bodyMd ?? null,
          durationMin: l.durationMin ?? null,
        };
        const existingLesson = await prisma.lesson.findFirst({
          where: { chapterId: chapter.id, position: l.position },
        });
        if (existingLesson) {
          await prisma.lesson.update({ where: { id: existingLesson.id }, data });
        } else {
          await prisma.lesson.create({ data: { chapterId: chapter.id, position: l.position, ...data } });
        }
      }
    }
  }

  // ---- VideoTracks -> TrackVideos
  for (const t of plan.tracks) {
    const track = await prisma.videoTrack.upsert({
      where: { slug: t.slug },
      update: { title: t.title, description: t.description },
      create: { slug: t.slug, title: t.title, description: t.description },
    });
    for (const v of t.videos) {
      const data = {
        youtubeId: v.youtubeId,
        title: v.title,
        creator: v.creator ?? null,
        duration: v.duration ?? null,
      };
      const existing = await prisma.trackVideo.findFirst({
        where: { trackId: track.id, position: v.position },
      });
      if (existing) {
        await prisma.trackVideo.update({ where: { id: existing.id }, data });
      } else {
        await prisma.trackVideo.create({ data: { trackId: track.id, position: v.position, ...data } });
      }
    }
  }

  // ---- Resources (idempotent on kind + url)
  for (const r of plan.resources) {
    const existing = await prisma.resource.findFirst({
      where: { kind: r.kind as ResourceKindValue, url: r.url },
    });
    const data = {
      kind: r.kind as ResourceKindValue,
      title: r.title,
      url: r.url,
      source: r.source ?? null,
      description: r.description ?? null,
    };
    if (existing) {
      await prisma.resource.update({ where: { id: existing.id }, data });
    } else {
      await prisma.resource.create({ data });
    }
  }

  // ---- Tools (idempotent on name + url)
  for (const t of plan.tools) {
    const existing = await prisma.tool.findFirst({ where: { name: t.name, url: t.url } });
    const data = {
      name: t.name,
      url: t.url,
      category: t.category,
      description: t.description ?? null,
      pricing: t.pricing ?? null,
    };
    if (existing) {
      await prisma.tool.update({ where: { id: existing.id }, data });
    } else {
      await prisma.tool.create({ data });
    }
  }

  const [courses, chapters, lessons, tracks, videos, resources, tools] = await Promise.all([
    prisma.course.count(),
    prisma.chapter.count(),
    prisma.lesson.count(),
    prisma.videoTrack.count(),
    prisma.trackVideo.count(),
    prisma.resource.count(),
    prisma.tool.count(),
  ]);
  console.log(
    `Seed complete: ${courses} courses, ${chapters} chapters, ${lessons} lessons, ` +
      `${tracks} tracks, ${videos} track videos, ${resources} resources, ${tools} tools.`
  );
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
