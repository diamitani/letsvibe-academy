import {
  BedrockRuntimeClient,
  ConverseCommand,
  type ConverseCommandInput,
} from "@aws-sdk/client-bedrock-runtime"

// ---------------------------------------------------------------------------
// Bedrock client (us-east-1, confirmed active model)
// ---------------------------------------------------------------------------

const MODEL_ID = process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-6"
const REGION = process.env.AWS_REGION || "us-east-1"

let _client: BedrockRuntimeClient | null = null

function getClient(): BedrockRuntimeClient {
  if (!_client) {
    _client = new BedrockRuntimeClient({ region: REGION })
  }
  return _client
}

async function converse(input: {
  system: string
  user: string
  maxTokens?: number
  temperature?: number
}): Promise<string> {
  const commandInput: ConverseCommandInput = {
    modelId: MODEL_ID,
    system: [{ text: input.system }],
    messages: [{ role: "user", content: [{ text: input.user }] }],
    inferenceConfig: {
      maxTokens: input.maxTokens ?? 2048,
      temperature: input.temperature ?? 0.4,
    },
  }
  const res = await getClient().send(new ConverseCommand(commandInput))
  return (
    res.output?.message?.content
      ?.map((c) => c.text ?? "")
      .join("")
      .trim() ?? ""
  )
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PalPlan {
  summary: string
  primary_intent: {
    verb: string
    object: string
    domain: string
    desired_output: string
  }
  users: string[]
  success_criteria: string[]
  milestones: {
    title: string
    tasks: string[]
    depends_on: string[]
  }[]
  stack_recommendation: string
  unknown_unknowns: string[]
}

export interface ProjectContract {
  scope: string
  non_goals: string[]
  deliverables: string[]
  approval_gates: string[]
  risks: { risk: string; mitigation: string }[]
}

export interface PalResult {
  plan: PalPlan
  contract: ProjectContract
}

// ---------------------------------------------------------------------------
// Stage 1-4: PAL compilation (intent → plan + contract)
// ---------------------------------------------------------------------------

const PAL_SYSTEM = `You are the PAL (Prompt Abstraction Layer) compiler for LetsVibeAI, the practical AI-building academy.

Your job: transform a loose learner idea into a strict, buildable project plan and contract, following the ROSTR PAL pipeline:

Stage 1 — Intent Extraction: identify the primary intent (verb + object), domain, subject, constraints, desired output.
Stage 2 — Context Injection: assume the learner is a beginner-to-intermediate vibe coder following the LetsVibeAI curriculum (AI foundations, vibe coding loop, toolkit, prompt chaining, context engineering, process engineering). Keep tool recommendations aligned with that level: hosted builders (Bolt, v0, Replit), AI IDEs (Cursor, Copilot), and no-code platforms first; raw coding only as a later milestone.
Stage 3 — Semantic Enhancement: expand vague goals into concrete tasks; add success criteria and verification methods; decompose the goal into a phase sequence; remove hedging.
Stage 4 — Runtime Compilation: emit the plan and a project contract with scope, non-goals, deliverables, approval gates, and risks.

Rules:
- NEVER silently expand scope. If the idea implies payments, scraping, email sending, deployment, or third-party account connections, list those under approval_gates and contract.risks, not as assumptions.
- The learner must be able to build this in 1-4 sessions with AI tools.
- Respond with ONLY valid JSON. No markdown fences, no commentary.`

const PAL_USER_TEMPLATE = `Compile this idea into a PAL plan + project contract.

Learner idea: IDEA_HERE

Input brief:
"""
BRIEF_HERE
"""

Return JSON exactly matching this shape:
{
  "plan": {
    "summary": "one-paragraph project summary",
    "primary_intent": { "verb": "...", "object": "...", "domain": "code | design | research | ops | content | automation", "desired_output": "..." },
    "users": ["who it serves"],
    "success_criteria": ["measurable criteria"],
    "milestones": [
      { "title": "Milestone 1", "tasks": ["task"], "depends_on": [] }
    ],
    "stack_recommendation": "tool stack for a beginner-to-intermediate vibe coder",
    "unknown_unknowns": ["open questions"]
  },
  "contract": {
    "scope": "what is in scope",
    "non_goals": ["explicitly out of scope"],
    "deliverables": ["what gets produced"],
    "approval_gates": ["actions that require learner approval"],
    "risks": [ { "risk": "...", "mitigation": "..." } ]
  }
}`

export async function compilePalPlan(title: string, brief: string): Promise<PalResult> {
  const user = PAL_USER_TEMPLATE.replace("IDEA_HERE", title).replace("BRIEF_HERE", brief)
  const raw = await converse({ system: PAL_SYSTEM, user, maxTokens: 4096, temperature: 0.3 })

  // Extract the first JSON object from the response (tolerates stray text)
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) {
    throw new Error("PAL compiler returned no JSON: " + raw.slice(0, 200))
  }

  try {
    const parsed = JSON.parse(match[0])
    if (!parsed.plan || !parsed.contract) {
      throw new Error("PAL result missing plan or contract")
    }
    return parsed as PalResult
  } catch (e) {
    throw new Error(`PAL compiler returned invalid JSON: ${(e as Error).message}`)
  }
}

// ---------------------------------------------------------------------------
// Curriculum-aware coach chat
// ---------------------------------------------------------------------------

const COACH_SYSTEM = `You are the LetsVibeAI Builder Coach — a curriculum-aware building partner.

You help learners turn their PAL plan and project contract into a real project, one session at a time. You know the LetsVibeAI curriculum: Module 1 What Is AI, Module 2 What Is Vibe Coding, Module 3 The Toolkit, Module 4 Prompt Chaining, Module 5 Context Engineering, Module 6 Process Engineering, plus the project labs (marketing site, e-commerce store, directory/marketplace).

How you help:
- Reference the learner's PAL plan and contract when answering — never invent scope beyond the contract.
- Teach through the vibe coding loop: Describe → Generate → Review → Refine.
- Give concrete next actions tied to the current milestone.
- When a learner asks to do something outside the contract (payments, scraping, deploy, third-party accounts), flag it as an approval-gate item instead of just doing it.
- Keep answers focused and actionable — no fluff, no generic advice. A short code snippet or prompt template is welcome when it moves the milestone forward.
- If the learner is stuck, ask ONE clarifying question and propose the simplest next step.

Never claim to have run code, deployed anything, or accessed external systems — you are a planning and coaching assistant.`

export async function coachChat(input: {
  projectTitle: string
  brief: string
  plan: PalPlan | null
  contract: ProjectContract | null
  history: { role: "user" | "assistant"; content: string }[]
  message: string
}): Promise<string> {
  const context = [
    `Project: ${input.projectTitle}`,
    `Brief: ${input.brief}`,
    input.plan ? `PAL Plan:\n${JSON.stringify(input.plan, null, 2)}` : "PAL Plan: not generated yet",
    input.contract ? `Contract:\n${JSON.stringify(input.contract, null, 2)}` : "Contract: not generated yet",
  ].join("\n\n")

  const historyBlock = input.history
    .slice(-10)
    .map((m) => `${m.role === "user" ? "Learner" : "Coach"}: ${m.content}`)
    .join("\n")

  const user = `Project context:\n${context}\n\nConversation so far:\n${historyBlock || "(none)"}\n\nLearner's message:\n${input.message}`

  return converse({ system: COACH_SYSTEM, user, maxTokens: 1024, temperature: 0.5 })
}
