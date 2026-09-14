import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUser } from "@/lib/supabase/server";

const issueSchema = z.object({
  courseId: z.string().min(1, "courseId is required"),
});

const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function makeCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

// Issue (or re-fetch) the completion certificate for the signed-in user.
// Requires 100% completion of all lessons in published chapters.
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

  const parsed = issueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { courseId } = parsed.data;

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        include: { lessons: { select: { id: true } } },
      },
    },
  });
  if (!course) {
    return NextResponse.json({ ok: false, error: "Course not found" }, { status: 404 });
  }

  const lessonIds = course.chapters.flatMap((c) => c.lessons.map((l) => l.id));
  if (lessonIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Course has no lessons yet" },
      { status: 400 }
    );
  }

  const completedCount = await db.progress.count({
    where: {
      userId: user.id,
      lessonId: { in: lessonIds },
      completedAt: { not: null },
    },
  });
  if (completedCount < lessonIds.length) {
    return NextResponse.json(
      {
        ok: false,
        error: `Course not complete: ${completedCount}/${lessonIds.length} lessons done`,
      },
      { status: 400 }
    );
  }

  // Idempotent: one certificate per (user, course).
  const existing = await db.certificate.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  });
  if (existing) {
    return NextResponse.json({ ok: true, code: existing.code });
  }

  // Generate a unique 10-char code, retrying on the (very rare) collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const certificate = await db.certificate.create({
        data: { userId: user.id, courseId, code: makeCode() },
      });
      return NextResponse.json({ ok: true, code: certificate.code });
    } catch (error) {
      // Prisma unique-violation (P2002) — duck-typed so this stays robust
      // even without the generated client types at hand.
      const prismaError = error as { code?: string } | null;
      if (prismaError?.code === "P2002") {
        // Code collision (or a racing duplicate issue) — re-check first.
        const raced = await db.certificate.findUnique({
          where: { userId_courseId: { userId: user.id, courseId } },
        });
        if (raced) return NextResponse.json({ ok: true, code: raced.code });
        continue;
      }
      throw error;
    }
  }

  return NextResponse.json(
    { ok: false, error: "Could not generate a unique certificate code" },
    { status: 500 }
  );
}
