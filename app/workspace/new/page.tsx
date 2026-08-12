"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [brief, setBrief] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/workspace/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, brief }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Failed to create project")
        setSubmitting(false)
        return
      }
      router.push(`/workspace/${data.project.id}`)
    } catch {
      setError("Network error — try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-12 max-w-2xl">
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </Button>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
        <p className="text-muted-foreground">
          Describe what you want to build. The PAL compiler turns your brief into a plan and a contract.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Project brief
            </CardTitle>
            <CardDescription>Be specific — the better the brief, the better the plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project title</Label>
              <Input
                id="title"
                placeholder="e.g. Landing page for my music coaching business"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brief">What do you want to build?</Label>
              <Textarea
                id="brief"
                placeholder="Who is it for? What should it do? What does success look like? Any constraints (budget, time, no-code preference)?"
                className="min-h-[180px]"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground text-right">{brief.length} characters (min 20)</p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg p-3">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Create project & generate plan
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
