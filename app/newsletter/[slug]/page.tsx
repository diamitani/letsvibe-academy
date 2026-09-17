import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { Markdown } from "@/components/markdown/Markdown";

export const dynamic = "force-dynamic";

export default async function NewsletterIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const issue = await db.newsletterIssue.findUnique({ where: { slug } });
  if (!issue || issue.status !== "sent") notFound();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/newsletter"
          className="text-sm font-semibold text-navy-700 hover:text-navy-900"
        >
          ← All issues
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Badge tone="navy">Weekly Vibe</Badge>
            <span className="text-xs font-medium text-slate-500">
              {issue.sentAt
                ? new Date(issue.sentAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
            {issue.subject}
          </h1>
        </div>

        {issue.videoUrl ? (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Watch
            </h2>
            <div className="mt-3 aspect-video overflow-hidden rounded-2xl bg-slate-900">
              <video
                src={issue.videoUrl}
                controls
                className="h-full w-full"
                preload="metadata"
              />
            </div>
          </div>
        ) : null}

        {issue.audioUrl ? (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Listen
            </h2>
            <audio src={issue.audioUrl} controls className="mt-3 w-full" preload="metadata" />
          </div>
        ) : null}

        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Read
          </h2>
          <Card className="mt-3 p-6 sm:p-8">
            <Markdown>{issue.bodyMd}</Markdown>
          </Card>
        </div>

        <div className="mt-12 rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold">Get it every week</h2>
          <p className="mt-2 text-sm text-navy-100">
            One AI tool, one technique, one idea. Read, watch, or listen. Free.
          </p>
          <div className="mt-4">
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </div>
  );
}
