import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getUser } from "@/lib/supabase/server";
import {
  ClaimCertificateButton,
  EnrollButton,
  LabChecklist,
  MarkCompleteButton,
} from "./course-actions";

export const dynamic = "force-dynamic";

type LessonKind = "video" | "article" | "quiz" | "lab";

const KIND_BADGE: Record<LessonKind, string> = {
  video: "bg-blue-100 text-blue-800",
  article: "bg-slate-100 text-slate-700",
  quiz: "bg-amber-100 text-amber-800",
  lab: "bg-emerald-100 text-emerald-800",
};

// Convert a YouTube watch/shorts/share URL into an embeddable URL.
function toEmbedUrl(contentUrl: string | null): string | null {
  if (!contentUrl) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtube\.com\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = contentUrl.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-[#0B2545] transition-all"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { slug } = await params;
  const { lesson: lessonParam } = await searchParams;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
        include: { lessons: { orderBy: { position: "asc" } } },
      },
    },
  });
  if (!course || !course.isPublished) notFound();

  const user = await getUser();
  const enrollment = user
    ? await db.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      })
    : null;

  const allLessons = course.chapters.flatMap((c) => c.lessons);

  let progressByLesson = new Map<string, boolean>();
  if (user && allLessons.length > 0) {
    const rows = await db.progress.findMany({
      where: {
        userId: user.id,
        lessonId: { in: allLessons.map((l) => l.id) },
      },
      select: { lessonId: true, completedAt: true },
    });
    progressByLesson = new Map(
      rows.map((r) => [r.lessonId, r.completedAt !== null])
    );
  }

  const completedCount = allLessons.filter((l) =>
    progressByLesson.get(l.id)
  ).length;
  const pct =
    allLessons.length === 0
      ? 0
      : Math.round((completedCount / allLessons.length) * 100);

  const selectedLesson =
    allLessons.find((l) => l.id === lessonParam) ?? allLessons[0] ?? null;

  const embedUrl = selectedLesson ? toEmbedUrl(selectedLesson.contentUrl) : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Course header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#0B2545]">
            <span>{course.category}</span>
            {course.level && (
              <>
                <span className="text-slate-300">·</span>
                <span>{course.level}</span>
              </>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{course.title}</h1>
          <p className="mt-2 max-w-3xl text-slate-600">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {!user ? (
              <Link
                href="/login"
                className="rounded-xl bg-[#0B2545] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#12325E]"
              >
                Sign in to enroll
              </Link>
            ) : enrollment ? (
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Your progress</span>
                  <span className="font-semibold text-[#0B2545]">{pct}%</span>
                </div>
                <div className="mt-2">
                  <ProgressBar pct={pct} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {completedCount} of {allLessons.length} lessons complete
                </p>
              </div>
            ) : (
              <EnrollButton courseId={course.id} />
            )}
          </div>

          {user && enrollment && pct === 100 && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="font-semibold text-emerald-900">
                🎉 You finished this course!
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                Claim your certificate of completion.
              </p>
              <div className="mt-3">
                <ClaimCertificateButton courseId={course.id} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Chapter accordion */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-slate-900">Curriculum</h2>
            <div className="mt-4 space-y-3">
              {course.chapters.map((chapter, chapterIndex) => (
                <details
                  key={chapter.id}
                  open={chapter.lessons.some((l) => l.id === selectedLesson?.id)}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <summary className="cursor-pointer list-none rounded-2xl px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Chapter {chapterIndex + 1}
                    </p>
                    <p className="mt-0.5 font-semibold text-slate-900">
                      {chapter.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {chapter.lessons.filter((l) => progressByLesson.get(l.id)).length}/
                      {chapter.lessons.length} complete
                    </p>
                  </summary>
                  <ul className="border-t border-slate-100 px-2 py-2">
                    {chapter.lessons.map((lesson) => {
                      const isSelected = lesson.id === selectedLesson?.id;
                      const isDone = progressByLesson.get(lesson.id) ?? false;
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/courses/${course.slug}?lesson=${lesson.id}`}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                              isSelected
                                ? "bg-[#0B2545]/10 font-semibold text-[#0B2545]"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                                isDone
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-slate-300 text-transparent"
                              }`}
                              aria-label={isDone ? "Completed" : "Not completed"}
                            >
                              ✓
                            </span>
                            <span className="flex-1 truncate">{lesson.title}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                KIND_BADGE[(lesson.kind as LessonKind) ?? "article"]
                              }`}
                            >
                              {lesson.kind}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}
              {course.chapters.length === 0 && (
                <p className="text-sm text-slate-500">
                  Curriculum coming soon.
                </p>
              )}
            </div>
          </div>

          {/* Lesson viewer */}
          <div className="lg:col-span-2">
            {!selectedLesson ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <p className="text-sm text-slate-500">
                  No lessons published yet — check back soon.
                </p>
              </div>
            ) : (
              <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${
                      KIND_BADGE[(selectedLesson.kind as LessonKind) ?? "article"]
                    }`}
                  >
                    {selectedLesson.kind}
                  </span>
                  {selectedLesson.durationMin != null && (
                    <span className="text-xs text-slate-500">
                      ~{selectedLesson.durationMin} min
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  {selectedLesson.title}
                </h2>

                <div className="mt-6">
                  {selectedLesson.kind === "video" ? (
                    embedUrl ? (
                      <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
                        <iframe
                          src={embedUrl}
                          title={selectedLesson.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : selectedLesson.contentUrl ? (
                      <a
                        href={selectedLesson.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-xl bg-[#0B2545] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#12325E]"
                      >
                        Watch video ↗
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Video coming soon.
                      </p>
                    )
                  ) : selectedLesson.kind === "lab" ? (
                    <>
                      {selectedLesson.bodyMd && (
                        <>
                          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                            Instructions
                          </h3>
                          <div className="mt-2 whitespace-pre-line text-slate-700">
                            {selectedLesson.bodyMd}
                          </div>
                        </>
                      )}
                      <LabChecklist bodyMd={selectedLesson.bodyMd} />
                    </>
                  ) : (
                    selectedLesson.bodyMd && (
                      <div className="whitespace-pre-line text-slate-700">
                        {selectedLesson.bodyMd}
                      </div>
                    )
                  )}
                  {selectedLesson.kind === "quiz" && (
                    <p className="mt-2 text-sm text-slate-500">
                      Interactive quizzes are coming soon — mark this lesson complete
                      once you&apos;ve reviewed the material.
                    </p>
                  )}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  {user && enrollment ? (
                    <MarkCompleteButton
                      lessonId={selectedLesson.id}
                      completed={progressByLesson.get(selectedLesson.id) ?? false}
                    />
                  ) : user ? (
                    <div id="enroll-cta">
                      <EnrollButton courseId={course.id} />
                      <p className="mt-2 text-xs text-slate-500">
                        Enroll to track your progress and earn a certificate.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      <Link
                        href="/login"
                        className="font-semibold text-[#0B2545] hover:underline"
                      >
                        Sign in and enroll
                      </Link>{" "}
                      to track your progress and earn a certificate.
                    </p>
                  )}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
