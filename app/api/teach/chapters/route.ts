/**
 * /api/teach/chapters
 *  POST — create a chapter in a course (teacher-gated on the course).
 *         Position auto-assigned as max+1 within the course.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireApiUser, canTeachCourse } from "@/lib/access";
import { chapterCreateSchema } from "@/lib/teach-schemas";

export async function POST(req: NextRequest) {
  try {
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const body = await req.json().catch(() => null);
    const parsed = chapterCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chapter data.", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const course = await db.course.findUnique({
      where: { id: parsed.data.courseId },
      select: { id: true, createdBy: true },
    });
    if (!course)
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    if (!canTeachCourse(me, course.createdBy))
      return NextResponse.json(
        { error: "Not authorized to edit this course." },
        { status: 403 },
      );

    const last = await db.chapter.findFirst({
      where: { courseId: course.id },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const chapter = await db.chapter.create({
      data: {
        courseId: course.id,
        title: parsed.data.title,
        isPublished: parsed.data.isPublished,
        isFreePreview: parsed.data.isFreePreview,
        position: last ? last.position + 1 : 0,
      },
    });
    return NextResponse.json({ chapter }, { status: 201 });
  } catch (e) {
    console.error("POST /api/teach/chapters", e);
    return NextResponse.json({ error: "Failed to create chapter." }, { status: 500 });
  }
}
