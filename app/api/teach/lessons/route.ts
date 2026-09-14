/**
 * /api/teach/lessons
 *  POST — create a lesson in a chapter (teacher-gated via the chapter's course).
 *         Position auto-assigned as max+1 within the chapter.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireApiUser, canTeachCourse } from "@/lib/access";
import { lessonCreateSchema } from "@/lib/teach-schemas";

export async function POST(req: NextRequest) {
  try {
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const body = await req.json().catch(() => null);
    const parsed = lessonCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid lesson data.", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const chapter = await db.chapter.findUnique({
      where: { id: parsed.data.chapterId },
      select: {
        id: true,
        course: { select: { id: true, createdBy: true } },
      },
    });
    if (!chapter)
      return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
    if (!canTeachCourse(me, chapter.course.createdBy))
      return NextResponse.json(
        { error: "Not authorized to edit this course." },
        { status: 403 },
      );

    const last = await db.lesson.findFirst({
      where: { chapterId: chapter.id },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const lesson = await db.lesson.create({
      data: {
        chapterId: chapter.id,
        title: parsed.data.title,
        kind: parsed.data.kind,
        contentUrl: parsed.data.contentUrl ?? null,
        bodyMd: parsed.data.bodyMd ?? null,
        durationMin: parsed.data.durationMin ?? null,
        position: last ? last.position + 1 : 0,
      },
    });
    return NextResponse.json({ lesson }, { status: 201 });
  } catch (e) {
    console.error("POST /api/teach/lessons", e);
    return NextResponse.json({ error: "Failed to create lesson." }, { status: 500 });
  }
}
