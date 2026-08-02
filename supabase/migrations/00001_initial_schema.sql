-- =============================================================================
-- LetsVibeAI — Idempotent Production Database Schema
-- Supabase PostgreSQL Migration 00001
-- Safe to run multiple times — uses IF NOT EXISTS throughout
-- =============================================================================

-- =============================================================================
-- Profiles — public user profiles (1:1 with auth.users)
-- =============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  bio text,
  skill_level text check (skill_level in ('beginner', 'intermediate', 'advanced')),
  learning_goal text,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Users can view their own profile' and tablename = 'profiles'
  ) then
    alter table public.profiles enable row level security;
    create policy "Users can view their own profile"
      on public.profiles for select using (auth.uid() = id);
    create policy "Users can update their own profile"
      on public.profiles for update using (auth.uid() = id);
    create policy "Users can insert their own profile"
      on public.profiles for insert with check (auth.uid() = id);
  end if;
end $$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Subscription Plans
-- =============================================================================
create table if not exists public.plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  price_monthly_usd integer,
  project_limit integer not null default 1,
  sandbox_limit integer not null default 0,
  workspace_chat boolean default false,
  pal_brief_generation boolean default false,
  curriculum_aware_chat boolean default false,
  advanced_templates boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Seed default plans (safe on re-run)
insert into public.plans (id, name, slug, price_monthly_usd, project_limit, sandbox_limit, workspace_chat, pal_brief_generation, curriculum_aware_chat, advanced_templates)
values
  ('00000000-0000-0000-0000-000000000001', 'Free', 'free', null, 1, 0, false, false, false, false)
on conflict (id) do nothing;

insert into public.plans (id, name, slug, price_monthly_usd, project_limit, sandbox_limit, workspace_chat, pal_brief_generation, curriculum_aware_chat, advanced_templates)
values
  ('00000000-0000-0000-0000-000000000002', 'Builder', 'builder', 500, 3, 1, true, true, true, false)
on conflict (id) do nothing;

insert into public.plans (id, name, slug, price_monthly_usd, project_limit, sandbox_limit, workspace_chat, pal_brief_generation, curriculum_aware_chat, advanced_templates)
values
  ('00000000-0000-0000-0000-000000000003', 'Pro Builder', 'pro', 1500, 10, 3, true, true, true, true)
on conflict (id) do nothing;

alter table public.plans enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Anyone can view active plans' and tablename = 'plans'
  ) then
    create policy "Anyone can view active plans"
      on public.plans for select using (is_active = true);
  end if;
end $$;

-- =============================================================================
-- Subscriptions
-- =============================================================================
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start timestamp with time zone not null default now(),
  current_period_end timestamp with time zone,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.subscriptions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Users can view own subscriptions' and tablename = 'subscriptions'
  ) then
    create policy "Users can view own subscriptions"
      on public.subscriptions for select using (auth.uid() = user_id);
  end if;
end $$;

-- =============================================================================
-- Learning Modules, Lessons, Labs
-- =============================================================================
create table if not exists public.modules (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  sort_order integer not null default 0,
  is_published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  slug text not null,
  content text,
  video_url text,
  sort_order integer not null default 0,
  is_published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(module_id, slug)
);

create table if not exists public.labs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  sort_order integer not null default 0,
  is_published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.labs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Anyone can view published modules') then
    create policy "Anyone can view published modules" on public.modules for select using (is_published = true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Anyone can view published lessons') then
    create policy "Anyone can view published lessons" on public.lessons for select using (is_published = true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Anyone can view published labs') then
    create policy "Anyone can view published labs" on public.labs for select using (is_published = true);
  end if;
end $$;

-- =============================================================================
-- Learner Progress
-- =============================================================================
create table if not exists public.lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.lab_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lab_id uuid not null references public.labs(id) on delete cascade,
  started boolean default false,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, lab_id)
);

alter table public.lesson_progress enable row level security;
alter table public.lab_progress enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own lesson progress') then
    create policy "Users can view own lesson progress" on public.lesson_progress for select using (auth.uid() = user_id);
    create policy "Users can manage own lesson progress" on public.lesson_progress for all using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can view own lab progress') then
    create policy "Users can view own lab progress" on public.lab_progress for select using (auth.uid() = user_id);
    create policy "Users can manage own lab progress" on public.lab_progress for all using (auth.uid() = user_id);
  end if;
