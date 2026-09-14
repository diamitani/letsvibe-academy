import { db } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ToolBrowser } from "./tool-browser";

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const tools = await db.tool.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      url: true,
      category: true,
      description: true,
      pricing: true,
    },
  });

  const categories = [...new Set(tools.map((t) => t.category))].sort();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Tools"
          title="The AI stack, curated"
          description="The builders, agents, and models the academy teaches with — search and filter to find the right tool for your next build."
        />
        <div className="mt-10">
          <ToolBrowser tools={tools} categories={categories} />
        </div>
      </div>
    </div>
  );
}
