import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUser } from "@/lib/supabase/server";

const runSchema = z.object({
  lessonId: z.string().min(1),
  code: z.string().max(50000),
});

// Execute lesson lab code in a Vercel Sandbox. The sandbox runs with
// network denied and a short timeout, so user code cannot reach the
// internet or run away. Requires a signed-in user — this is code execution
// behind a real sandbox, never anonymous.
export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = runSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { lessonId, code } = parsed.data;

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { labConfig: true },
  });
  if (!lesson?.labConfig) {
    return NextResponse.json(
      { ok: false, error: "This lesson has no lab configured" },
      { status: 404 }
    );
  }

  const { runtime, runCommand } = lesson.labConfig;

  const vercelToken = process.env.VERCEL_TOKEN;
  if (!vercelToken) {
    return NextResponse.json(
      { ok: false, error: "Lab execution is not configured yet" },
      { status: 503 }
    );
  }

  try {
    const { Sandbox } = await import("@vercel/sandbox");
    const sandbox = await Sandbox.getOrCreate({
      name: `lvai-lab-${lessonId.slice(0, 12)}`,
      persistent: false,
      networkPolicy: "deny-all",
      token: vercelToken,
    });

    try {
      const fileName = runtime === "python" ? "/vercel/lab.py" : "/vercel/lab.mjs";
      await sandbox.writeFiles([{ path: fileName, content: code }]);

      const [cmd, ...args] =
        runCommand === "python"
          ? ["python3", fileName]
          : ["node", fileName];

      const result = await sandbox.runCommand(cmd, args, {
        timeoutMs: 30000,
      });

      const stdout = await result.stdout();
      const stderr = await result.stderr();

      return NextResponse.json({
        ok: true,
        exitCode: result.exitCode,
        stdout: stdout.slice(0, 10000),
        stderr: stderr.slice(0, 10000),
      });
    } finally {
      await sandbox.stop();
    }
  } catch (error) {
    console.error("Lab execution failed:", error);
    return NextResponse.json(
      { ok: false, error: "Lab execution failed. Try again." },
      { status: 500 }
    );
  }
}
