"use client";

/**
 * "New course" form on the teacher dashboard.
 * Validates with the shared zod schema, POSTs to /api/teach/courses,
 * then navigates to the new course's editor.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { courseCreateSchema } from "@/lib/teach-schemas";

type FormValues = {
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  isFree: boolean;
  isPublished: boolean;
};

const inputCls =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2545] focus:outline-none";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";
const errCls = "mt-1 text-xs text-red-600";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewCourseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
      level: "",
      isFree: true,
      isPublished: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const parsed = courseCreateSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".") as FieldPath<FormValues>;
        if (path) setError(path, { type: "validation", message: issue.message });
        else setFormError(issue.message);
      }
      return;
    }
    try {
      const res = await fetch("/api/teach/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to create course");
      reset();
      setOpen(false);
      router.push(`/teach/courses/${json.course.id}`);
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to create course");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12325E]"
      >
        + New course
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">New course</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="nc-title">Title</label>
          <input
            id="nc-title"
            className={inputCls}
            placeholder="Vibe Coding 101"
            {...register("title", {
              onBlur: (e) => {
                if (!getValues("slug")) setValue("slug", slugify(e.target.value));
              },
            })}
          />
          {errors.title && <p className={errCls}>{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="nc-slug">Slug</label>
          <input
            id="nc-slug"
            className={inputCls}
            placeholder="vibe-coding-101"
            {...register("slug")}
          />
          {errors.slug && <p className={errCls}>{errors.slug.message}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className={labelCls} htmlFor="nc-desc">Description</label>
        <textarea
          id="nc-desc"
          rows={3}
          className={inputCls}
          placeholder="What will learners build and learn?"
          {...register("description")}
        />
        {errors.description && <p className={errCls}>{errors.description.message}</p>}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="nc-cat">Category</label>
          <input
            id="nc-cat"
            className={inputCls}
            placeholder="curriculum, labs, bootcamp…"
            {...register("category")}
          />
          {errors.category && <p className={errCls}>{errors.category.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="nc-level">Level</label>
          <input
            id="nc-level"
            className={inputCls}
            placeholder="Beginner, Intermediate, Advanced…"
            {...register("level")}
          />
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
          Publish immediately
        </label>
      </div>

      {formError && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
      )}

      <div className="mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#0B2545] px-5 py-2 text-sm font-semibold text-white hover:bg-[#12325E] disabled:opacity-50"
        >
          {isSubmitting ? "Creating…" : "Create course"}
        </button>
      </div>
    </form>
  );
}
