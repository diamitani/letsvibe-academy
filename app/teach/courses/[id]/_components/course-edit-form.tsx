"use client";

/**
 * Course fields form on the course editor page.
 * PUTs to /api/teach/courses/[id]. Delete is blocked server-side while the
 * course has enrollments, seat assignments, or certificates.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { courseUpdateSchema } from "@/lib/teach-schemas";

type FormValues = {
  title?: string;
  slug?: string;
  description?: string;
  category?: string;
  level?: string;
  isFree?: boolean;
  isPublished?: boolean;
};

const inputCls =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2545] focus:outline-none";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";
const errCls = "mt-1 text-xs text-red-600";

export default function CourseEditForm({
  courseId,
  initial,
}: {
  courseId: string;
  initial: FormValues;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: initial });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    setSaved(false);
    const parsed = courseUpdateSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".") as FieldPath<FormValues>;
        if (path) setError(path, { type: "validation", message: issue.message });
        else setFormError(issue.message);
      }
      return;
    }
    try {
      const res = await fetch(`/api/teach/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to save");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to save");
    }
  }

  async function onDelete() {
    if (
      !window.confirm(
        "Delete this course and all its chapters and lessons? This cannot be undone.",
      )
    )
      return;
    setFormError(null);
    try {
      const res = await fetch(`/api/teach/courses/${courseId}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          json.error ??
            "Could not delete. Courses with enrollments must be unpublished instead.",
        );
      router.push("/teach");
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-base font-bold text-slate-900">Course details</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="ce-title">Title</label>
          <input id="ce-title" className={inputCls} {...register("title")} />
          {errors.title && <p className={errCls}>{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="ce-slug">
            Slug <span className="font-normal text-slate-400">(changing it breaks existing links)</span>
          </label>
          <input id="ce-slug" className={inputCls} {...register("slug")} />
          {errors.slug && <p className={errCls}>{errors.slug.message}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className={labelCls} htmlFor="ce-desc">Description</label>
        <textarea id="ce-desc" rows={3} className={inputCls} {...register("description")} />
        {errors.description && <p className={errCls}>{errors.description.message}</p>}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="ce-cat">Category</label>
          <input id="ce-cat" className={inputCls} {...register("category")} />
          {errors.category && <p className={errCls}>{errors.category.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="ce-level">Level</label>
          <input id="ce-level" className={inputCls} {...register("level")} />
          {errors.level && <p className={errCls}>{errors.level.message}</p>}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register("isFree")} className="h-4 w-4" />
          Free course
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register("isPublished")} className="h-4 w-4" />
          Published
        </label>
      </div>

      {formError && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
      )}
      {saved && !formError && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Saved.
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#0B2545] px-5 py-2 text-sm font-semibold text-white hover:bg-[#12325E] disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          Delete course
        </button>
      </div>
    </form>
  );
}
