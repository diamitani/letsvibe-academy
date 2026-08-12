// Standalone smoke test for the PAL engine (lib/pal.ts)
// Run: node --experimental-strip-types scripts/test-pal.ts
import { compilePalPlan, coachChat } from "../lib/pal.ts"

const title = "Landing page for my music coaching business"
const brief =
  "I teach songwriting and music production to indie artists. I need a landing page that explains my coaching programs, shows student testimonials, and collects email signups for a free weekly tip. I have no code experience and want to use a hosted builder. Budget is zero. Success looks like 10 email signups in the first month."

async function main() {
  console.log("=== 1. PAL compilation ===")
  const started = Date.now()
  const result = await compilePalPlan(title, brief)
  console.log(`(took ${((Date.now() - started) / 1000).toFixed(1)}s)`)
  console.log("summary:", result.plan.summary.slice(0, 140) + "...")
  console.log("intent:", JSON.stringify(result.plan.primary_intent))
  console.log("milestones:", result.plan.milestones.length)
  for (const m of result.plan.milestones) {
    console.log(`  - ${m.title} (${m.tasks.length} tasks)`)
  }
  console.log("stack:", result.plan.stack_recommendation)
  console.log("non_goals:", result.contract.non_goals.length, "| approval_gates:", result.contract.approval_gates.length, "| risks:", result.contract.risks.length)
  if (!result.plan.milestones.length || !result.plan.success_criteria.length) {
    throw new Error("PAL plan missing milestones or success criteria")
  }

  console.log("\n=== 2. Coach chat ===")
  const chatStarted = Date.now()
  const reply = await coachChat({
    projectTitle: title,
    brief,
    plan: result.plan,
    contract: result.contract,
    history: [],
    message: "What should I do first for milestone 1? Give me the exact prompt to paste into a hosted builder.",
  })
  console.log(`(took ${((Date.now() - chatStarted) / 1000).toFixed(1)}s)`)
  console.log(reply.slice(0, 600))
  if (!reply || reply.length < 50) {
    throw new Error("Coach reply too short or empty")
  }

  console.log("\n=== PASS: PAL engine verified against Bedrock ===")
}

main().catch((e) => {
  console.error("FAIL:", e)
  process.exit(1)
})
