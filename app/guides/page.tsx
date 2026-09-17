import { db } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";
import { CourseBrowser } from "../courses/course-browser";

export const dynamic = "force-dynamic";

const GUIDE_META: Record<string, { tagline: string }> = {
  "claude-code": { tagline: "Anthropic's agentic coding assistant" },
  hermes: { tagline: "The skill framework behind this marketplace" },
  openclaw: { tagline: "Open-source AI agent framework" },
  antigravity: { tagline: "Google's agentic IDE" },
  n8n: { tagline: "Open-source workflow automation" },
  make: { tagline: "Visual automation scenarios" },
  gumloop: { tagline: "No-code AI workflows" },
};

export default async function GuidesPage() {
  const courses = await db.course.findMany({
    where: { isPublished: true, category: "guide" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      level: true,
      chapters: {
        where: { isPublished: true },
        select: { _count: { select: { lessons: true } } },
      },
    },
  });

  const data = courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    // Subtitle: the curated tagline when one exists, otherwise the guide's
    // real description — never the raw "guide" category string.
    category: GUIDE_META[c.slug]?.tagline ?? c.description,
    level: c.level,
    lessonCount: c.chapters.reduce((sum, ch) => sum + ch._count.lessons, 0),
  }));

  const categories = [...new Set(data.map((c) => c.category))].sort();
  const levels = [...new Set(data.map((c) => c.level))].sort();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Tool Guides"
          title="Master the tools that build with AI"
          description="Practical, hands-on guides to the coding assistants, agent frameworks, and automation platforms shaping how software gets built. Learn a tool, then practice it in the labs."
        />
        <div className="mt-10">
          <CourseBrowser
            courses={data}
            categories={categories}
            levels={levels}
            searchPlaceholder="Search guides…"
          />
        </div>
        <CtaBand />
      </div>
    </div>
  );
}
