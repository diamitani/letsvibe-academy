import Link from "next/link";
import { db } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function LabsPage() {
  const labs = await db.lesson.findMany({
    where: { labConfig: { isNot: null } },
    orderBy: { position: "asc" },
    select: {
      id: true,
      title: true,
      labConfig: { select: { runtime: true } },
      chapter: {
        select: {
          title: true,
          course: { select: { title: true, slug: true } },
        },
      },
    },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Labs"
          title="Learn by doing"
          description="Interactive coding labs that run in a secure sandbox. Write code, run it, and get instant feedback — no setup required."
        />
        <div className="mt-10">
          {labs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-lg font-semibold text-navy-900">
                Labs are being built
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Interactive labs are coming to the guides soon. Check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {labs.map((lab) => (
                <Link
                  key={lab.id}
                  href={`/courses/${lab.chapter.course.slug}?lesson=${lab.id}`}
                >
                  <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <Badge tone="navy">Lab</Badge>
                      <Badge tone="slate">{lab.labConfig?.runtime}</Badge>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-navy-900">
                      {lab.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {lab.chapter.course.title} · {lab.chapter.title}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-navy-700">
                      Open lab →
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
