import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EnrollmentWithCourse = Awaited<
  ReturnType<typeof fetchEnrollments>
>[number];

async function fetchEnrollments(userId: string) {
  return db.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          chapters: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
            include: { lessons: { orderBy: { position: "asc" } } },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-[#0B2545]"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

function EnrollmentCard({
  enrollment,
  completedCount,
  totalLessons,
}: {
  enrollment: EnrollmentWithCourse;
  completedCount: number;
  totalLessons: number;
}) {
  const pct = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  const { course } = enrollment;
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0B2545]">
            {course.category}
            {course.level ? ` · ${course.level}` : ""}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{course.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.description}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            pct === 100
              ? "bg-emerald-100 text-emerald-800"
              : "bg-[#0B2545]/10 text-[#0B2545]"
          }`}
        >
          {pct === 100 ? "Completed" : `${pct}%`}
        </span>
      </div>
      <div className="mt-4">
        <ProgressBar pct={pct} />
        <p className="mt-2 text-xs text-slate-500">
          {completedCount} of {totalLessons} lessons complete
        </p>
      </div>
    </Link>
  );
}

export default async function AcademyPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const [enrollments, completedRows, certificates] = await Promise.all([
    fetchEnrollments(user.id),
    db.progress.findMany({
      where: { userId: user.id, completedAt: { not: null } },
      select: { lessonId: true },
    }),
    db.certificate.findMany({
      where: { userId: user.id },
      include: { course: { select: { title: true, slug: true } } },
      orderBy: { issuedAt: "desc" },
    }),
  ]);

  const completedSet = new Set(completedRows.map((r) => r.lessonId));

  const withProgress = enrollments.map((enrollment) => {
    const lessons = enrollment.course.chapters.flatMap((c) => c.lessons);
    const completedCount = lessons.filter((l) => completedSet.has(l.id)).length;
    const pct = lessons.length === 0 ? 0 : (completedCount / lessons.length) * 100;
    return { enrollment, completedCount, totalLessons: lessons.length, pct };
  });

  const inProgress = withProgress.filter((w) => w.pct > 0 && w.pct < 100);
  const notStarted = withProgress.filter((w) => w.pct === 0);
  const completed = withProgress.filter((w) => w.pct === 100);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Academy</h1>
            <p className="mt-1 text-sm text-slate-500">
              Pick up where you left off.
            </p>
          </div>
          <Link
            href="/courses"
            className="rounded-xl bg-[#0B2545] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#12325E]"
          >
            Browse courses
          </Link>
        </div>

        {withProgress.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              You&apos;re not enrolled in anything yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              All courses are free — enroll in one click and start learning.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-block rounded-xl bg-[#0B2545] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#12325E]"
            >
              Find a course
            </Link>
          </div>
        ) : (
          <>
            {inProgress.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-slate-900">In progress</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {inProgress.map((w) => (
                    <EnrollmentCard
                      key={w.enrollment.id}
                      enrollment={w.enrollment}
                      completedCount={w.completedCount}
                      totalLessons={w.totalLessons}
                    />
                  ))}
                </div>
              </section>
            )}

            {notStarted.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-slate-900">Not started</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {notStarted.map((w) => (
                    <EnrollmentCard
                      key={w.enrollment.id}
                      enrollment={w.enrollment}
                      completedCount={w.completedCount}
                      totalLessons={w.totalLessons}
                    />
                  ))}
                </div>
              </section>
            )}

            {completed.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-slate-900">Completed</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {completed.map((w) => (
                    <EnrollmentCard
                      key={w.enrollment.id}
                      enrollment={w.enrollment}
                      completedCount={w.completedCount}
                      totalLessons={w.totalLessons}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">My certificates</h2>
          {certificates.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No certificates yet — finish a course to earn one.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <Link
                  key={cert.id}
                  href={`/certificates/${cert.code}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {cert.course.title}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    Code: {cert.code}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Issued{" "}
                    {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <span className="mt-3 inline-block text-xs font-semibold text-[#0B2545] hover:underline">
                    View & verify →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
