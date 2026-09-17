import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getUser } from "@/lib/supabase/server";
import { EnrollButton } from "@/app/courses/[slug]/course-actions";

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

// Onboarding recommender for first-time users: the Vibe Coding
// Foundations guide plus the top guides as first steps.
// Returns null when the recommendation query fails — callers render
// an honest fallback instead of fake data.
async function fetchStartHere() {
  try {
    const select = {
      id: true,
      slug: true,
      title: true,
      description: true,
      level: true,
    } as const;
    const [foundation, topGuides] = await Promise.all([
      db.course.findUnique({
        where: { slug: "vibe-coding-foundations" },
        select,
      }),
      db.course.findMany({
        where: {
          isPublished: true,
          category: "guide",
          slug: { not: "vibe-coding-foundations" },
        },
        orderBy: { createdAt: "asc" },
        take: 3,
        select,
      }),
    ]);
    const picks = [foundation, ...topGuides].filter(
      (g): g is NonNullable<typeof foundation> => g != null
    );
    return picks.slice(0, 4);
  } catch {
    return null;
  }
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

function StartHereCard({
  guide,
  isFoundation,
}: {
  guide: { id: string; slug: string; title: string; description: string; level: string };
  isFoundation: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
        isFoundation ? "border-[#0B2545] ring-1 ring-[#0B2545]/20" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {isFoundation && (
            <span className="mb-2 inline-block rounded-full bg-[#0B2545] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              Start here
            </span>
          )}
          <h3 className="text-base font-bold text-slate-900">
            <Link href={`/courses/${guide.slug}`} className="hover:underline">
              {guide.title}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{guide.description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {guide.level}
        </span>
        <EnrollButton courseId={guide.id} />
      </div>
    </div>
  );
}

export default async function AcademyPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  // The whole page is DB-backed. If the database is unreachable, say so
  // honestly instead of throwing a raw 500.
  let enrollments: EnrollmentWithCourse[] = [];
  let completedRows: { lessonId: string }[] = [];
  let certificates: {
    id: string;
    code: string;
    issuedAt: Date;
    course: { title: string; slug: string };
  }[] = [];
  let dbError = false;
  try {
    [enrollments, completedRows, certificates] = await Promise.all([
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
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-900">My Academy</h1>
          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              We can&apos;t load your academy right now
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              The database is temporarily unreachable. Your enrollments and
              progress are safe — please refresh or try again in a few minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // First-time users get a "start here" recommender instead of an empty shelf.
  const startHere =
    enrollments.length === 0 ? await fetchStartHere() : null;

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
          <>
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

            {startHere && startHere.length > 0 ? (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-slate-900">Start here</h2>
                <p className="mt-1 text-sm text-slate-500">
                  New to vibe coding? These are the first steps we recommend —
                  enroll with one click.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {startHere.map((guide, i) => (
                    <StartHereCard
                      key={guide.id}
                      guide={guide}
                      isFoundation={i === 0 && guide.slug === "vibe-coding-foundations"}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <p className="mt-8 text-center text-sm text-slate-500">
                Recommendations are unavailable right now —{" "}
                <Link href="/guides" className="font-semibold text-[#0B2545] hover:underline">
                  browse the tool guides
                </Link>{" "}
                to get started.
              </p>
            )}
          </>
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
