import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";

export const dynamic = "force-dynamic";

const stages = [
  {
    stage: "Stage 1",
    title: "Learn the fundamentals",
    body: "Work through Modules 1–3 of the Vibe Coding Masterclass and pick up the mindset, vocabulary, and workflow that make AI-assisted building click.",
    cta: { label: "Start with the fundamentals", href: "/courses" },
  },
  {
    stage: "Stage 2",
    title: "Follow guided tutorials",
    body: "Watch real builders ship in the Cursor, Claude Code, and app-builder video tracks — narrated end-to-end so you can follow along.",
    cta: { label: "Browse video tracks", href: "/tracks" },
  },
  {
    stage: "Stage 3",
    title: "Build the three labs",
    body: "Put it into practice with the hands-on labs. You finish with real portfolio pieces you built yourself, not just notes.",
    cta: { label: "See the labs", href: "/courses" },
  },
  {
    stage: "Stage 4",
    title: "Go deeper, stay current",
    body: "Dig into the library of articles, podcasts, and blogs, and keep your stack sharp with the AI tools directory and the weekly newsletter.",
    cta: { label: "Explore the library", href: "/library" },
  },
];

export default async function Home() {
  const [courseCount, trackCount, toolCount, videoCount, tracks, resources, tools] =
    await Promise.all([
      db.course.count({ where: { isPublished: true } }),
      db.videoTrack.count(),
      db.tool.count(),
      db.trackVideo.count(),
      db.videoTrack.findMany({
        orderBy: { createdAt: "asc" },
        take: 3,
        include: { _count: { select: { videos: true } } },
      }),
      db.resource.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      db.tool.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

  const stats = [
    { value: `${courseCount}`, label: "Guided courses" },
    { value: `${videoCount}`, label: "Curated videos" },
    { value: `${toolCount}`, label: "AI tools" },
    { value: "Free", label: "Forever plan" },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-navy-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge tone="navy" className="text-xs font-semibold">
              Free forever · Learn by building
            </Badge>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
              Anyone can build with AI. Here&apos;s the path.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
              LetsVibeAI Academy takes you from zero to shipping: structured
              courses, narrated video tracks, hands-on labs, a deep resource
              library, and the best AI tools — no coding background required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" href="/courses">
                Start learning free
              </Button>
              <Button size="lg" variant="outline" href="/tracks">
                Browse tracks
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
              {stats.map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm shadow-sm"
                >
                  <span className="font-bold text-navy-900">{s.value}</span>
                  <span className="text-slate-600">{s.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4-stage path */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="The path"
          title="Four stages from curious to shipping"
          description="A clear, linear route through everything in the academy — you always know what comes next."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s, i) => (
            <Card key={s.stage} className="flex flex-col p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="mt-4 text-xs font-bold tracking-[0.18em] text-sky-600 uppercase">
                {s.stage}
              </p>
              <h3 className="mt-1 text-lg font-bold text-navy-900">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {s.body}
              </p>
              <Link
                href={s.cta.href}
                className="mt-4 text-sm font-semibold text-navy-700 hover:text-navy-900"
              >
                {s.cta.label} →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Tracks preview */}
      <section className="border-y border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Video tracks"
              title="Watch real builders ship"
              description={`${trackCount} curated tracks of narrated build walkthroughs.`}
            />
            <Button variant="outline" href="/tracks">
              All tracks →
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tracks.map((t) => (
              <Link key={t.id} href={`/tracks/${t.slug}`}>
                <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
                  <h3 className="text-lg font-bold text-navy-900">{t.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {t.description}
                  </p>
                  <div className="mt-4">
                    <Badge tone="navy">
                      {t._count.videos} video{t._count.videos === 1 ? "" : "s"}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Library preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Library"
            title="A deep bench of reading & listening"
            description="Articles, podcasts, blogs, and courses — hand-picked so you can go deeper on any topic."
          />
          <Button variant="outline" href="/library">
            Full library →
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r) => (
            <Card key={r.id} className="flex flex-col p-5">
              <Badge tone="sky" className="self-start capitalize">
                {r.kind}
              </Badge>
              <h3 className="mt-3 text-base font-bold text-navy-900">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {r.title} ↗
                </a>
              </h3>
              {r.source ? (
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {r.source}
                </p>
              ) : null}
              {r.description ? (
                <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-3">
                  {r.description}
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      </section>

      {/* Tools preview */}
      <section className="border-y border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Tools"
              title="The AI stack, curated"
              description="The builders, agents, and models the academy teaches with — one directory to explore."
            />
            <Button variant="outline" href="/tools">
              All tools →
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <Card key={t.id} className="flex flex-col p-5">
                <h3 className="text-base font-bold text-navy-900">{t.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone="slate">{t.category}</Badge>
                  {t.pricing ? (
                    <span className="text-xs font-medium text-slate-500">
                      {t.pricing}
                    </span>
                  ) : null}
                </div>
                {t.description ? (
                  <p className="mt-3 flex-1 text-sm text-slate-600 line-clamp-3">
                    {t.description}
                  </p>
                ) : null}
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-sm font-semibold text-navy-700 hover:text-navy-900"
                >
                  Visit site ↗
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Card className="mx-auto max-w-2xl p-8 text-center sm:p-10">
          <SectionHeading
            eyebrow="Newsletter"
            title="Stay current without the noise"
            description="One email a week: what changed in AI building, new tracks and courses, and the best new tools. Free forever, unsubscribe anytime."
          />
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterSignup />
          </div>
        </Card>
      </section>
    </div>
  );
}
