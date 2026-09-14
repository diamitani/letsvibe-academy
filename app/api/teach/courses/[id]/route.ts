/**
 * /api/teach/courses/[id]
 *  GET    — course with chapters + lessons (ordered), teacher-gated
 *  PUT    — update course fields, teacher-gated
 *  DELETE — delete course + chapters + lessons, teacher-gated.
 *           BLOCKED (409) while enrollments, seat assignments, or certificates
 *           reference the course — unpublish instead of deleting learner data.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireApiUser, getCourseForTeacher } from "@/lib/access";
import { courseUpdateSchema } from "@/lib/teach-schemas";

type Ctx = { params: Promise<{ id: string }> }; // Next 16: params is a Promise

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;

    const { course, status } = await getCourseForTeacher(meOr, id);
    if (!course)
      return NextResponse.json(
        { error: status === 404 ? "Course not found." : "Not authorized to view this course." },
        { status },
      );

    const full = await db.course.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { position: "asc" },
          include: { lessons: { orderBy: { position: "asc" } } },
        },
      },
    });
    return NextResponse.json({ course: full });
  } catch (e) {
    console.error("GET /api/teach/courses/[id]", e);
    return NextResponse.json({ error: "Failed to load course." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;

    const { course, status } = await getCourseForTeacher(meOr, id);
    if (!course)
      return NextResponse.json(
        { error: status === 404 ? "Course not found." : "Not authorized to edit this course." },
        { status },
      );

    const body = await req.json().catch(() => null);
    const parsed = courseUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid course data.", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    if (parsed.data.slug && parsed.data.slug !== course.slug) {
      const taken = await db.course.findUnique({
        where: { slug: parsed.data.slug },
        select: { id: true },
      });
      if (taken) {
        return NextResponse.json(
          { error: `Slug "${parsed.data.slug}" is already taken.` },
          { status: 409 },
        );
      }
    }

    const updated = await db.course.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ course: updated });
  } catch (e) {
    console.error("PUT /api/teach/courses/[id]", e);
    return NextResponse.json({ error: "Failed to update course." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;

    const { course, status } = await getCourseForTeacher(meOr, id);
    if (!course)
      return NextResponse.json(
        { error: status === 404 ? "Course not found." : "Not authorized to delete this course." },
        { status },
      );

    // Never silently destroy learner data: block while anything references it.
    const [enrollmentCount, seatCount, certCount] = await Promise.all([
      db.enrollment.count({ where: { courseId: id } }),
      db.seatAssignment.count({ where: { courseId: id } }),
      db.certificate.count({ where: { courseId: id } }),
    ]);
    if (enrollmentCount + seatCount + certCount > 0) {
      return NextResponse.json(
        {
          error:
            `Cannot delete: this course has ${enrollmentCount} enrollment(s), ` +
            `${seatCount} seat assignment(s), and ${certCount} certificate(s). ` +
            "Unpublish the course instead of deleting learner data.",
          counts: { enrollments: enrollmentCount, seatAssignments: seatCount, certificates: certCount },
        },
        { status: 409 },
      );
    }

    // Explicit child deletes (safe regardless of the schema's onDelete rules).
    const chapters = await db.chapter.findMany({
      where: { courseId: id },
      select: { id: true },
    });
    const chapterIds = chapters.map((c) => c.id);
    const lessons = chapterIds.length
      ? await db.lesson.findMany({
          where: { chapterId: { in: chapterIds } },
          select: { id: true },
        })
      : [];
    const lessonIds = lessons.map((l) => l.id);

    await db.$transaction([
      ...(lessonIds.length
        ? [db.progress.deleteMany({ where: { lessonId: { in: lessonIds } } })]
        : []),
      ...(chapterIds.length
        ? [db.lesson.deleteMany({ where: { chapterId: { in: chapterIds } } })]
        : []),
      db.chapter.deleteMany({ where: { courseId: id } }),
      db.course.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/teach/courses/[id]", e);
    return NextResponse.json({ error: "Failed to delete course." }, { status: 500 });
  }
}
