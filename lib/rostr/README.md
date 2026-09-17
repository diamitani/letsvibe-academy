# Rostr inside the LVAI Next.js app

## What Rostr is

Rostr is a **Python** agentic runtime that lives at `~/workspace/your_files/rostr-core/`
(zero third-party dependencies, ~1,200 lines):

- `runtime.py` — worker loop: PAL compiles a prompt → an LLM picks a JSON action → a tool runs → repeat
- `pal.py` — prompt compiler (the integration seam: intent in, structured work order out)
- `npao.py` — N→A→P→O task classifier (Necessity / Anxiety / Priority / Opportunity)
- `hub.py` — JSON state registry in `.rostr/`
- `tools.py` — allow/deny tool registry (`read_file`, `write_file`, `list_dir`)
- `gateway.py` — Vercel AI Gateway client (OpenAI-compatible `/chat/completions` + `/embeddings`)
- `agents/master.md`, `agents/worker.md` — agent system instructions
- `skills/create-an-epk/SKILL.md`, `skills/context-engine/SKILL.md` — skill definitions
- `config.json` — gateway `base_url`, `default_model` (`anthropic/claude-sonnet-4-6`),
  `cheap_model` (`anthropic/claude-haiku-4-5`), keyed by `AI_GATEWAY_API_KEY`

## The honest architecture (read this before changing anything)

**Rostr's Python runtime cannot run inside a Vercel serverless function.**
There is no Python in a Next.js serverless deployment, and shelling out to it
from a route handler is not a real deployment strategy. This directory does not
pretend otherwise.

- **This directory (`lib/rostr/` + `app/api/agent/`)** is the **TypeScript agent
  surface**: the conversational front end that knows the Rostr agent/skill roster
  and answers through the Vercel AI Gateway. It never executes Python.
- **The real multi-step runtime** (`run_master` / `run_worker`) deploys as a
  **separate Python service**, exactly per the five wiring paths in
  `~/workspace/your_files/rostr-core/WIRING.md` (B: drive it from any Python
  harness and expose results over HTTP; C: `AI_GATEWAY_API_KEY` in env; D:
  persist hub state to Supabase with the provided schema). A future HTTP bridge
  can call that service from a route handler — until it exists, there is no
  mock standing in for it: the agent POST 503s without a gateway key.

## Files

- `lib/rostr/manifest.ts` — **auto-generated**, baked in from
  `~/workspace/your_files/rostr-core` by `scripts/generate-rostr-manifest.mts`.
  The Vercel runtime never reads the rostr-core directory from disk (it isn't
  there). Re-run the script whenever agents or skills change.
- `lib/rostr/README.md` — this file.
- `app/api/agent/route.ts` — `GET` returns the catalog; `POST` streams the
  agent's reply via the AI SDK + AI Gateway (503 without `AI_GATEWAY_API_KEY`).
- `app/api/ai/chat/route.ts` — the plain chat endpoint, same honest-503 rule.
- `lib/ai/coach.ts` — shared LVAI learning-coach system prompt + model config.
