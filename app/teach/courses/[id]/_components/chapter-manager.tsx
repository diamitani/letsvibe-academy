"use client";

/**
 * Chapter list for the course editor.
 *
 * Reordering is a SIMPLE POSITION SWAP (v1 — no drag-and-drop library):
 * "Move up" / "Move down" PUTs { position } to /api/teach/chapters/[id],
 * and the server swaps positions with the chapter currently at that slot.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { chapterCreateSchema } from "@/lib/teach-schemas";
import PublishToggle from "../../../_components/publish-toggle";
import LessonManager, { type LessonDTO } from "./lesson-manager";

export type ChapterDTO = {
  id: string;
  title: string;
  position: number;
  isPublished: boolean;
  isFreePreview: boolean;
  lessons: LessonDTO[];
};

const inputCls =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2545] focus:outline-none";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";
const errCls = "mt-1 text-xs text-red-600";

type NewChapterValues = { title: string; isPublished: boolean; isFreePreview: boolean };

function moveLabel(dir: "up" | "down") {
  return dir === "up"
    ? "Move up (swaps position with the chapter above — simple swap, no drag-and-drop in v1)"
    : "Move down (swaps position with the chapter below — simple swap, no drag-and-drop in v1)";
}

function ChapterCard({
  chapter,
  isFirst,
  isLast,
}: {
  chapter: ChapterDTO;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chapter.title);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function put(body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/teach/chapters/${chapter.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to update chapter");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update chapter");
    } finally {
      setBusy(false);
    }
  }

  async function saveTitle() {
    const t = title.trim();
    if (!t || t === chapter.title) {
      setEditing(false);
      setTitle(chapter.title);
      return;
    }
    await put({ title: t });
    setEditing(false);
  }

  async function onDelete() {
    if (
      !window.confirm(
        `Delete chapter "${chapter.title}" and its ${chapter.lessons.length} lesson(s)? This cannot be undone.`,
      )
    )
      return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/teach/chapters/${chapter.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to delete chapter");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete chapter");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500"
            title="Chapter order position (0-based)"
          >
            #{chapter.position}
          </span>
          {editing ? (
            <span className="flex items-center gap-2">
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") {
                    setEditing(false);
                    setTitle(chapter.title);
                  }
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={saveTitle}
                disabled={busy}
                className="text-xs font-semibold text-[#0B2545] hover:underline disabled:opacity-50"
              >
                Save
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              title="Rename chapter"
              className="truncate text-left text-sm font-bold text-slate-900 hover:text-[#0B2545]"
            >
              {chapter.title}
            </button>
          )}
          <PublishToggle kind="chapter" id={chapter.id} initial={chapter.isPublished} />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => put({ position: chapter.position - 1 })}
            disabled={busy || isFirst}
            title={moveLabel("up")}
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-[#0B2545] hover:text-[#0B2545] disabled:opacity-30"
          >
            ↑ Up
          </button>
          <button
            type="button"
            onClick={() => put({ position: chapter.position + 1 })}
            disabled={busy || isLast}
            title={moveLabel("down")}
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-[#0B2545] hover:text-[#0B2545] disabled:opacity-30"
          >
            ↓ Down
          </button>
          <label
            className="ml-2 flex items-center gap-1 text-xs text-slate-500"
            title="Learners can preview this chapter's lessons without enrolling"
          >
            <input
              type="checkbox"
              checked={chapter.isFreePreview}
              disabled={busy}
              onChange={(e) => put({ isFreePreview: e.target.checked })}
              className="h-3.5 w-3.5"
            />
            Free preview
          </label>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="ml-1 text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <LessonManager chapterId={chapter.id} lessons={chapter.lessons} />
    </li>
  );
}

export default function ChapterManager({
  courseId,
  chapters,
}: {
  courseId: string;
  chapters: ChapterDTO[];
}) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewChapterValues>({
    defaultValues: { title: "", isPublished: false, isFreePreview: false },
  });

  async function onSubmit(values: NewChapterValues) {
    setFormError(null);
    const parsed = chapterCreateSchema.safeParse({ ...values, courseId });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".") as FieldPath<NewChapterValues>;
        if (path) setError(path, { type: "validation", message: issue.message });
        else setFormError(issue.message);
      }
      return;
    }
    try {
      const res = await fetch("/api/teach/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to create chapter");
      reset();
      setShowAdd(false);
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to create chapter");
    }
  }

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          Chapters ({chapters.length})
        </h2>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="rounded-xl bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12325E]"
        >
          {showAdd ? "Cancel" : "+ Add chapter"}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div>
            <label className={labelCls}>Chapter title</label>
            <input
              className={inputCls}
              placeholder="Module 1: …"
              {...register("title")}
            />
            {errors.title && <p className={errCls}>{errors.title.message}</p>}
          </div>
          <div className="mt-3 flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register("isPublished")} className="h-4 w-4" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register("isFreePreview")} className="h-4 w-4" />
              Free preview
            </label>
          </div>
          {formError && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 rounded-xl bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12325E] disabled:opacity-50"
          >
            {isSubmitting ? "Adding…" : "Add chapter"}
          </button>
        </form>
      )}

      {chapters.length === 0 && !showAdd ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No chapters yet — add your first chapter above.
        </div>
      ) : (
        <ul className="space-y-3">
          {chapters.map((ch, i) => (
            <ChapterCard
              key={ch.id}
              chapter={ch}
              isFirst={i === 0}
              isLast={i === chapters.length - 1}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
