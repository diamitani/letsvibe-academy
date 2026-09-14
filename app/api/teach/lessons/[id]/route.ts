/**
 * /api/teach/lessons/[id]
 *  PUT    — update lesson fields (title, kind, contentUrl, bodyMd, durationMin),
 *           teacher-gated via the chapter's course.
 *  DELETE — delete the lesson and its progress rows, teacher-gated.
 *
 * NOTE: Lesson has no isPublished flag in the v1 schema contract — visibility
 * is inherited from the chapter/course publish state.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireApiUser, canTeachCourse } from "@/lib/access";
import { lessonUpdateSchema } from "@/lib/teach-schemas";

type Ctx = { params: Promise<{ id: string }> }; // Next 16: params is a Promise

async function loadLesson(id: string) {
  return db.lesson.findUnique({
    where: { id },
    include: {
      chapter: {
        select: { course: { select: { id: true, createdBy: true } } },
      },
    },
  });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const lesson = await loadLesson(id);
    if (!lesson)
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    if (!canTeachCourse(me, lesson.chapter.course.createdBy))
      return NextResponse.json(
        { error: "Not authorized to edit this course." },
        { status: 403 },
      );

    const body = await req.json().catch(() => null);
    const parsed = lessonUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid lesson data.", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const data: Record<string, unknown> = { ...parsed.data };
    // Normalize "" -> null for cleared optional fields.
    for (const k of ["contentUrl", "bodyMd", "durationMin"]) {
      if (k in data && (data[k] === undefined || data[k] === "")) data[k] = null;
    }

    const updated = await db.lesson.update({ where: { id }, data });
    return NextResponse.json({ lesson: updated });
  } catch (e) {
    console.error("PUT /api/teach/lessons/[id]", e);
    return NextResponse.json({ error: "Failed to update lesson." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const lesson = await loadLesson(id);
    if (!lesson)
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    if (!canTeachCourse(me, lesson.chapter.course.createdBy))
      return NextResponse.json(
        { error: "Not authorized to edit this course." },
        { status: 403 },
      );

    await db.$transaction([
      db.progress.deleteMany({ where: { lessonId: id } }),
      db.lesson.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/teach/lessons/[id]", e);
    return NextResponse.json({ error: "Failed to delete lesson." }, { status: 500 });
  }
}
