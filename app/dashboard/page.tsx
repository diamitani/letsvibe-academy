import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  BookOpen,
  Code,
  ArrowRight,
  Sparkles,
  Beaker,
  FileText,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{session.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Continue your AI-building journey. Pick up where you left off or start something new.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Learning Path</CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Continue the vibe coding curriculum</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/learn">
                Resume Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Projects</CardTitle>
              <Code className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Your workspace projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/projects">
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Labs</CardTitle>
              <Beaker className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Hands-on practice labs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/labs">
                Start a Lab <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">New Project</CardTitle>
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Start with a PAL plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/projects/new">
                Create Project <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Learning Progress</CardTitle>
              <Badge variant="secondary">Free Plan</Badge>
            </div>
            <CardDescription>
              Start the six-module curriculum to build your AI skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">0 / 6 modules</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-2 rounded-full bg-primary" style={{ width: "0%" }} />
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/learn">
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>
              No projects yet. Create your first AI-powered project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                Turn an idea into a structured project plan with our PAL builder, then build it in a safe sandbox.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/projects/new">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}