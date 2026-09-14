/**
 * Company admin dashboard (server component).
 *
 * Access: logged-in users only; shows companies where the user is a
 * CompanyMember with role="admin" (see lib/access.ts). Per-member progress is
 * computed server-side in lib/company-progress.ts — never trusted from clients.
 */
import Link from "next/link";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireSessionUser } from "@/lib/access";
import { getMembersProgress } from "@/lib/company-progress";
import { resolveUserEmails, hasServiceRoleKey } from "@/lib/supabase/admin";
import {
  CreateCompanyForm,
  AddMemberForm,
  AssignSeatForm,
} from "./_components/company-forms";

export const dynamic = "force-dynamic";

export const metadata = { title: "Company admin — LetsVibeAI Academy" };

function ProgressBar({ pct }: { pct: number }) {
  return (
    <span className="inline-flex min-w-40 items-center gap-2">
      <span className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
        <span
          className={`block h-full rounded-full ${pct === 100 ? "bg-emerald-500" : "bg-[#0B2545]"}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="text-xs font-semibold text-slate-600">{pct}%</span>
    </span>
  );
}

export default async function CompanyAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>; // Next 16: searchParams is a Promise
}) {
  const me = await requireSessionUser();
  const { company: companyParam } = await searchParams;

  const adminMemberships = await db.companyMember.findMany({
    where: { userId: me.id, role: "admin" },
    include: { company: true },
    orderBy: { company: { name: "asc" } },
  });
  const companies = adminMemberships.map((m) => m.company);

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-[#0B2545] text-white">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <h1 className="text-2xl font-bold">Company admin</h1>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">
              You're not an admin of any company yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Create a company to manage members, seats, and progress.
            </p>
          </div>
          <div className="mt-6">
            <CreateCompanyForm />
          </div>
        </main>
      </div>
    );
  }

  const selected =
    companies.find((c) => c.id === companyParam || c.slug === companyParam) ??
    companies[0];

  const [members, publishedCourses] = await Promise.all([
    db.companyMember.findMany({
      where: { companyId: selected.id },
      orderBy: [{ role: "asc" }, { id: "asc" }], // admins first ("admin" < "member")
    }),
    db.course.findMany({
      where: { isPublished: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  const memberIds = members.map((m) => m.userId);
  const [emailMap, progress] = await Promise.all([
    resolveUserEmails(memberIds),
    getMembersProgress(memberIds),
  ]);
  const progressByUser = new Map(progress.map((p) => [p.userId, p]));

  const emailLookupAvailable = hasServiceRoleKey();
  const labelFor = (userId: string) =>
    emailMap.get(userId) ?? `${userId.slice(0, 8)}…`;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0B2545] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold">Company admin</h1>
            <p className="mt-1 text-sm text-blue-200">
              Members, seat assignments, and per-member progress.
            </p>
          </div>
          <Link href="/" className="text-sm text-blue-200 hover:text-white">
            ← Site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {companies.length > 1 && (
          <nav className="mb-6 flex flex-wrap gap-2" aria-label="Companies">
            {companies.map((c) => (
              <Link
                key={c.id}
                href={`/company?company=${c.id}`}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  c.id === selected.id
                    ? "bg-[#0B2545] text-white"
                    : "border border-slate-300 text-slate-700 hover:border-[#0B2545] hover:text-[#0B2545]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{selected.name}</h2>
          <CreateCompanyForm compact />
        </div>

        {!emailLookupAvailable && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Email lookup is disabled</p>
            <p className="mt-1">
              SUPABASE_SERVICE_ROLE_KEY is not set, so members can only be added by
              user ID (not by email). Set the key to enable email lookup — see
              ENV-CHECKLIST.md.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <AddMemberForm
            companyId={selected.id}
            emailLookupAvailable={emailLookupAvailable}
          />
          <AssignSeatForm
            companyId={selected.id}
            members={members.map((m) => ({ userId: m.userId, label: labelFor(m.userId) }))}
            courses={publishedCourses}
          />
        </div>

        <section className="mt-8">
          <h3 className="mb-3 text-base font-bold text-slate-900">
            Members ({members.length})
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">Member</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Enrollments & progress</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const email = emailMap.get(m.userId);
                  const mp = progressByUser.get(m.userId);
                  return (
                    <tr key={m.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3">
                        {email ? (
                          <span className="font-medium text-slate-900">{email}</span>
                        ) : (
                          <span title={m.userId}>
                            <span className="font-mono text-xs text-slate-600">
                              {m.userId.slice(0, 8)}…
                            </span>{" "}
                            <span className="text-xs text-slate-400">
                              (email unavailable — set SUPABASE_SERVICE_ROLE_KEY)
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            m.role === "admin"
                              ? "bg-[#0B2545] text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {m.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {!mp || mp.enrollments.length === 0 ? (
                          <span className="text-xs text-slate-400">No enrollments</span>
                        ) : (
                          <ul className="space-y-2">
                            {mp.enrollments.map((e) => (
                              <li key={e.courseId} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span className="font-medium text-slate-800">{e.courseTitle}</span>
                                <ProgressBar pct={e.pct} />
                                <span className="text-xs text-slate-400">
                                  {e.completedLessons}/{e.totalLessons} lessons
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Progress is computed server-side from lesson completions — clients never
            report their own %.
          </p>
        </section>
      </main>
    </div>
  );
}
