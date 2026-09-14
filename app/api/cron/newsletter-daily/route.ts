import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Daily newsletter cron. Guarded by CRON_SECRET. Picks up the oldest
// NewsletterIssue with status "scheduled" whose scheduledFor is due and sends
// it to all active subscribers via Resend.
//
// v1 honesty rules:
// - The issue is marked "sent" ONLY after emails are actually sent.
// - If RESEND_API_KEY is not configured we report that instead of throwing.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const issue = await db.newsletterIssue.findFirst({
    where: { status: "scheduled", scheduledFor: { lte: new Date() } },
    orderBy: { scheduledFor: "asc" },
  });
  if (!issue) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { ok: false, reason: "RESEND_API_KEY not configured" },
      { status: 200 }
    );
  }
  const from = process.env.NEWSLETTER_FROM;
  if (!from) {
    return NextResponse.json(
      { ok: false, reason: "NEWSLETTER_FROM not configured" },
      { status: 200 }
    );
  }

  const subscribers = await db.subscriber.findMany({
    where: { unsubscribedAt: null },
    select: { email: true },
  });
  if (subscribers.length === 0) {
    // Nothing to send to — leave the issue scheduled so it isn't lost.
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  let sent = 0;
  for (const subscriber of subscribers) {
    const { error } = await resend.emails.send({
      from,
      to: subscriber.email,
      subject: issue.subject,
      text: issue.bodyMd,
    });
    if (error) {
      // Do NOT mark the issue sent — it stays "scheduled" for the next run.
      return NextResponse.json(
        {
          ok: false,
          reason: `Send failed for ${subscriber.email}: ${error.message}`,
          sent,
        },
        { status: 502 }
      );
    }
    sent += 1;
  }

  await db.newsletterIssue.update({
    where: { id: issue.id },
    data: { status: "sent", sentAt: new Date() },
  });

  return NextResponse.json({ ok: true, sent });
}
