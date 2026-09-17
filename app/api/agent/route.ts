import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { streamText } from "ai";
import { COACH_SYSTEM_PROMPT, LVAI_CHAT_MODEL } from "@/lib/ai/coach";
import {
  ROSTR_AGENTS,
  ROSTR_GENERATED_AT,
  ROSTR_SKILLS,
} from "@/lib/rostr/manifest";

export const runtime = "nodejs";
export const maxDuration = 60;

// The TypeScript agent surface for the LVAI Academy.
//
// Honest architecture (see lib/rostr/README.md):
// - rostr-core is a PYTHON runtime at ~/workspace/your_files/rostr-core/.
//   It cannot execute inside a Vercel serverless function, and this route
//   does not pretend otherwise.
// - This endpoint is the conversational agent surface: it answers with the
//   LVAI coach persona over the Vercel AI Gateway, and it knows the baked-in
//   roster of Rostr agents/skills (lib/rostr/manifest.ts) so it can describe
//   and route toward them.
// - Multi-step Python agent runs (run_master / run_worker) stay on the
//   separate Python service per rostr-core/WIRING.md — a future bridge can
//   call that service over HTTP, but nothing is mocked here in the meantime.
//
// Without AI_GATEWAY_API_KEY the route answers 503 honestly — no scripted
// "agent" replies, ever.

const agentCatalog = [
  "Available Rostr agents (Python runtime, separate service — you can describe them but cannot execute them):",
  ...ROSTR_AGENTS.map((a) => `- ${a.name}: ${a.title}`),
  "",
  "Available Rostr skills:",
  ...ROSTR_SKILLS.map(
    (s) => `- ${s.name}: ${s.description || s.title}`
  ),
].join("\n");

const AGENT_SYSTEM_PROMPT = `${COACH_SYSTEM_PROMPT}

You are also the LVAI Academy's agent surface — the conversational front end
for the academy's AI tooling. When a student asks about automation, agents, or
skills, answer from the catalog below. Be honest about what you can and cannot
do in this chat: you can explain the agents and skills and coach the student
through using them, but the Python multi-step runtime executes outside this
chat as a separate service.

${agentCatalog}`;

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(20000),
});

const agentSchema = z.object({
  messages: z.array(messageSchema).min(1).max(100),
  agent: z.string().min(1).max(64).optional(), // requested rostr agent name, e.g. "master" | "worker"
});

// GET /api/agent — the baked-in Rostr agent/skill catalog. This is plain data,
// so it works with or without a gateway key.
export async function GET() {
  return NextResponse.json({
    ok: true,
    generatedAt: ROSTR_GENERATED_AT,
    source: "rostr-core (baked in at build/authoring time)",
    agents: ROSTR_AGENTS,
    skills: ROSTR_SKILLS,
  });
}

// POST /api/agent
// Body: { messages: [...], agent?: "master" | "worker" }
// Streams the agent's reply. Requires AI_GATEWAY_API_KEY.
export async function POST(request: NextRequest) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = agentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const knownAgent = ROSTR_AGENTS.find((a) => a.name === parsed.data.agent);
  if (parsed.data.agent && !knownAgent) {
    return NextResponse.json(
      {
        error: `Unknown agent "${parsed.data.agent}".`,
        agents: ROSTR_AGENTS.map((a) => a.name),
      },
      { status: 400 }
    );
  }

  try {
    const result = streamText({
      model: LVAI_CHAT_MODEL, // "provider/model" string -> routed through the Vercel AI Gateway
      system: AGENT_SYSTEM_PROMPT,
      messages: parsed.data.messages,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Agent request failed:", error);
    return NextResponse.json(
      { error: "AI request failed. Try again." },
      { status: 502 }
    );
  }
}
