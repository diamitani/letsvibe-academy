import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

// GET /api/workspace/projects — list the current user's projects
export async function GET() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", session.user.email)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ projects: [] })
  }

  const { data, error } = await admin
    .from("builder_projects")
    .select("id, title, brief, status, created_at, updated_at, contract")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ projects: data })
}

// POST /api/workspace/projects — create a project from a brief
export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { title?: string; brief?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const title = (body.title ?? "").trim()
  const brief = (body.brief ?? "").trim()
  if (!title || !brief) {
    return NextResponse.json({ error: "Title and brief are required" }, { status: 400 })
  }
  if (brief.length < 20) {
    return NextResponse.json({ error: "Brief should be at least 20 characters — describe what you want to build." }, { status: 400 })
  }

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", session.user.email)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: "Profile not found — complete onboarding first" }, { status: 404 })
  }

  const { data, error } = await admin
    .from("builder_projects")
    .insert({ user_id: profile.id, title, brief, status: "draft" })
    .select("id, title, brief, status, created_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ project: data }, { status: 201 })
}
