"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const NAVY_BUTTON =
  "rounded-xl bg-[#0B2545] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#12325E] disabled:opacity-50";

async function postJson(path: string, body: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

// One-click free enrollment.
export function EnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enroll() {
    setPending(true);
    setError(null);
    const { ok, data } = await postJson("/api/enroll", { courseId });
    setPending(false);
    if (!ok) {
      setError((data?.error as string) ?? "Enrollment failed. Please try again.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button type="button" onClick={enroll} disabled={pending} className={NAVY_BUTTON}>
        {pending ? "Enrolling…" : "Enroll — free"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Toggle a lesson's completed state.
export function MarkCompleteButton({
  lessonId,
  completed,
}: {
  lessonId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setPending(true);
    setError(null);
    const { ok, data } = await postJson("/api/progress", {
      lessonId,
      completed: !completed,
    });
    setPending(false);
    if (!ok) {
      setError((data?.error as string) ?? "Could not save progress.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={
          completed
            ? "rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            : NAVY_BUTTON
        }
      >
        {pending ? "Saving…" : completed ? "✓ Completed — undo" : "Mark complete"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Claim a certificate once the course is 100% complete.
export function ClaimCertificateButton({ courseId }: { courseId: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function claim() {
    setPending(true);
    setError(null);
    const { ok, data } = await postJson("/api/certificates/issue", { courseId });
    setPending(false);
    if (!ok) {
      setError((data?.error as string) ?? "Could not issue certificate.");
      return;
    }
    window.location.href = `/certificates/${data.code}`;
  }

  return (
    <div>
      <button type="button" onClick={claim} disabled={pending} className={NAVY_BUTTON}>
        {pending ? "Issuing…" : "Claim certificate"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Interactive checklist parsed from markdown bullet lines in lab instructions.
export function LabChecklist({ bodyMd }: { bodyMd: string | null }) {
  const items = (bodyMd ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, "").replace(/^\[.\] /, "").trim())
    .filter(Boolean);

  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));

  if (items.length === 0) return null;

  function toggle(index: number) {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }

  const done = checked.filter(Boolean).length;

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-sm font-bold text-slate-900">
        Lab checklist ({done}/{items.length})
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 h-4 w-4 accent-[#0B2545]"
              />
              <span className={checked[i] ? "text-slate-400 line-through" : ""}>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
