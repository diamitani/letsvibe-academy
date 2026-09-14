# LetsVibeAI Academy v2

A real e-learning platform rebuilt from the static letsvibeai.com site — courses with
chapters/lessons, learner progress + certificates, video tracks, a resource library,
a tools directory, a newsletter, a **teacher dashboard** (`/teach`) for course authoring,
and a **company admin dashboard** (`/company`) for corporate seats and progress analytics.

## Stack

- **Next.js 16** App Router + React 19 + TypeScript + Tailwind CSS v4
- **Auth:** Supabase Auth (`@supabase/ssr` server, `@supabase/supabase-js` client)
- **Data:** Prisma 6 + Postgres on Supabase — transaction pooler (6543) for runtime
  `DATABASE_URL`, session pooler (5432) for `DIRECT_URL`/migrations (same pattern as Lola)
- **Forms:** react-hook-form + zod (shared schemas in `lib/teach-schemas.ts`,
  also `@hookform/resolvers` available)
- **Newsletter:** Resend (API route + cron route stubbed; no live key yet)
- **v1: no Stripe.** Free enrollment for individuals; corporate seats assigned manually.

## Setup

```bash
cd ~/workspace/letsvibeai-rebuild/app

# 1. Install dependencies
npm install

# 2. Environment — copy and fill in (see ENV-CHECKLIST.md for where each value comes from)
cp .env.example .env

# 3. Database — run migrations against DIRECT_URL (session pooler, port 5432).
#    Migrations cannot run through the transaction pooler.
npx prisma migrate deploy        # first deploy / CI
# npx prisma migrate dev         # local iteration (creates a migration)

# 4. Generate the Prisma client (also needed before `next build`)
npx prisma generate

# 5. Seed the content library (courses, chapters, lessons, tracks, tools, resources)
npm run seed

# 6. Dev server
npm run dev                      # http://localhost:3000
```

Useful: `npx prisma studio` to browse data.

## Vercel deploy

1. Import the repo; set the **Root Directory** to `app/` (or deploy the `app/` folder).
2. Add every variable from `.env.example` in Vercel → Project → Settings → Environment Variables.
3. `CRON_SECRET`: generate with `openssl rand -hex 32`. The same value must be in env vars **and** presented by the cron caller (query `?secret=` or `Authorization: Bearer` header — see `vercel.json` below).
4. Make sure the Prisma client is generated at build time: set Build Command to `prisma generate && next build`.
5. Run migrations from your own machine (`npx prisma migrate deploy` with `DIRECT_URL` set) — Vercel does not run them.

`vercel.json` (newsletter cron):

```json
{
  "crons": [
    { "path": "/api/cron/newsletter-daily", "schedule": "0 9 * * *" }
  ]
}
```

Pass the secret as `?secret=$CRON_SECRET` on the path or as an `Authorization: Bearer` header, depending on your cron caller.

## Route map

| Route | What | Owner |
|---|---|---|
| `/` | Marketing landing | B |
| `/academy` | Learner dashboard: enrollments, progress, certificates | C |
| `/courses`, `/courses/[slug]` | Browse + course player | B / C |
| `/tracks`, `/tracks/[slug]`, `/library`, `/tools` | Video tracks, resources, tools | B |
| `/certificates/[code]` | Public certificate verification | C |
| **`/teach`** | **Teacher dashboard** — my courses (or all if allowlisted), new-course form, publish toggles | D |
| **`/teach/courses/[id]`** | **Course editor** — course fields; chapters (add / rename / publish / free-preview / delete / ↑↓ simple position swap); per-chapter lessons (add / edit / delete) | D |
| **`/company`** | **Company admin** — my companies (+selector), member list with server-computed per-course progress, add member (email or user ID), assign seats | D |
| `/api/teach/courses` | `GET` list mine · `POST` create | D |
| `/api/teach/courses/[id]` | `GET` · `PUT` · `DELETE` (blocked while enrollments/seats/certs exist) | D |
| `/api/teach/chapters` | `POST` create (position = max+1) | D |
| `/api/teach/chapters/[id]` | `PUT` (title/position/isPublished/isFreePreview; position = simple swap) · `DELETE` | D |
| `/api/teach/lessons` | `POST` create (position = max+1) | D |
| `/api/teach/lessons/[id]` | `PUT` · `DELETE` | D |
| `/api/company/companies` | `GET` my admin companies · `POST` create + become admin | D |
| `/api/company/members` | `POST` add member by `userId` or `email` (email needs `SUPABASE_SERVICE_ROLE_KEY`) | D |
| `/api/company/seats` | `POST` assign seat → SeatAssignment + auto-Enrollment | D |
| `/api/newsletter/subscribe`, `/api/cron/newsletter-daily` | Newsletter | C |
| `/api/enroll`, `/api/progress`, `/api/certificates/issue` | Learner mutations (server-authoritative) | C |

