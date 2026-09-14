# ENV Checklist — LetsVibeAI Academy v2

For each variable: what it is, where to get it, and what breaks without it.
Copy `.env.example` → `.env` for local dev; set the same values in
Vercel → Project → Settings → Environment Variables for production.

## Database

### `DATABASE_URL` — **required**
- **What:** Postgres connection string via Supabase's **transaction pooler** (port **6543**), with `?pgbouncer=true` appended. Prisma uses this at runtime.
- **Where:** Supabase dashboard → Project Settings → Database → Connection string → **Transaction pooler** (URI). Replace `[YOUR-PASSWORD]` with the database password.
- **Breaks without it:** everything — the app cannot start or query any data. Prisma will throw `P1001`/`P1013`-style connection errors on every page.

### `DIRECT_URL` — **required for migrations**
- **What:** Postgres connection string via Supabase's **session pooler** (port **5432**). Used only by `prisma migrate` / `prisma db push` (migrations can't run through the transaction pooler).
- **Where:** Supabase dashboard → Project Settings → Database → Connection string → **Session pooler** (URI).
- **Breaks without it:** `prisma migrate deploy` / `prisma db push` fail. Runtime is unaffected once migrations are applied.

## Supabase Auth

### `NEXT_PUBLIC_SUPABASE_URL` — **required**
- **What:** Your Supabase project URL (`https://[ref].supabase.co`). Public; safe to expose.
- **Where:** Supabase dashboard → Project Settings → API → Project URL.
- **Breaks without it:** sign-in/sign-up and every authenticated page/API route (`/teach`, `/company`, `/academy`) fail.

### `NEXT_PUBLIC_SUPABASE_ANON_KEY` — **required**
- **What:** Supabase **anon** public key. Used by the browser client and server components to talk to Supabase Auth.
- **Where:** Supabase dashboard → Project Settings → API → `anon` `public` key.
- **Breaks without it:** same as above — auth is dead.

### `SUPABASE_SERVICE_ROLE_KEY` — **optional but recommended**
- **What:** Supabase **service_role** secret key. **Server-only** (never `NEXT_PUBLIC_`, never in client code).
- **Where:** Supabase dashboard → Project Settings → API → `service_role` `secret` key.
- **Breaks without it:** the company-admin **email → user lookup** stops working. `/company` shows an honest amber banner and `POST /api/company/members` returns **501** for email adds with instructions. Workaround: add members by their Supabase user ID. Everything else (teach side, enrollments, progress) keeps working. Treat a leak like a password reset: roll it in Supabase dashboard → API.

## Email / newsletter

### `RESEND_API_KEY` — **optional (newsletter only)**
- **What:** Resend API key for sending the newsletter.
- **Where:** Resend dashboard → API Keys → Create.
- **Breaks without it:** `POST /api/newsletter/subscribe` still collects subscribers (DB write), but `/api/cron/newsletter-daily` cannot send anything — it logs and skips. No other feature is affected.

### `CRON_SECRET` — **required for the newsletter cron**
- **What:** A long random string guarding `/api/cron/newsletter-daily` (`Authorization: Bearer <secret>` or `?secret=`). Prevents anyone on the internet from triggering sends.
- **Where:** generate locally — `openssl rand -hex 32` — then set the **same** value in `.env`, Vercel env vars, and the cron caller's headers (see `vercel.json`).
- **Breaks without it:** the cron route returns **401** and no newsletter is ever sent.

## Site

### `NEXT_PUBLIC_SITE_URL` — **required**
- **What:** Public base URL of the deployment (e.g. `https://academy.letsvibeai.com`; `http://localhost:3000` locally).
- **Where:** you decide; in Vercel it's your production domain.
- **Breaks without it:** certificate verification links, emails, and metadata fall back to relative URLs and may point at the wrong host.

## Teacher allowlist

### `TEACHER_EMAILS` — **optional (empty = off)**
- **What:** Comma-separated emails (e.g. `"you@example.com,cofounder@example.com"`) granted teacher powers over **all** courses. Without it, teachers can only manage courses they created (`createdBy` = their user id).
- **Where:** you decide — the course owners' emails.
- **Breaks without it:** nothing breaks; the dashboard simply scopes each teacher to their own courses. See `lib/access.ts` for the full v1 access-control rules.

## Quick sanity check

```bash
# From ~/workspace/letsvibeai-rebuild/app:
node -e "for (const k of ['DATABASE_URL','DIRECT_URL','NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','NEXT_PUBLIC_SITE_URL']) { if (!process.env[k]) console.log('MISSING:', k) }" 
# (load .env first, e.g. via `set -a; source .env; set +a`)
```
