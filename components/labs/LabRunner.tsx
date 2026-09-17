"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface LabRunnerProps {
  lessonId: string;
  lessonTitle: string;
  runtime: string;
  starterCode: string;
}

interface RunResult {
  ok: boolean;
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  error?: string;
}

export function LabRunner({ lessonId, lessonTitle, runtime, starterCode }: LabRunnerProps) {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/labs/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, code }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ ok: false, error: "Could not reach the lab runner. Try again." });
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setCode(starterCode);
    setResult(null);
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-navy-900">{lessonTitle}</p>
          <p className="text-xs text-slate-500">Runtime: {runtime} · sandboxed, no network</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset} disabled={running}>
            Reset
          </Button>
          <Button size="sm" onClick={run} disabled={running}>
            {running ? "Running…" : "Run ▶"}
          </Button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="h-80 w-full resize-y bg-navy-950 p-4 font-mono text-sm leading-relaxed text-emerald-100 outline-none"
        aria-label="Lab code editor"
      />
      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Output</p>
        <div className="mt-2 min-h-24 rounded-lg bg-slate-50 p-3 font-mono text-sm">
          {running ? (
            <p className="text-slate-500">Running your code…</p>
          ) : result ? (
            result.ok ? (
              <>
                {result.stdout ? (
                  <pre className="whitespace-pre-wrap text-slate-800">{result.stdout}</pre>
                ) : null}
                {result.stderr ? (
                  <pre className="mt-2 whitespace-pre-wrap text-red-700">{result.stderr}</pre>
                ) : null}
                {!result.stdout && !result.stderr ? (
                  <p className="text-slate-500">
                    Ran successfully with no output. (Exit code {result.exitCode})
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-red-700">{result.error}</p>
            )
          ) : (
            <p className="text-slate-400">Press Run to execute your code.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
