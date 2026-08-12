import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAdminClient } from "@/lib/supabase/admin"
import { coachChat } from "@/lib/pal"

export const dynamic = "force-dynamic"
export const maxDuration = 120

interface RouteContext {
  params: Promise<{ id: string }>
}

// POST /api/workspace/projects/[id]/chat — curriculum-aware coach
export async function POST(request: Request, { params }: RouteContext) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  let body: { message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const message = (body.message ?? "").trim()
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", session.user.email)
    .maybeSingle()
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  const { data: project } = await admin
    .from("builder_projects")
    .select("id, title, brief, pal_plan, contract, status")
    .eq("id", id)
    .eq("user_id", profile.id)
    .maybeSingle()

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  // Persist the user message first
  const { data: userMsg, error: userMsgError } = await admin
    .from("builder_messages")
    .insert({ project_id: id, role: "user", content: message })
    .select("id, role, content, created_at")
    .single()
  if (userMsgError) {
    return NextResponse.json({ error: userMsgError.message }, { status: 500 })
  }

  // Load history for context
  const { data: history } = await admin
    .from("builder_messages")
    .select("role, content")
    .eq("project_id", id)
    .order("created_at", { ascending: true })

  try {
    const reply = await coachChat({
      projectTitle: project.title,
      brief: project.brief,
      plan: project.pal_plan as never,
      contract: project.contract as never,
      history: (history ?? []).map((m) => ({ role: m.role, content: m.content })),
      message,
    })

    const { data: assistantMsg, error: asstError } = await admin
      .from("builder_messages")
      .insert({ project_id: id, role: "assistant", content: reply })
      .select("id, role, content, created_at")
      .single()

    if (asstError) {
      return NextResponse.json({ error: asstError.message }, { status: 500 })
    }

    return NextResponse.json({ userMessage: userMsg, assistantMessage: assistantMsg })
  } catch (e) {
    return NextResponse.json(
      { error: `Coach request failed: ${(e as Error).message}` },
      { status: 502 }
    )
  }
}
