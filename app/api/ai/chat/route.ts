import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { streamText } from "ai";
import { COACH_SYSTEM_PROMPT, LVAI_CHAT_MODEL } from "@/lib/ai/coach";

export const runtime = "nodejs";
export const maxDuration = 60;

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(20000),
});

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(100),
});

// POST /api/ai/chat
// Body: { messages: [{ role: "user"|"assistant"|"system", content: string }, ...] }
// Streams the LVAI learning coach's reply (plain-text SSE via toTextStreamResponse).
// Requires AI_GATEWAY_API_KEY in the environment — without it the route answers
// 503 honestly instead of faking a reply.
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

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const result = streamText({
      model: LVAI_CHAT_MODEL, // "provider/model" string -> routed through the Vercel AI Gateway
      system: COACH_SYSTEM_PROMPT,
      messages: parsed.data.messages,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    // Gateway/auth failures surface here (e.g. a revoked key) — report them
    // honestly; never synthesize a fallback reply.
    console.error("AI chat failed:", error);
    return NextResponse.json(
      { error: "AI request failed. Try again." },
      { status: 502 }
    );
  }
}
