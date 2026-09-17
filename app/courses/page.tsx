import { db } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";
import { CourseBrowser } from "./course-browser";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      level: true,
      chapters: {
        where: { isPublished: true },
        select: {
          _count: { select: { lessons: true } },
        },
      },
    },
  });

  const data = courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    category: c.category,
    level: c.level,
    lessonCount: c.chapters.reduce((sum, ch) => sum + ch._count.lessons, 0),
  }));

  const categories = [...new Set(data.map((c) => c.category))].sort();
  const levels = [...new Set(data.map((c) => c.level))].sort();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Courses"
          title="Guided courses, from zero to shipping"
          description="Structured, step-by-step courses with chapters and hands-on lessons. Free to enroll."
        />
        <div className="mt-10">
          <CourseBrowser
            courses={data}
            categories={categories}
            levels={levels}
          />
        </div>
        <CtaBand />
      </div>
    </div>
  );
}