end $$;

-- =============================================================================
-- Builder Workspace — Projects
-- =============================================================================
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'planning', 'building', 'testing', 'completed', 'archived')),
  project_brief jsonb,
  project_contract jsonb,
  jtbd_report jsonb,
  build_playbook jsonb,
  starter_template text,
  is_public boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.projects enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own projects') then
    create policy "Users can view own projects" on public.projects for select using (auth.uid() = user_id);
    create policy "Anyone can view public projects" on public.projects for select using (is_public = true);
    create policy "Users can manage own projects" on public.projects for all using (auth.uid() = user_id);
  end if;
end $$;

-- =============================================================================
-- Milestones
-- =============================================================================
create table if not exists public.milestones (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'skipped')),
  sort_order integer not null default 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.milestones enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can manage own milestones') then
    create policy "Users can manage own milestones" on public.milestones for all
      using (
        exists (
          select 1 from public.projects
          where projects.id = milestones.project_id
          and projects.user_id = auth.uid()
        )
      );
  end if;
end $$;

-- =============================================================================
-- Decision Log
-- =============================================================================
create table if not exists public.decision_log (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  decision text not null,
  rationale text,
  alternatives jsonb,
  approved_by text,
  created_at timestamp with time zone default now()
);

alter table public.decision_log enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own decision logs') then
    create policy "Users can view own decision logs" on public.decision_log for select
      using (
        exists (
          select 1 from public.projects
          where projects.id = decision_log.project_id
          and projects.user_id = auth.uid()
        )
      );
  end if;
end $$;

-- =============================================================================
-- Sandbox Runs
-- =============================================================================
create table if not exists public.sandbox_runs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled', 'timed_out')),
  template text,
  run_log_url text,
  preview_url text,
  checkpoint_id text,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  duration_ms integer,
  exit_code integer,
  error_message text,
  created_at timestamp with time zone default now()
);

alter table public.sandbox_runs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own sandbox runs') then
    create policy "Users can view own sandbox runs" on public.sandbox_runs for select using (auth.uid() = user_id);
    create policy "Users can create sandbox runs" on public.sandbox_runs for insert with check (auth.uid() = user_id);
  end if;
end $$;

-- =============================================================================
-- Analytics Events
-- =============================================================================
create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  event_properties jsonb,
  page_url text,
  referrer text,
  user_agent text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_analytics_events_name on public.analytics_events(event_name);
create index if not exists idx_analytics_events_user on public.analytics_events(user_id);
create index if not exists idx_analytics_events_created on public.analytics_events(created_at);

alter table public.analytics_events enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own analytics') then
    create policy "Users can view own analytics" on public.analytics_events for select using (auth.uid() = user_id);
  end if;
end $$;

-- =============================================================================
-- Newsletter Subscriptions
-- =============================================================================
create table if not exists public.newsletter_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  subscribed boolean default true,
  preferences jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.newsletter_subscriptions enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Service can insert subscriptions') then
    create policy "Service can insert subscriptions" on public.newsletter_subscriptions for insert with check (true);
    create policy "Users can view own subscription" on public.newsletter_subscriptions for select using (auth.uid() = user_id);
  end if;
end $$;

-- =============================================================================
-- Helper Functions
-- =============================================================================
create or replace function public.get_user_plan(p_user_id uuid)
returns table(
  plan_name text,
  project_limit integer,
  sandbox_limit integer,
  workspace_chat boolean,
  pal_brief_generation boolean
) as $$
begin
  return query
  select
    p.name,
    p.project_limit,
    p.sandbox_limit,
    p.workspace_chat,
    p.pal_brief_generation
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.user_id = p_user_id
  and s.status = 'active'
  order by s.created_at desc
  limit 1;
end;
$$ language plpgsql security definer;

create or replace function public.count_user_projects(p_user_id uuid)
returns integer as $$
  select count(*)::integer from public.projects
  where user_id = p_user_id
  and status != 'archived';
$$ language sql security definer;

-- =============================================================================
-- Updated_at Triggers
-- =============================================================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_projects_updated_at on public.projects;
create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_subscriptions_updated_at on public.subscriptions;
create trigger update_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.update_updated_at_column();