"use client";

/**
 * Company admin forms: create company, add member (by email or user ID),
 * assign seat (member + course). All mutations POST to /api/company/* and
 * refresh the server-rendered dashboard on success.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type UseFormSetError } from "react-hook-form";
import {
  companyCreateSchema,
  memberAddSchema,
  seatAssignSchema,
} from "@/lib/teach-schemas";

const inputCls =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2545] focus:outline-none";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";
const errCls = "mt-1 text-xs text-red-600";
const cardCls = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
  );
}

/**
 * Map zod issues onto react-hook-form field errors.
 * Takes RHF's own UseFormSetError type so the call stays assignable;
 * a blank path (object-level refine) becomes a form-level error instead.
 */
function applyIssues<T extends object>(
  // Structural (not zod-version-specific): works with zod v3 and v4 issue shapes.
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
  setError: UseFormSetError<T>,
  setFormError: (m: string | null) => void,
) {
  type Name = Parameters<UseFormSetError<T>>[0];
  for (const issue of issues) {
    const path = issue.path.join(".");
    if (path) setError(path as Name, { type: "validation", message: issue.message });
    else setFormError(issue.message);
  }
}

// ------------------------------------------------------- create company ---
export function CreateCompanyForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(!compact);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string; slug: string }>({ defaultValues: { name: "", slug: "" } });

  async function onSubmit(values: { name: string; slug: string }) {
    setFormError(null);
    const parsed = companyCreateSchema.safeParse(values);
    if (!parsed.success) {
      applyIssues(parsed.error.issues, setError, setFormError);
      return;
    }
    try {
      const res = await fetch("/api/company/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to create company");
      reset();
      setOpen(false);
      router.push(`/company?company=${json.company.id}`);
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to create company");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12325E]"
      >
        + New company
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cardCls}>
      <h3 className="mb-4 text-sm font-bold text-slate-900">New company</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Company name</label>
          <input className={inputCls} placeholder="Acme Inc." {...register("name")} />
          {errors.name && <p className={errCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Slug</label>
          <input className={inputCls} placeholder="acme-inc" {...register("slug")} />
          {errors.slug && <p className={errCls}>{errors.slug.message}</p>}
        </div>
      </div>
      <FormError message={formError} />
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12325E] disabled:opacity-50"
        >
          {isSubmitting ? "Creating…" : "Create company"}
        </button>
        {compact && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl px-3 py-2 text-sm text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ----------------------------------------------------------- add member ---
export function AddMemberForm({
  companyId,
  emailLookupAvailable,
}: {
  companyId: string;
  emailLookupAvailable: boolean;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; userId: string }>({
    defaultValues: { email: "", userId: "" },
  });

  async function onSubmit(values: { email: string; userId: string }) {
    setFormError(null);
    setSuccess(null);
    const parsed = memberAddSchema.safeParse({
      companyId,
      email: values.email || undefined,
      userId: values.userId || undefined,
    });
    if (!parsed.success) {
      applyIssues(parsed.error.issues, setError, setFormError);
      return;
    }
    try {
      const res = await fetch("/api/company/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.code === "SERVICE_KEY_MISSING") {
          throw new Error(
            "Email lookup isn't configured (SUPABASE_SERVICE_ROLE_KEY missing). " +
              "Ask the member for their user ID from their profile, or set the key — see ENV-CHECKLIST.md.",
          );
        }
        throw new Error(json.error ?? "Failed to add member");
      }
      setSuccess(`Added ${json.member.email ?? json.member.userId} as a member.`);
      reset();
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to add member");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cardCls}>
      <h3 className="mb-1 text-sm font-bold text-slate-900">Add member</h3>
      <p className="mb-4 text-xs text-slate-500">
        {emailLookupAvailable
          ? "Enter the member's account email — we'll resolve it to their user ID."
          : "Email lookup is unavailable (no service-role key) — add by user ID."}{" "}
        They must already have an account.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            className={inputCls}
            placeholder="teammate@company.com"
            disabled={!emailLookupAvailable}
            {...register("email")}
          />
          {errors.email && <p className={errCls}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelCls}>…or user ID</label>
          <input
            className={inputCls}
            placeholder="Supabase user UUID"
            {...register("userId")}
          />
          {errors.userId && <p className={errCls}>{errors.userId.message}</p>}
        </div>
      </div>
      <FormError message={formError} />
      {success && (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-xl bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12325E] disabled:opacity-50"
      >
        {isSubmitting ? "Adding…" : "Add member"}
      </button>
    </form>
  );
}

// ----------------------------------------------------------- assign seat ---
export function AssignSeatForm({
  companyId,
  members,
  courses,
}: {
  companyId: string;
  members: { userId: string; label: string }[];
  courses: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ userId: string; courseId: string }>({
    defaultValues: { userId: "", courseId: "" },
  });

  async function onSubmit(values: { userId: string; courseId: string }) {
    setFormError(null);
    setSuccess(null);
    const parsed = seatAssignSchema.safeParse({ ...values, companyId });
    if (!parsed.success) {
      applyIssues(parsed.error.issues, setError, setFormError);
      return;
    }
    try {
      const res = await fetch("/api/company/seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed to assign seat");
      setSuccess("Seat assigned — the member is now enrolled and can start learning.");
      reset();
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to assign seat");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cardCls}>
      <h3 className="mb-1 text-sm font-bold text-slate-900">Assign seat</h3>
      <p className="mb-4 text-xs text-slate-500">
        Assigning a seat creates a SeatAssignment and auto-enrolls the member in the
        course. v1: manual only, no seat limits.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Member</label>
          <select className={inputCls} {...register("userId")}>
            <option value="">Select a member…</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.label}
              </option>
            ))}
          </select>
          {errors.userId && <p className={errCls}>{errors.userId.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Course</label>
          <select className={inputCls} {...register("courseId")}>
            <option value="">Select a course…</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          {errors.courseId && <p className={errCls}>{errors.courseId.message}</p>}
        </div>
      </div>
      <FormError message={formError} />
      {success && (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting || members.length === 0 || courses.length === 0}
        className="mt-4 rounded-xl bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12325E] disabled:opacity-50"
      >
        {isSubmitting ? "Assigning…" : "Assign seat"}
      </button>
    </form>
  );
}
