import Link from "next/link";
import { db } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const issues = await db.newsletterIssue.findMany({
    where: { status: "sent" },
    orderBy: { sentAt: "desc" },
    take: 20,
    select: {
      slug: true,
      subject: true,
      sentAt: true,
      videoUrl: true,
      audioUrl: true,
    },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Newsletter"
          title="The Weekly Vibe"
          description="One AI tool, one technique, one idea, every week. Read it, watch it, or listen to it."
        />

        <div className="mt-8 max-w-xl">
          <NewsletterSignup />
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-navy-900">Recent issues</h2>
          {issues.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-lg font-semibold text-navy-900">
                The first issue is on its way
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Subscribe above and you&apos;ll get it in your inbox every week.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {issues.map((issue) => (
                <Link
                  key={issue.slug ?? issue.subject}
                  href={`/newsletter/${issue.slug}`}
                >
                  <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-2">
                      {issue.videoUrl ? <Badge tone="navy">Video</Badge> : null}
                      {issue.audioUrl ? <Badge tone="slate">Audio</Badge> : null}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-navy-900">
                      {issue.subject}
                    </h3>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      {issue.sentAt
                        ? new Date(issue.sentAt).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </p>
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
