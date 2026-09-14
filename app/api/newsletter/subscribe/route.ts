import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const subscribeSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

// Subscribe (or re-subscribe) an email address to the newsletter.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email" },
      { status: 400 }
    );
  }

  await db.subscriber.upsert({
    where: { email: parsed.data.email },
    update: { subscribedAt: new Date(), unsubscribedAt: null },
    create: { email: parsed.data.email, subscribedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