## Access control (v1 — simple, enforced in `lib/access.ts`)

- `/teach` pages and `/api/teach/*` require a **logged-in user**.
- Teacher **actions** additionally require the user to be the course's `createdBy` **or** to have an email in the `TEACHER_EMAILS` allowlist (comma-separated). Allowlisted users see and may edit **all** courses.
- `/company` pages and `/api/company/*` require a **logged-in user**.
- Company admin actions require a `CompanyMember` row with `role="admin"` for that company.
- Every API route re-checks authorization server-side; UI gates are convenience only.

## v1 limitations (honest)

- **No Stripe.** Individual enrollment is free; corporate seats are assigned manually by a company admin. No seat limits, no billing.
- **Email → user lookup needs `SUPABASE_SERVICE_ROLE_KEY`.** Without it, company admins can only add members by Supabase user ID; the UI shows an honest banner and the API returns 501 with instructions instead of failing silently.
- **Chapter reordering is a simple position swap** (↑/↓ buttons swap with the neighbor), not drag-and-drop — labeled as such in the UI.
- **Lessons have no per-lesson publish flag** (schema contract) — visibility is inherited from chapter + course publish state; the UI notes this.
- **Course delete is blocked (409)** while enrollments, seat assignments, or certificates reference the course — unpublish instead of destroying learner data.
- **New members are always `role="member"`** — no admin promotion in v1.
- Teacher auth is an ownership + allowlist check, not a full RBAC system.

## QA status (admin side + docs — agent D scope)

- [x] All code original; no reference code copied.
- [x] Verified against the real sibling-built contract: `lib/db.ts` exports `db`, `lib/supabase/server.ts` exports `getUser(): Promise<User | null>`, `prisma/schema.prisma` models/fields/relations/`@@unique` names all match the code (compound uniques `companyId_userId`, `courseId_userId`, `userId_courseId`, `userId_lessonId`; `LessonKind`/`CompanyRole` enums; cascade deletes on chapter/lesson/progress/enrollment/seat/certificate relations). Login page confirmed at `/login` (`app/(auth)/login` route group), matching `LOGIN_PATH`.
- [x] All mutations server-authoritative: progress % computed in `lib/company-progress.ts` from `Progress` rows; every teach/company API route re-validates auth + ownership/admin role and zod-validates bodies.
- [x] Secrets: service-role key is server-only (`lib/supabase/admin.ts`), never imported by client components; `.env.example` holds placeholders only.
- [x] Design: admin UI uses the shared navy `#0B2545` / hover `#12325E` to match the auth/learner pages.
- [ ] **Not yet run:** `npm install` was intentionally not run (per task instructions), so `tsc --noEmit` and `next build` could not execute here — code was typechecked **by inspection** against the real schema and sibling modules. Run `npm install`, then `npx tsc --noEmit`, then `npm run build` before shipping.
- [ ] **Runtime smoke test still needed:** new course → add chapters → reorder → add lessons → publish toggles → delete flows; company create → add member (by email with key, and the 501 path without) → assign seat → progress table.
- [ ] **Flag for agent A:** `npm run seed` invokes `tsx`, which is not in `devDependencies` — `npm run seed` will fail on a fresh install unless `tsx` is added (or run via `npx -y tsx`).
