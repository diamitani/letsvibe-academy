"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ArrowLeft,
  Bot,
  FileText,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  ListChecks,
  Wrench,
  HelpCircle,
  TriangleAlert,
} from "lucide-react"
import Link from "next/link"
import type { PalPlan, ProjectContract } from "@/lib/pal"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

interface Project {
  id: string
  title: string
  brief: string
  status: string
  pal_plan: PalPlan | null
  contract: ProjectContract | null
  created_at: string
  updated_at: string
}

function PlanPanel({ plan }: { plan: PalPlan }) {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="summary">
        <AccordionTrigger>Summary</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">{plan.summary}</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="intent">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Primary intent
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Verb:</span> {plan.primary_intent.verb}</li>
            <li><span className="font-medium text-foreground">Object:</span> {plan.primary_intent.object}</li>
            <li><span className="font-medium text-foreground">Domain:</span> {plan.primary_intent.domain}</li>
            <li><span className="font-medium text-foreground">Desired output:</span> {plan.primary_intent.desired_output}</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="users">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Who it serves
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1">
            {plan.users.map((u) => (
              <li key={u} className="text-sm text-muted-foreground">• {u}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="success">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" /> Success criteria
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1">
            {plan.success_criteria.map((s) => (
              <li key={s} className="text-sm text-muted-foreground">• {s}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="milestones">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Milestones
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {plan.milestones.map((m, i) => (
              <div key={i} className="rounded-lg border p-3">
                <p className="font-medium text-sm">
                  {i + 1}. {m.title}
                </p>
                <ul className="mt-2 space-y-1">
                  {m.tasks.map((t) => (
                    <li key={t} className="text-sm text-muted-foreground">• {t}</li>
                  ))}
                </ul>
                {m.depends_on.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">Depends on: {m.depends_on.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="stack">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" /> Stack recommendation
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">{plan.stack_recommendation}</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="unknowns">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" /> Open questions
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1">
            {plan.unknown_unknowns.map((u) => (
              <li key={u} className="text-sm text-muted-foreground">• {u}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function ContractPanel({ contract }: { contract: ProjectContract }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-1">Scope</p>
        <p className="text-sm text-muted-foreground">{contract.scope}</p>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Non-goals</p>
        <ul className="space-y-1">
          {contract.non_goals.map((n) => (
            <li key={n} className="text-sm text-muted-foreground">• {n}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Deliverables</p>
        <ul className="space-y-1">
          {contract.deliverables.map((d) => (
            <li key={d} className="text-sm text-muted-foreground">• {d}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
        <p className="text-sm font-medium flex items-center gap-2 mb-1">
          <ShieldCheck className="h-4 w-4 text-amber-500" /> Approval gates
        </p>
        <ul className="space-y-1">
          {contract.approval_gates.map((g) => (
            <li key={g} className="text-sm text-muted-foreground">• {g}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-medium flex items-center gap-2 mb-1">
          <TriangleAlert className="h-4 w-4 text-primary" /> Risks
        </p>
        <ul className="space-y-2">
          {contract.risks.map((r) => (
            <li key={r.risk} className="text-sm text-muted-foreground">
              • {r.risk} <span className="text-xs text-primary">— {r.mitigation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const STATUS_BADGE: Record<string, string> = {
  draft: "Draft",
  planning: "Planning…",
  planned: "Planned",
  building: "Building",
  done: "Done",
}

export default function WorkspacePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [generating, setGenerating] = useState(false)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const loadProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/workspace/projects/${params.id}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Failed to load project")
        return
      }
      setProject(data.project)
      setMessages(data.messages ?? [])
    } catch {
      setError("Network error loading project.")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadProject()
  }, [loadProject])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending])

  const generatePlan = async () => {
    setGenerating(true)
    setError("")
    try {
      const res = await fetch(`/api/workspace/projects/${params.id}/pal`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Plan generation failed")
        return
      }
      if (data.project) {
        setProject(data.project)
      }
    } catch {
      setError("Plan generation failed — check your connection.")
    } finally {
      setGenerating(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const message = input.trim()
    if (!message || sending) return
    setInput("")
    setSending(true)
    setError("")
    // optimistic user message
    const optimistic: Message = { id: `tmp-${Date.now()}`, role: "user", content: message, created_at: new Date().toISOString() }
    setMessages((prev) => [...prev, optimistic])
    try {
      const res = await fetch(`/api/workspace/projects/${params.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Coach request failed")
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
        return
      }
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimistic.id),
        data.userMessage,
        data.assistantMessage,
      ])
    } catch {
      setError("Network error — try again.")
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="container py-24 text-center space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
      </div>
    )
  }

  if (!project) return null

  const hasPlan = !!project.pal_plan && !!project.contract

  return (
    <div className="container py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight truncate">{project.title}</h1>
          <Badge variant={project.status === "planned" ? "default" : "secondary"}>
            {STATUS_BADGE[project.status] ?? project.status}
          </Badge>
        </div>
        {hasPlan && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/courses")}>
              <FileText className="mr-2 h-4 w-4" /> Review lessons
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                const res = await fetch(`/api/workspace/projects/${project.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: project.status === "building" ? "planned" : "building" }),
                })
                if (res.ok) {
                  const data = await res.json()
                  setProject((p) => (p ? { ...p, status: data.project.status } : p))
                }
              }}
            >
              {project.status === "building" ? "Pause build" : "Start building"}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg p-3 mb-6">
          {error}
        </p>
      )}

      {!hasPlan ? (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Turn this brief into a plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.brief}</p>
            <p className="text-sm text-muted-foreground">
              The PAL compiler will extract your intent, shape it into milestones with a recommended stack,
              and produce a project contract with approval gates — so nothing silently expands scope.
            </p>
            <Button onClick={generatePlan} disabled={generating} className="w-full" size="lg">
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compiling your plan…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate PAL plan & contract
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Brief</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.brief}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> PAL plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlanPanel plan={project.pal_plan} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Project contract
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContractPanel contract={project.contract} />
              </CardContent>
            </Card>
          </div>

          <Card className="flex flex-col h-fit lg:sticky lg:top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" /> Builder Coach
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Curriculum-aware coaching on your plan. Ask what to do next, or paste a prompt and get it refined.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Start building. Try: “What should I do first for milestone 1?” or “Help me write the first prompt for my landing page.”
                    </p>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground self-end rounded-br-sm"
                        : "bg-muted self-start rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                {sending && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground self-start bg-muted rounded-2xl px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin" /> Coach is thinking…
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <Textarea
                  placeholder="Ask the coach…"
                  className="min-h-[60px] resize-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage(e)
                    }
                  }}
                  disabled={sending}
                />
                <Button type="submit" size="icon" className="h-auto w-12 shrink-0" disabled={sending || !input.trim()} aria-label="Send">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
