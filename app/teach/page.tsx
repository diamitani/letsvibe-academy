/**
 * Teacher dashboard (server component).
 *
 * Access: logged-in users only. Lists courses the user created — or ALL courses
 * if the user's email is in the TEACHER_EMAILS allowlist (see lib/access.ts).
 */
import Link from "next/link";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireSessionUser, isTeacherEmail } from "@/lib/access";
import NewCourseForm from "./_components/new-course-form";
import PublishToggle from "./_components/publish-toggle";

export const dynamic = "force-dynamic";

export const metadata = { title: "Teach — LVAI Academy" };

export default async function TeachDashboardPage() {
  const me = await requireSessionUser();
  const allowlisted = isTeacherEmail(me.email);

  const courses = await db.course.findMany({
    where: allowlisted ? undefined : { createdBy: me.id },
    orderBy: { updatedAt: "desc" },
    include: {
      chapters: { select: { _count: { select: { lessons: true } } } },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0B2545] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold">Teach</h1>
            <p className="mt-1 text-sm text-blue-200">
              {allowlisted
                ? "Allowlisted teacher — you can see and edit all courses."
                : "Your courses. Publish when ready."}
            </p>
          </div>
          <Link href="/" className="text-sm text-blue-200 hover:text-white">
            ← Site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex justify-end">
          <NewCourseForm />
        </div>

        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">No courses yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Click “New course” to create your first one, then add chapters and lessons.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {courses.map((c) => {
              const chapterCount = c.chapters.length;
              const lessonCount = c.chapters.reduce(
                (n, ch) => n + ch._count.lessons,
                0,
              );
              return (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/teach/courses/${c.id}`}
                        className="truncate text-base font-bold text-slate-900 hover:text-[#0B2545]"
                      >
                        {c.title}
                      </Link>
                      <PublishToggle kind="course" id={c.id} initial={c.isPublished} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      <span className="font-mono">/{c.slug}</span>
                      {" · "}
                      {c.category} · {c.level} · {c.isFree ? "Free" : "Paid"}
                      {" · "}
                      {chapterCount} chapter{chapterCount === 1 ? "" : "s"} ·{" "}
                      {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Link
                    href={`/teach/courses/${c.id}`}
                    className="shrink-0 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#0B2545] hover:text-[#0B2545]"
                  >
                    Edit
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
