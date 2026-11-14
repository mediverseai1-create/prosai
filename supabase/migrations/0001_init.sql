-- ProsAI initial schema. Run in the Supabase SQL editor or via `supabase db push`.

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icp text not null default '',
  created_at timestamptz not null default now()
);

create table public.memberships (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table public.subscriptions (
  org_id uuid primary key references public.organizations(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','launch','growth','enterprise')),
  status text not null default 'active' check (status in ('active','canceled','past_due')),
  external_id text,
  updated_at timestamptz not null default now()
);

create table public.lead_tables (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  columns text[] not null default '{}',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.lead_tables (org_id);

create table public.lead_rows (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.lead_tables(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  data jsonb not null default '{}',
  enrichment jsonb not null default '{}',
  ai jsonb,
  created_at timestamptz not null default now()
);
create index on public.lead_rows (table_id);
create index on public.lead_rows (org_id);

create table public.usage_events (
  id bigint generated always as identity primary key,
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  kind text not null,
  credits integer not null check (credits > 0),
  created_at timestamptz not null default now()
);
create index on public.usage_events (org_id, created_at);

create or replace function public.is_member(p_org uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.memberships m where m.org_id = p_org and m.user_id = auth.uid());
$$;

-- Every new user gets a workspace, owner membership and a free subscription.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare new_org uuid;
begin
  insert into public.organizations (name)
  values (coalesce(split_part(new.email, '@', 1), 'My') || '''s workspace')
  returning id into new_org;
  insert into public.memberships (org_id, user_id, role) values (new_org, new.id, 'owner');
  insert into public.subscriptions (org_id) values (new_org);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.subscriptions enable row level security;
alter table public.lead_tables enable row level security;
alter table public.lead_rows enable row level security;
alter table public.usage_events enable row level security;

create policy "org members read" on public.organizations for select using (public.is_member(id));
create policy "org members update" on public.organizations for update using (public.is_member(id)) with check (public.is_member(id));

create policy "own memberships read" on public.memberships for select using (user_id = auth.uid());

-- Subscriptions and usage are written only by the service role (server/webhook).
create policy "members read subscription" on public.subscriptions for select using (public.is_member(org_id));
create policy "members read usage" on public.usage_events for select using (public.is_member(org_id));

create policy "members manage tables" on public.lead_tables for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy "members manage rows" on public.lead_rows for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
