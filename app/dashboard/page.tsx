import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { getAdminClient } from "@/lib/supabase/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Bot,
  FileText,
  Plus,
  GraduationCap,
} from "lucide-react"
import { curriculumModules } from "@/lib/curriculum-data"

export const dynamic = "force-dynamic"

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" }> = {
  draft: { label: "Draft", variant: "secondary" },
  planning: { label: "Planning", variant: "secondary" },
  planned: { label: "Planned", variant: "default" },
  building: { label: "Building", variant: "default" },
  done: { label: "Done", variant: "secondary" },
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  let projects: {
    id: string
    title: string
    status: string
    created_at: string
    contract: { deliverables?: string[] } | null
  }[] = []

  try {
    const admin = getAdminClient()
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", session.user!.email!)
      .maybeSingle()

    if (profile) {
      const { data } = await admin
        .from("builder_projects")
        .select("id, title, status, created_at, contract")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
      projects = data ?? []
    }
  } catch (e) {
    console.error("Dashboard failed to load projects:", e)
  }

  const firstName = session.user?.name?.split(" ")[0] ?? ""

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Your Builder Workspace — plan projects with PAL, then build them with the coach.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/workspace/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Learn</CardTitle>
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Vibe coding curriculum</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {curriculumModules.length} modules, 3 labs, 10-day bootcamp.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/courses">
                Resume Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Projects</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>PAL-planned builds</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-3">{projects.length}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/workspace/new">
                <Sparkles className="mr-2 h-4 w-4" /> Create a project
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Builder Coach</CardTitle>
              <Bot className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Curriculum-aware assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Ask it to break down a milestone or refine a prompt.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/courses">
                <BookOpen className="mr-2 h-4 w-4" /> Browse lessons
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Your Projects</h2>
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Bot className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-medium mb-1">No projects yet</p>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Describe an idea and the PAL compiler will turn it into a plan, milestones, and a project
                contract — then build it with the coach by your side.
              </p>
              <Button asChild>
                <Link href="/workspace/new">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create your first project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const badge = STATUS_BADGE[project.status] ?? STATUS_BADGE.draft
              return (
                <Link href={`/workspace/${project.id}`} key={project.id}>
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5">
                    <CardContent className="p-5 flex flex-col gap-3 h-full">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(project.created_at)}</span>
                      </div>
                      <h3 className="font-semibold leading-snug line-clamp-2">{project.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {project.contract?.deliverables
                          ? `${project.contract.deliverables.length} deliverables`
                          : "No plan yet — generate one"}
                      </p>
                      <p className="mt-auto flex items-center gap-1 text-sm font-medium text-primary">
                        Open workspace <ArrowRight className="h-4 w-4" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
