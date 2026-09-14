/**
 * Server-authoritative per-member progress computation for the company dashboard.
 *
 * IMPORTANT: completion % is ALWAYS computed here on the server from Progress
 * rows — never trusted from the client. The company page renders these numbers
 * read-only.
 */
import { db } from "@/lib/db"; // sibling-owned Prisma client

export type EnrollmentProgress = {
  courseId: string;
  courseTitle: string;
  enrolledAt: Date;
  totalLessons: number;
  completedLessons: number;
  pct: number; // 0–100, rounded
};

export type MemberProgress = {
  userId: string;
  enrollments: EnrollmentProgress[];
};

export async function getMembersProgress(
  memberIds: string[],
): Promise<MemberProgress[]> {
  if (memberIds.length === 0) return [];

  const enrollments = await db.enrollment.findMany({
    where: { userId: { in: memberIds } },
    include: { course: { select: { id: true, title: true } } },
    orderBy: { enrolledAt: "desc" },
  });

  const courseIds = [...new Set(enrollments.map((e) => e.courseId))];

  // Lesson ids per course (one query per course — fine for v1 member counts).
  const lessonsByCourse = new Map<string, string[]>();
  for (const courseId of courseIds) {
    const lessons = await db.lesson.findMany({
      where: { chapter: { courseId } },
      select: { id: true },
    });
    lessonsByCourse.set(
      courseId,
      lessons.map((l) => l.id),
    );
  }

  // Completed progress rows, batched per course.
  const completedByUserCourse = new Map<string, number>(); // `${userId}:${courseId}` -> count
  for (const courseId of courseIds) {
    const lessonIds = lessonsByCourse.get(courseId) ?? [];
    if (lessonIds.length === 0) continue;
    const rows = await db.progress.findMany({
      where: {
        userId: { in: memberIds },
        lessonId: { in: lessonIds },
        completedAt: { not: null },
      },
      select: { userId: true, lessonId: true },
    });
    for (const r of rows) {
      const key = `${r.userId}:${courseId}`;
      completedByUserCourse.set(key, (completedByUserCourse.get(key) ?? 0) + 1);
    }
  }

  return memberIds.map((userId) => ({
    userId,
    enrollments: enrollments
      .filter((e) => e.userId === userId)
      .map((e) => {
        const total = lessonsByCourse.get(e.courseId)?.length ?? 0;
        const completed =
          completedByUserCourse.get(`${userId}:${e.courseId}`) ?? 0;
        return {
          courseId: e.courseId,
          courseTitle: e.course.title,
          enrolledAt: e.enrolledAt,
          totalLessons: total,
          completedLessons: completed,
          pct: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      }),
  }));
}
