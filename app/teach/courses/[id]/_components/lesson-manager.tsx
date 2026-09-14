"use client";

/**
 * Per-chapter lesson list: add-lesson form, inline edit, delete with confirm.
 *
 * NOTE (schema contract): Lesson has no isPublished flag — a lesson is visible
 * to learners whenever its chapter and course are published. Chapter-level
 * publish toggles control visibility.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { lessonCreateSchema, lessonUpdateSchema, type LessonKind } from "@/lib/teach-schemas";

export type LessonDTO = {
  id: string;
  title: string;
  kind: string;
  contentUrl: string | null;
  bodyMd: string | null;
  durationMin: number | null;
  position: number;
};

const inputCls =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2545] focus:outline-none";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";
const errCls = "mt-1 text-xs text-red-600";

const KIND_LABELS: Record<string, string> = {
  video: "Video",
  article: "Article",
  quiz: "Quiz",
  lab: "Lab",
};

type LessonFormValues = {
  title: string;
  kind: LessonKind;
  contentUrl: string;
  bodyMd: string;
  durationMin: string; // coerced to number by zod on submit
};

function LessonForm({
  chapterId,
  lesson,
  onDone,
}: {
  chapterId: string;
  lesson?: LessonDTO;
  onDone: () => void;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LessonFormValues>({
    defaultValues: {
      title: lesson?.title ?? "",
      kind: (lesson?.kind as LessonKind) ?? "article",
      contentUrl: lesson?.contentUrl ?? "",
      bodyMd: lesson?.bodyMd ?? "",
      durationMin: lesson?.durationMin != null ? String(lesson.durationMin) : "",
    },
  });

  async function onSubmit(values: LessonFormValues) {
    setFormError(null);
    const schema = lesson ? lessonUpdateSchema : lessonCreateSchema;
    const payload = lesson ? values : { ...values, chapterId };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".") as FieldPath<LessonFormValues>;
        if (path) setError(path, { type: "validation", message: issue.message });
        else setFormError(issue.message);
      }
      return;
    }
    try {
      const res = await fetch(
        lesson ? `/api/teach/lessons/${lesson.id}` : "/api/teach/lessons",
        {
          method: lesson ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to save lesson");
      onDone();
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to save lesson");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className={labelCls}>Title</label>
          <input className={inputCls} placeholder="Lesson title" {...register("title")} />
          {errors.title && <p className={errCls}>{errors.title.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Kind</label>
            <select className={inputCls} {...register("kind")}>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="quiz">Quiz</option>
              <option value="lab">Lab</option>
            </select>
            {errors.kind && <p className={errCls}>{errors.kind.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Duration (min)</label>
            <input
              type="number"
              min={1}
              className={inputCls}
              placeholder="10"
              {...register("durationMin")}
            />
            {errors.durationMin && <p className={errCls}>{errors.durationMin.message}</p>}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <label className={labelCls}>Content URL (video link, article link…)</label>
        <input
          className={inputCls}
          placeholder="https://…"
          {...register("contentUrl")}
        />
        {errors.contentUrl && <p className={errCls}>{errors.contentUrl.message}</p>}
      </div>
      <div className="mt-3">
        <label className={labelCls}>Body (Markdown)</label>
        <textarea
          rows={4}
          className={`${inputCls} font-mono`}
          placeholder="# Lesson content in Markdown…"
          {...register("bodyMd")}
        />
        {errors.bodyMd && <p className={errCls}>{errors.bodyMd.message}</p>}
      </div>
      {formError && (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#0B2545] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#12325E] disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : lesson ? "Save lesson" : "Add lesson"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function LessonManager({
  chapterId,
  lessons,
}: {
  chapterId: string;
  lessons: LessonDTO[];
}) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onDelete(lesson: LessonDTO) {
    if (!window.confirm(`Delete lesson "${lesson.title}"? This cannot be undone.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/teach/lessons/${lesson.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to delete lesson");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete lesson");
    }
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Lessons ({lessons.length})
        </h4>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="text-xs font-semibold text-[#0B2545] hover:underline"
        >
          {showAdd ? "Cancel" : "+ Add lesson"}
        </button>
      </div>

      {showAdd && (
        <div className="mb-3">
          <LessonForm chapterId={chapterId} onDone={() => setShowAdd(false)} />
        </div>
      )}

      {error && (
        <p className="mb-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {lessons.length === 0 && !showAdd ? (
        <p className="text-xs text-slate-400">No lessons yet.</p>
      ) : (
        <ul className="space-y-2">
          {lessons.map((l) => (
            <li key={l.id} className="rounded-xl bg-slate-50 px-3 py-2">
              {editingId === l.id ? (
                <LessonForm
                  chapterId={chapterId}
                  lesson={l}
                  onDone={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="mr-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-[#0B2545]">
                      {KIND_LABELS[l.kind] ?? l.kind}
                    </span>
                    <span className="text-sm font-medium text-slate-800">{l.title}</span>
                    <span className="ml-2 text-xs text-slate-400">
                      #{l.position}
                      {l.durationMin ? ` · ${l.durationMin} min` : ""}
                      {l.contentUrl ? " · has link" : ""}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(l.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-[#0B2545]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(l)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[11px] text-slate-400">
        Lessons are visible to learners whenever this chapter and its course are published.
      </p>
    </div>
  );
}
