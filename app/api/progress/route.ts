import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUser } from "@/lib/supabase/server";

const progressSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required"),
  completed: z.boolean(),
});

// Record lesson progress for the signed-in user.
// Server-authoritative: the lesson must exist, and the user must be enrolled
// in its course — auto-enroll applies since all v1 courses are free.
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

  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { lessonId, completed } = parsed.data;

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { select: { courseId: true } } },
  });
  if (!lesson) {
    return NextResponse.json({ ok: false, error: "Lesson not found" }, { status: 404 });
  }

  // Auto-enroll: all v1 courses are free, so progress implies enrollment.
  await db.enrollment.upsert({
    where: {
      userId_courseId: { userId: user.id, courseId: lesson.chapter.courseId },
    },
    update: {},
    create: { userId: user.id, courseId: lesson.chapter.courseId },
  });

  const progress = await db.progress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: {
      completedAt: completed ? new Date() : null,
      watchPct: completed ? 100 : undefined,
    },
    create: {
      userId: user.id,
      lessonId,
      completedAt: completed ? new Date() : null,
      watchPct: completed ? 100 : 0,
    },
  });

  return NextResponse.json({ ok: true, completedAt: progress.completedAt });
}
