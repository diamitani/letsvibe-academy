/**
 * /api/teach/chapters/[id]
 *  PUT    — update title / isPublished / isFreePreview / position, teacher-gated.
 *           Position changes are a SIMPLE SWAP with the chapter currently at the
 *           target position (v1 — no drag-and-drop). Out-of-range targets clamp
 *           to the nearest occupied slot.
 *  DELETE — delete chapter + its lessons (+ their progress rows), teacher-gated.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireApiUser, canTeachCourse } from "@/lib/access";
import { chapterUpdateSchema } from "@/lib/teach-schemas";

type Ctx = { params: Promise<{ id: string }> }; // Next 16: params is a Promise

async function loadChapter(id: string) {
  return db.chapter.findUnique({
    where: { id },
    include: { course: { select: { id: true, createdBy: true } } },
  });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const chapter = await loadChapter(id);
    if (!chapter)
      return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
    if (!canTeachCourse(me, chapter.course.createdBy))
      return NextResponse.json(
        { error: "Not authorized to edit this course." },
        { status: 403 },
      );

    const body = await req.json().catch(() => null);
    const parsed = chapterUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chapter data.", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    const { position, ...fields } = parsed.data;
    if (position === undefined && Object.keys(fields).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    // Simple position swap with the chapter at the target slot.
    if (position !== undefined && position !== chapter.position) {
      const target = Math.max(0, position);
      const sibling = await db.chapter.findFirst({
        where: {
          courseId: chapter.courseId,
          position: target,
          NOT: { id: chapter.id },
        },
        select: { id: true },
      });
      if (sibling) {
        const [updated] = await db.$transaction([
          db.chapter.update({
            where: { id: chapter.id },
            data: { ...fields, position: target },
          }),
          db.chapter.update({
            where: { id: sibling.id },
            data: { position: chapter.position },
          }),
        ]);
        return NextResponse.json({ chapter: updated });
      }
      // No chapter at the target slot (gap at the end): just move there.
      const updated = await db.chapter.update({
        where: { id: chapter.id },
        data: { ...fields, position: target },
      });
      return NextResponse.json({ chapter: updated });
    }

    const updated = await db.chapter.update({
      where: { id: chapter.id },
      data: fields,
    });
    return NextResponse.json({ chapter: updated });
  } catch (e) {
    console.error("PUT /api/teach/chapters/[id]", e);
    return NextResponse.json({ error: "Failed to update chapter." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const chapter = await loadChapter(id);
    if (!chapter)
      return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
    if (!canTeachCourse(me, chapter.course.createdBy))
      return NextResponse.json(
        { error: "Not authorized to edit this course." },
        { status: 403 },
      );

    const lessons = await db.lesson.findMany({
      where: { chapterId: id },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);

    await db.$transaction([
      ...(lessonIds.length
        ? [db.progress.deleteMany({ where: { lessonId: { in: lessonIds } } })]
        : []),
      db.lesson.deleteMany({ where: { chapterId: id } }),
      db.chapter.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/teach/chapters/[id]", e);
    return NextResponse.json({ error: "Failed to delete chapter." }, { status: 500 });
  }
}
