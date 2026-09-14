"use client";

/**
 * Publish/unpublish toggle for courses and chapters.
 * PUTs { isPublished } to the matching teach API route and refreshes the page.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishToggle({
  kind,
  id,
  initial,
}: {
  kind: "course" | "chapter";
  id: string;
  initial: boolean;
}) {
  const router = useRouter();
  const [published, setPublished] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint =
    kind === "course"
      ? `/api/teach/courses/${id}`
      : `/api/teach/chapters/${id}`;

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !published }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to update");
      setPublished(!published);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        title={published ? "Unpublish (hide from learners)" : "Publish (visible to learners)"}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
          published
            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
        }`}
      >
        {busy ? "Saving…" : published ? "Published" : "Draft"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
