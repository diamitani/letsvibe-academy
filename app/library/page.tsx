import Link from "next/link";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

const kinds = ["all", "article", "podcast", "blog", "course"] as const;
type KindFilter = (typeof kinds)[number];

const kindLabels: Record<KindFilter, string> = {
  all: "All",
  article: "Articles",
  podcast: "Podcasts",
  blog: "Blogs",
  course: "Courses",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind: kindParam } = await searchParams;
  const activeKind: KindFilter = kinds.includes(kindParam as KindFilter)
    ? (kindParam as KindFilter)
    : "all";

  const resources = await db.resource.findMany({
    where: activeKind === "all" ? undefined : { kind: activeKind },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Library"
          title="Go deeper on any topic"
          description="Hand-picked articles, podcasts, blogs, and courses from across the web — everything worth your time in one place."
        />

        {/* Kind filter tabs (query-param links) */}
        <nav aria-label="Resource kind" className="mt-10 flex flex-wrap gap-2">
          {kinds.map((k) => {
            const active = k === activeKind;
            return (
              <Link
                key={k}
                href={k === "all" ? "/library" : `/library?kind=${k}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-navy-900 text-white"
                    : "border border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-900"
                }`}
              >
                {kindLabels[k]}
              </Link>
            );
          })}
        </nav>

        {resources.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-lg font-semibold text-navy-900">
              Nothing here yet
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Try a different category — new resources are added regularly.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <Card key={r.id} className="flex flex-col p-6">
                <Badge tone="sky" className="self-start capitalize">
                  {r.kind}
                </Badge>
                <h3 className="mt-3 text-lg font-bold text-navy-900">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {r.title}{" "}
                    <span aria-hidden="true" className="whitespace-nowrap">
                      ↗
                    </span>
                  </a>
                </h3>
                {r.source ? (
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {r.source}
                  </p>
                ) : null}
                {r.description ? (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {r.description}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
