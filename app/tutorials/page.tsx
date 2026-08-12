import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Clock, GraduationCap } from "lucide-react"
import { tutorials } from "@/lib/tutorial-data"

export default function TutorialsPage() {
  return (
    <div className="container py-12">
      <div className="space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Tutorials</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Hands-on lessons from the LiveBuildAI content library — news briefings, how-to labs, and tool
          guides that turn AI news into building skills.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial) => (
          <Link href={`/tutorials/${tutorial.id}`} key={tutorial.id}>
            <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{tutorial.type}</Badge>
                  {tutorial.duration && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {tutorial.duration}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg leading-snug">{tutorial.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {tutorial.prerequisites && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <GraduationCap className="h-3.5 w-3.5" /> {tutorial.prerequisites}
                  </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tutorial.sections[0]?.items[0] ?? ""}
                </p>
                <p className="flex items-center gap-1 text-sm font-medium text-primary mt-4">
                  Start lesson <ArrowRight className="h-4 w-4" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
