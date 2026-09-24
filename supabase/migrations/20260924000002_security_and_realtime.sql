-- Access rules for the demo.
--
-- IMPORTANT: this app has no sign-in yet. The browser talks to Supabase with the
-- public "anon" key, so anyone who has the site can read and change demo rows.
-- That is fine for fake demo data. It is NOT fine for real students or businesses.
-- Before real data goes in: add Supabase Auth and replace the "using (true)"
-- policies below with rules based on auth.uid(). See README, "Before real users".

alter table public.students      enable row level security;
alter table public.smes          enable row level security;
alter table public.internships   enable row level security;
alter table public.applications  enable row level security;
alter table public.notifications enable row level security;

-- Start from nothing, then grant only what the app needs.
revoke all on public.students, public.smes, public.internships,
              public.applications, public.notifications from anon, authenticated;

-- The app never creates students or businesses, and never deletes anything except notifications.
grant select, update          on public.students      to anon, authenticated;
grant select, update          on public.smes          to anon, authenticated;
grant select, insert, update  on public.internships   to anon, authenticated;
grant select, insert, update  on public.applications  to anon, authenticated;
grant select, insert, update, delete on public.notifications to anon, authenticated;

create policy "demo read"   on public.students      for select to anon, authenticated using (true);
create policy "demo update" on public.students      for update to anon, authenticated using (true) with check (true);

create policy "demo read"   on public.smes          for select to anon, authenticated using (true);
create policy "demo update" on public.smes          for update to anon, authenticated using (true) with check (true);

create policy "demo read"   on public.internships   for select to anon, authenticated using (true);
create policy "demo insert" on public.internships   for insert to anon, authenticated with check (true);
create policy "demo update" on public.internships   for update to anon, authenticated using (true) with check (true);

create policy "demo read"   on public.applications  for select to anon, authenticated using (true);
create policy "demo insert" on public.applications  for insert to anon, authenticated with check (true);
create policy "demo update" on public.applications  for update to anon, authenticated using (true) with check (true);

create policy "demo read"   on public.notifications for select to anon, authenticated using (true);
create policy "demo insert" on public.notifications for insert to anon, authenticated with check (true);
create policy "demo update" on public.notifications for update to anon, authenticated using (true) with check (true);
create policy "demo delete" on public.notifications for delete to anon, authenticated using (true);

-- Live updates: a change in one browser shows up in another.
-- The publication exists on Supabase. The guard keeps this file runnable on plain Postgres too.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table
      public.students, public.smes, public.internships, public.applications, public.notifications;
  end if;
end $$;
