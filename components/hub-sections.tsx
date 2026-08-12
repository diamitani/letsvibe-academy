import HubCard from "@/components/hub-card"
import {
  GraduationCap,
  Wrench,
  PlayCircle,
  FileText,
  BookOpenCheck,
  Library,
  Mail,
  Bot,
} from "lucide-react"
import { curriculumModules, projectLabs, bootcampDays } from "@/lib/curriculum-data"
import { directoryTools } from "@/lib/ai-directory-data"
import { tutorials } from "@/lib/tutorial-data"
import { blogPosts } from "@/lib/blog-data"

export default function HubSections() {
  return (
    <section className="container py-8 md:py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Everything you need to vibe code</h2>
        <p className="text-muted-foreground text-lg">
          Learn the craft, pick your tools, and build real projects.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <HubCard
          title="Learn"
          description={`${curriculumModules.length} modules, ${projectLabs.length} project labs, and a ${bootcampDays.length}-day bootcamp.`}
          href="/courses"
          icon={GraduationCap}
          meta={`${curriculumModules.length} modules`}
          accent="bg-violet-500/10 text-violet-500"
        />
        <HubCard
          title="AI Tools Directory"
          description="Discover 820+ free AI tools across every category — and our curated custom GPTs."
          href="/tools"
          icon={Wrench}
          meta={`${directoryTools.length}+ tools`}
          accent="bg-emerald-500/10 text-emerald-500"
        />
        <HubCard
          title="Tutorials"
          description="Hands-on lessons: news briefings, how-to labs, and tool guides."
          href="/tutorials"
          icon={BookOpenCheck}
          meta={`${tutorials.length} lessons`}
          accent="bg-sky-500/10 text-sky-500"
        />
        <HubCard
          title="Articles"
          description="LiveBuildAI briefings and vibe coding guides."
          href="/blog"
          icon={FileText}
          meta={`${blogPosts.length} posts`}
          accent="bg-amber-500/10 text-amber-500"
        />
        <HubCard
          title="Videos"
          description="Watch the latest AI videos and channels."
          href="/videos"
          icon={PlayCircle}
          meta="Channels & videos"
          accent="bg-rose-500/10 text-rose-500"
        />
        <HubCard
          title="Resources Hub"
          description="Courses, YouTube channels, platforms, and feeds to keep learning."
          href="/resources"
          icon={Library}
          meta="35+ resources"
          accent="bg-indigo-500/10 text-indigo-500"
        />
        <HubCard
          title="Newsletter"
          description="Get the best of vibe coding in your inbox."
          href="/newsletter"
          icon={Mail}
          meta="Free"
          accent="bg-teal-500/10 text-teal-500"
        />
        <HubCard
          title="Builder Workspace"
          description="Plan and build your project with the PAL-powered workspace."
          href="/dashboard"
          icon={Bot}
          meta="Coming soon"
          accent="bg-fuchsia-500/10 text-fuchsia-500"
        />
      </div>
    </section>
  )
}
