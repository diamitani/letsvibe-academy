import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Markdown } from "@/components/markdown/Markdown";

export const dynamic = "force-dynamic";

export default async function MarketplaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const listing = await db.marketplaceListing.findUnique({ where: { slug } });
  if (!listing) notFound();

  const related = await db.marketplaceListing.findMany({
    where: { category: listing.category, slug: { not: listing.slug } },
    take: 3,
    orderBy: { name: "asc" },
    select: { slug: true, name: true, description: true },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/marketplace"
          className="text-sm font-semibold text-navy-700 hover:text-navy-900"
        >
          ← Back to marketplace
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Badge tone="slate">{listing.category}</Badge>
            {listing.featured ? <Badge tone="navy">Featured</Badge> : null}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
            {listing.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {listing.description}
          </p>
        </div>

        {listing.installMd ? (
          <Card className="mt-8 p-6 sm:p-8">
            <Markdown>{listing.installMd}</Markdown>
          </Card>
        ) : null}

        <div className="mt-8 rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold">Learn the skills behind the skill</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy-100">
            The Hermes guide teaches you to author skills like this one:
            frontmatter, structure, and publishing to this marketplace.
          </p>
          <Link
            href="/courses/hermes"
            className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-navy-100"
          >
            Read the Hermes guide →
          </Link>
        </div>

        {related.length > 0 ? (
          <div className="mt-12">
            <SectionHeading
              eyebrow="Related"
              title="More in this category"
              description=""
            />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/marketplace/${r.slug}`}>
                  <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
                    <h3 className="text-lg font-bold text-navy-900">{r.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {r.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
