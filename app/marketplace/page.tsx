import { db } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarketplaceBrowser } from "./marketplace-browser";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const listings = await db.marketplaceListing.findMany({
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      category: true,
      featured: true,
    },
  });

  const categories = [...new Set(listings.map((l) => l.category))].sort();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Marketplace"
          title="Skills that ship with you"
          description="Reusable agent skills from the Hermes library — install them into Claude Code, Cursor, or any agent and put what you learned into practice."
        />
        <div className="mt-10">
          <MarketplaceBrowser listings={listings} categories={categories} />
        </div>
      </div>
    </div>
  );
}
