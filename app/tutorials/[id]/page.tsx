import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, GraduationCap } from "lucide-react"
import Link from "next/link"
import SectionRenderer from "@/components/section-renderer"
import { getTutorialById } from "@/lib/tutorial-data"

interface TutorialPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { id } = await params
  const tutorial = getTutorialById(id)

  if (!tutorial) {
    notFound()
  }

  return (
    <div className="container py-12 max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
        <Link href="/tutorials">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All tutorials
        </Link>
      </Button>

      <div className="space-y-4 mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{tutorial.type}</Badge>
          {tutorial.duration && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {tutorial.duration}
            </span>
          )}
          {tutorial.prerequisites && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" /> {tutorial.prerequisites}
            </span>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{tutorial.title}</h1>
      </div>

      <SectionRenderer sections={tutorial.sections} />
    </div>
  )
}
