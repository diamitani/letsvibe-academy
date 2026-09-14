import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUser } from "@/lib/supabase/server";

const enrollSchema = z.object({
  courseId: z.string().min(1, "courseId is required"),
});

// Enroll the signed-in user in a course. v1: all courses are free —
// enrollment is one click, no payment.
export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = enrollSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const course = await db.course.findUnique({
    where: { id: parsed.data.courseId },
    select: { id: true, isPublished: true },
  });
  if (!course || !course.isPublished) {
    return NextResponse.json({ ok: false, error: "Course not found" }, { status: 404 });
  }

  await db.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    update: {},
    create: { userId: user.id, courseId: course.id },
  });

  return NextResponse.json({ ok: true });
}
