/**
 * Access control for the admin side — /teach and /company (v1, intentionally simple).
 *
 * v1 RULES (documented here so every builder enforces the same contract):
 *  1. /teach pages and /api/teach/* routes require a logged-in user (Supabase).
 *  2. Teacher ACTIONS (create/edit/delete/publish courses, chapters, lessons) additionally
 *     require the user to be the course's `createdBy` owner OR to have an email in the
 *     TEACHER_EMAILS allowlist (comma-separated env var). Allowlisted users see and may
 *     edit ALL courses on the dashboard.
 *  3. /company pages and /api/company/* routes require a logged-in user.
 *  4. Company admin actions require a CompanyMember row with role="admin" for that company.
 *
 * v1 LIMITATIONS: no per-course teacher roles, no org-level RBAC beyond company admin.
 * A future version could add a TeacherRole table; see README "v1 limitations".
 *
 * This module is server-only. Never import it from client components.
 */
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server"; // sibling-owned: returns Supabase user | null
import { db } from "@/lib/db"; // sibling-owned Prisma client

/** Path to the sign-in page (sibling C owns auth pages — update here if it moves). */
export const LOGIN_PATH = "/login";

export type SessionUser = { id: string; email: string | null };

type MaybeUser = { id: string; email?: string | null } | null;

/** Current user or null. Use in server components and API routes. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const user = (await getUser()) as MaybeUser;
  if (!user) return null;
  return { id: user.id, email: user.email ?? null };
}

/** Current user or redirect to login. Use ONLY in server components/pages. */
export async function requireSessionUser(): Promise<SessionUser> {
  const me = await getSessionUser();
  if (!me) redirect(LOGIN_PATH);
  return me;
}

/**
 * Current user or a 401 JSON response. Use ONLY in API routes:
 *   const meOr = await requireApiUser();
 *   if (meOr instanceof NextResponse) return meOr;
 */
export async function requireApiUser(): Promise<SessionUser | NextResponse> {
  const me = await getSessionUser();
  if (!me) {
    return NextResponse.json(
      { error: "Unauthorized — sign in required." },
      { status: 401 },
    );
  }
  return me;
}

function teacherEmailAllowlist(): string[] {
  return (process.env.TEACHER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** True if the email is in the TEACHER_EMAILS allowlist. */
export function isTeacherEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return teacherEmailAllowlist().includes(email.toLowerCase());
}

/**
 * Teacher action gate: the user created this course OR is allowlisted.
 * `createdBy` may be null for legacy/seeded courses — then only allowlisted users qualify.
 */
export function canTeachCourse(
  me: SessionUser,
  createdBy: string | null | undefined,
): boolean {
  if (createdBy && createdBy === me.id) return true;
  return isTeacherEmail(me.email);
}

/** Load a course and check the teacher gate. Returns the course or an HTTP status to send. */
export async function getCourseForTeacher(me: SessionUser, courseId: string) {
  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) return { course: null as null, status: 404 as const };
  if (!canTeachCourse(me, course.createdBy))
    return { course: null as null, status: 403 as const };
  return { course, status: 200 as const };
}

/**
 * Company admin gate: returns the admin membership or null.
 * Callers turn null into a 403 (API) or an access-denied page.
 */
export async function getCompanyAdminMembership(
  me: SessionUser,
  companyId: string,
) {
  const membership = await db.companyMember.findUnique({
    // Assumes Prisma @@unique([companyId, userId]) per BUILD-PLAN contract.
    where: { companyId_userId: { companyId, userId: me.id } },
  });
  if (!membership || membership.role !== "admin") return null;
  return membership;
}
