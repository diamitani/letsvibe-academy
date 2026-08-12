import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAdminClient } from "@/lib/supabase/admin"
import { compilePalPlan } from "@/lib/pal"

export const dynamic = "force-dynamic"
export const maxDuration = 120

interface RouteContext {
  params: Promise<{ id: string }>
}

// POST /api/workspace/projects/[id]/pal — run PAL compilation on the brief
export async function POST(_request: Request, { params }: RouteContext) {
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

  const { data: project, error: fetchError } = await admin
    .from("builder_projects")
    .select("id, title, brief, status, pal_plan")
    .eq("id", id)
    .eq("user_id", profile.id)
    .maybeSingle()

  if (fetchError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  // Idempotent-ish: if already planned, return the existing plan
  if (project.pal_plan && project.status !== "planning") {
    return NextResponse.json({ plan: project.pal_plan })
  }

  await admin.from("builder_projects").update({ status: "planning" }).eq("id", id)

  try {
    const result = await compilePalPlan(project.title, project.brief)

    const { data, error } = await admin
      .from("builder_projects")
      .update({
        pal_plan: result.plan as unknown as Record<string, unknown>,
        contract: result.contract as unknown as Record<string, unknown>,
        status: "planned",
      })
      .eq("id", id)
      .select("id, title, brief, status, pal_plan, contract, updated_at")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ project: data })
  } catch (e) {
    await admin.from("builder_projects").update({ status: "draft" }).eq("id", id)
    return NextResponse.json(
      { error: `PAL compilation failed: ${(e as Error).message}` },
      { status: 502 }
    )
  }
}
