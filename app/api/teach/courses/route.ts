/**
 * /api/teach/courses
 *  GET  — list courses I created (or ALL courses if my email is in TEACHER_EMAILS)
 *  POST — create a course (createdBy = me)
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireApiUser, isTeacherEmail } from "@/lib/access";
import { courseCreateSchema } from "@/lib/teach-schemas";

function toListItem(c: {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  isFree: boolean;
  isPublished: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  chapters: { _count: { lessons: number } }[];
}) {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    category: c.category,
    level: c.level,
    isFree: c.isFree,
    isPublished: c.isPublished,
    createdBy: c.createdBy,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    chapterCount: c.chapters.length,
    lessonCount: c.chapters.reduce((n, ch) => n + ch._count.lessons, 0),
  };
}

export async function GET() {
  try {
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const allowlisted = isTeacherEmail(me.email);
    const courses = await db.course.findMany({
      where: allowlisted ? undefined : { createdBy: me.id },
      orderBy: { updatedAt: "desc" },
      include: {
        chapters: { select: { _count: { select: { lessons: true } } } },
      },
    });
    return NextResponse.json({ courses: courses.map(toListItem) });
  } catch (e) {
    console.error("GET /api/teach/courses", e);
    return NextResponse.json({ error: "Failed to list courses." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const body = await req.json().catch(() => null);
    const parsed = courseCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid course data.", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const existing = await db.course.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: `Slug "${parsed.data.slug}" is already taken.` },
        { status: 409 },
      );
    }

    const course = await db.course.create({
      data: { ...parsed.data, createdBy: me.id },
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (e) {
    console.error("POST /api/teach/courses", e);
    return NextResponse.json({ error: "Failed to create course." }, { status: 500 });
  }
}
