import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

interface RouteContext {
  params: Promise<{ id: string }>
}

async function getOwnedProject(admin: ReturnType<typeof getAdminClient>, projectId: string, userId: string) {
  const { data } = await admin
    .from("builder_projects")
    .select("id, title, brief, status, pal_plan, contract, created_at, updated_at")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle()
  return data
}

// GET /api/workspace/projects/[id] — project + chat history
export async function GET(_request: Request, { params }: RouteContext) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const admin = getAdminClient()

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", session.user.email)
    .maybeSingle()
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  const project = await getOwnedProject(admin, id, profile.id)
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const { data: messages, error: msgError } = await admin
    .from("builder_messages")
    .select("id, role, content, created_at")
    .eq("project_id", id)
    .order("created_at", { ascending: true })

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 })
  }

  return NextResponse.json({ project, messages })
}

// PATCH /api/workspace/projects/[id] — update status or title
export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  let body: { status?: string; title?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
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

  const existing = await getOwnedProject(admin, id, profile.id)
  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const updates: Record<string, unknown> = {}
  if (body.status !== undefined) {
    const allowed = ["draft", "planning", "planned", "building", "done"]
    if (!allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }
    updates.status = body.status
  }
  if (body.title !== undefined) {
    updates.title = (body.title as string).trim()
  }

  const { data, error } = await admin
    .from("builder_projects")
    .update(updates)
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("id, title, status, updated_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ project: data })
}

// DELETE /api/workspace/projects/[id]
export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", session.user.email)
    .maybeSingle()
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  const { error } = await admin.from("builder_projects").delete().eq("id", id).eq("user_id", profile.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
