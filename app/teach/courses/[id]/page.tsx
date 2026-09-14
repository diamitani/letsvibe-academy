/**
 * Course editor (server component): course fields form, chapter list with
 * add/reorder/publish/delete, and per-chapter lesson management.
 *
 * Access: logged-in user who is the course's createdBy OR in TEACHER_EMAILS.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireSessionUser, canTeachCourse } from "@/lib/access";
import CourseEditForm from "./_components/course-edit-form";
import ChapterManager from "./_components/chapter-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit course — LetsVibeAI Academy" };

export default async function TeachCourseEditorPage({
  params,
}: {
  params: Promise<{ id: string }>; // Next 16: params is a Promise
}) {
  const { id } = await params;
  const me = await requireSessionUser();

  const course = await db.course.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { position: "asc" },
        include: { lessons: { orderBy: { position: "asc" } } },
      },
    },
  });
  if (!course) notFound();
  if (!canTeachCourse(me, course.createdBy)) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-xl font-bold text-slate-900">Not authorized</h1>
          <p className="mt-2 text-sm text-slate-500">
            Only the course creator or an allowlisted teacher (TEACHER_EMAILS) can
            edit this course.
          </p>
          <Link href="/teach" className="mt-4 inline-block text-sm font-semibold text-[#0B2545] hover:underline">
            ← Back to Teach
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0B2545] text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Link href="/teach" className="text-sm text-blue-200 hover:text-white">
            ← All courses
          </Link>
          <h1 className="mt-2 truncate text-2xl font-bold">{course.title}</h1>
          <p className="mt-1 text-sm text-blue-200">
            <span className="font-mono">/{course.slug}</span>
            {" · "}
            {course.isPublished ? "Published" : "Draft"}
            {" · "}
            {course.isFree ? "Free" : "Paid"}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <CourseEditForm
          courseId={course.id}
          initial={{
            title: course.title,
            slug: course.slug,
            description: course.description,
            category: course.category,
            level: course.level,
            isFree: course.isFree,
            isPublished: course.isPublished,
          }}
        />
        <ChapterManager courseId={course.id} chapters={course.chapters} />
      </main>
    </div>
  );
}
