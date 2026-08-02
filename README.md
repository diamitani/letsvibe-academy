# LetsVibeAI — The AI Building Academy

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com)

> **Source:** [github.com/diamitani/letsvibe-academy](https://github.com/diamitani/letsvibe-academy)

Turn your ideas into tested, presentable projects with structured lessons, an AI-powered workspace, and safe project sandboxes. LetsVibeAI is the practical AI-building academy for curious builders, early founders, and creatives.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

LetsVibeAI teaches a structured progression: AI foundations, vibe coding, tool selection, prompt chaining, context engineering, and process engineering — plus free hands-on labs. The platform is being redesigned to add:

- **Free account** access to the six-module curriculum and three labs
- **Builder Workspace ($5/mo)**: PAL project planner, curriculum-aware chat, sandbox projects, prompt history
- **Pro Builder**: More projects, advanced templates, collaboration, deployment readiness
- **Project Gallery**: Learner portfolios with before/after milestones

### Product Principles

- Keep foundational learning free after account creation
- Sell guided execution, persistent workspaces, feedback, templates, and higher usage
- Teach responsible building: scope, source awareness, privacy, testability
- Every course lesson leads to an observable learner action and portfolio artifact

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS v3.4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Auth** | [NextAuth.js v4 (Auth.js)](https://next-auth.js.org) — Google OAuth + Email/Password |
| **Database** | [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage) |
| **Payments** | [Stripe](https://stripe.com) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) + [PostHog](https://posthog.com) (optional) |
| **Email** | [Resend](https://resend.com) |
| **Infrastructure** | AWS (sandbox execution, isolated environments) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 9 (install via `npm i -g pnpm`)
- A [Supabase](https://supabase.com) project (free tier works)
- A [Google Cloud](https://console.cloud.google.com) project for OAuth

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/diamitani/letsvibe-academy.git
cd letsvibe-academy

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Fill in required variables (see below)
#    - NEXTAUTH_SECRET
#    - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
#    - NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY

# 5. Apply database migrations (see Database Setup)

# 6. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

See `.env.example` for all available variables. Required variables for local development:

| Variable | Description | How to Get |
|---|---|---|
| `NEXTAUTH_SECRET` | NextAuth encryption key | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Auth callback URL | `http://localhost:3000` (dev) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase → Settings → API |

### Google OAuth Setup

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add Authorized Redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)

---

## Database Setup

The application uses Supabase PostgreSQL with a full relational schema managed via SQL migrations.

### 1. Run Migrations

Apply the initial migration to your Supabase project:

```bash
# Option A: Via Supabase CLI
supabase link --project-ref <your-project-ref>
supabase db push

# Option B: Copy/paste into Supabase SQL Editor
# Copy the contents of supabase/migrations/00001_initial_schema.sql
# Paste into: https://app.supabase.com → SQL Editor → New Query → Run
```

### 2. Schema Overview

The migration creates the following tables with Row-Level Security (RLS):

| Table | Purpose |
|---|---|
| `profiles` | Public user profiles (1:1 with `auth.users`) |
| `plans` | Subscription plans (Free, Builder, Pro Builder) |
| `subscriptions` | User plan assignments with Stripe integration |
| `modules` | Learning curriculum modules |
| `lessons` | Individual lessons within modules |
| `labs` | Hands-on practice labs |
| `lesson_progress` | Per-user lesson completion tracking |
| `lab_progress` | Per-user lab completion tracking |
| `projects` | Builder workspace projects with PAL artifacts |
| `milestones` | Project milestone tracking |
| `decision_log` | Project decision audit trail |
| `sandbox_runs` | Ephemeral sandbox execution records |
| `analytics_events` | Funnel and product analytics |
| `newsletter_subscriptions` | Newsletter email subscriptions |

All tables have Row-Level Security enabled. Users can only access their own data.

### Triggers & Functions

- **`handle_new_user()`** — Auto-creates a `profiles` record when a user signs up
- **`get_user_plan()`** — Returns a user's current plan and feature limits
- **`count_user_projects()`** — Counts active (non-archived) projects for entitlement checks
- **`update_updated_at_column()`** — Auto-updates `updated_at` on profile, project, and subscription changes

---

## Authentication

### Auth Flow

```
Visitor → Sign Up (Google OAuth or Email/Password) → Free Account → Dashboard
         ↓
    Email + Password: Validated (8+ chars, uppercase, lowercase, number)
    Google OAuth: Redirect to Google → Authorize → Callback
         ↓
    Auto-created: Profile record + Free plan subscription
    JWT session stored in HTTP-only cookie (30-day expiry)
```

### Protected Routes

The following routes require authentication (configured in `middleware.ts`):

- `/dashboard` — User dashboard
- `/workspace` — Builder workspace
- `/projects` — Project management
- `/learn` — Learning path
- `/settings` — Account settings
- `/profile` — Profile management
- `/checkout` — Subscription checkout

Signed-in users visiting `/auth/signin` or `/auth/signup` are redirected to `/dashboard`.

### NextAuth Configuration

See `lib/auth.ts` for the full configuration:

- **JWT strategy** (stateless, no DB session table needed)
- **Google Provider** with offline access and account selection prompt
- **Email Credentials Provider** with sign-up and sign-in flows
- **Password hashing** via bcryptjs (12 salt rounds)
- **Automatic free plan assignment** on account creation
- **Type-augmented session** with `id`, `email`, and `name`

---

## Project Structure

```
.
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API route
│   ├── auth/
│   │   ├── signin/              # Sign-in page
│   │   ├── signup/              # Sign-up page
│   │   └── error/               # Auth error page
│   ├── blog/                    # Blog/articles
│   ├── dashboard/               # Protected dashboard (requires auth)
│   ├── newsletter/              # Newsletter archive
│   ├── tools/                   # AI tools directory
│   ├── videos/                  # Video content
│   ├── globals.css              # Global styles + CSS variables
│   ├── layout.tsx               # Root layout (providers)
│   └── page.tsx                 # Home page
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── header.tsx               # Navbar with auth-aware UI
│   ├── footer.tsx               # Site footer
│   ├── hero.tsx                 # Home page hero (auth-aware CTAs)
│   ├── session-provider.tsx     # NextAuth SessionProvider wrapper
│   └── ...                      # Feature components
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client
│   │   └── server.ts            # Server Supabase client
│   └── utils.ts                 # Utility functions (cn, etc.)
├── supabase/
│   └── migrations/
│       └── 00001_initial_schema.sql  # Full database schema
├── types/
│   └── next-auth.d.ts           # NextAuth type augmentations
├── middleware.ts                 # Auth middleware (route protection)
├── .env.example                  # Environment variable template
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
pnpm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables
vercel env add NEXTAUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXTAUTH_URL  # Your production URL

# 4. Redeploy with env vars
vercel --prod
```

### Production Checklist

- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Add production URL to Google OAuth authorized redirects
- [ ] Enable Row-Level Security on all Supabase tables (done by migration)
- [ ] Set `NODE_ENV=production`
- [ ] Rotate `NEXTAUTH_SECRET` for production
- [ ] Verify email confirmation is enabled in Supabase Auth settings (disable for MVP if needed)
- [ ] Configure Stripe webhook endpoint for production
- [ ] Set up monitoring (Sentry, PostHog — optional)

---

## Architecture Decision Records

Key architectural decisions shaping this project:

| Decision | Rationale |
|---|---|
| **Supabase over raw AWS RDS** | Managed Postgres with built-in Auth, RLS, and Storage. Faster to ship, still AWS-hosted |
| **NextAuth JWT strategy** | Stateless sessions. No session table needed. Simpler scaling |
| **Email + Google OAuth only** | Covers ~98% of target audience. GitHub OAuth can be added later |
| **Free plan auto-assignment** | Every sign-up gets the free plan. No dead-end UX |
| **RLS on all tables** | Defense in depth. API routes don't need to check ownership in app code |
| **bcryptjs over bcrypt** | Pure JS, no native dependencies, works everywhere |
| **Migration-based schema** | Single SQL file is the source of truth. No ORM overhead for MVP |

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm lint` to check for issues
4. Open a PR against `main` with a clear description

PRs should include:
- A clear description of what changed and why
- Any new environment variables documented
- Migration SQL if schema changes are needed

---

## License

Private repository. All rights reserved.

---

**Built with Next.js, Supabase, and NextAuth.js. Deployed on Vercel.**