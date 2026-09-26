-- Key/value settings used by src/middleware.js and SiteStatusToggle
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Middleware reads with the anon key, so anyone may read
drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read"
  on public.site_settings for select
  using (true);

-- Only logged-in dashboard users may change settings
drop policy if exists "site_settings auth insert" on public.site_settings;
create policy "site_settings auth insert"
  on public.site_settings for insert
  to authenticated
  with check (true);

drop policy if exists "site_settings auth update" on public.site_settings;
create policy "site_settings auth update"
  on public.site_settings for update
  to authenticated
  using (true)
  with check (true);

insert into public.site_settings (key, value)
values ('under_construction', 'false')
on conflict (key) do nothing;

-- Make PostgREST pick up the new table immediately
notify pgrst, 'reload schema';
