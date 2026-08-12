-- =============================================================================
-- LetsVibeAI — Builder Workspace
-- Supabase PostgreSQL Migration 00002 (idempotent, IF NOT EXISTS throughout)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- builder_projects — one row per learner project in the workspace
-- ---------------------------------------------------------------------------
create table if not exists public.builder_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  brief text not null,
  status text not null default 'draft'
    check (status in ('draft', 'planning', 'planned', 'building', 'done')),
  pal_plan jsonb,
  contract jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists builder_projects_user_id_idx
  on public.builder_projects (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- builder_messages — chat history for each project (PAL coach)
-- ---------------------------------------------------------------------------
create table if not exists public.builder_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.builder_projects(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);

create index if not exists builder_messages_project_id_idx
  on public.builder_messages (project_id, created_at asc);

-- ---------------------------------------------------------------------------
-- RLS — owners only
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Owners can view their builder projects' and tablename = 'builder_projects'
  ) then
    alter table public.builder_projects enable row level security;
    create policy "Owners can view their builder projects"
      on public.builder_projects for select using (auth.uid() = user_id);
    create policy "Owners can insert their builder projects"
      on public.builder_projects for insert with check (auth.uid() = user_id);
    create policy "Owners can update their builder projects"
      on public.builder_projects for update using (auth.uid() = user_id);
    create policy "Owners can delete their builder projects"
      on public.builder_projects for delete using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where policyname = 'Owners can view their builder messages' and tablename = 'builder_messages'
  ) then
    alter table public.builder_messages enable row level security;
    create policy "Owners can view their builder messages"
      on public.builder_messages for select using (
        exists (select 1 from public.builder_projects p where p.id = project_id and p.user_id = auth.uid())
      );
    create policy "Owners can insert their builder messages"
      on public.builder_messages for insert with check (
        exists (select 1 from public.builder_projects p where p.id = project_id and p.user_id = auth.uid())
      );
  end if;
end $$;

-- Keep updated_at fresh
create or replace function public.touch_builder_project()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists builder_projects_touch on public.builder_projects;
create trigger builder_projects_touch
  before update on public.builder_projects
  for each row execute function public.touch_builder_project();
