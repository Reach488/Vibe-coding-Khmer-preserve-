-- Admin: one or more people who may edit and delete ANY entry.
-- Run once, by hand, in the Supabase SQL Editor, then add yourself (last step).
--
-- The lock is here, not in the interface. Hiding the buttons from everyone
-- else is politeness; these policies are what actually refuse a stranger.
--
-- Nobody can make themselves an admin: the table has no insert, update or
-- delete policy, so the only way in is this SQL Editor, which runs as the
-- project owner.

create table admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table admins enable row level security;

-- A signed-in user may see only their own row. That is all the app needs to
-- ask "am I an admin?", and it does not reveal who else is.
create policy "users see their own admin row"
  on admins for select to authenticated
  using (user_id = (select auth.uid()));

-- Used by the policies below. security definer so it can read admins whatever
-- the caller's own access; search_path is pinned so it cannot be redirected.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  )
$$;

-- Edit and delete any entry. These sit beside the owner policies; Postgres
-- allows a row when any one policy for the command allows it.
create policy "admins edit any entry"
  on entries for update to authenticated
  using (is_admin());

create policy "admins delete any entry"
  on entries for delete to authenticated
  using (is_admin());

-- Photos: deleteEntry and updateEntry remove the old file from storage, and
-- storage only deletes objects it can see, so an admin needs select as well.
create policy "admins see any photo"
  on storage.objects for select to authenticated
  using (bucket_id = 'photos' and is_admin());

create policy "admins delete any photo"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and is_admin());

-- Last step: make yourself an admin. Replace the email with the one you sign
-- in to the archive with, and run this line alone.
--
--   insert into admins (user_id)
--   select id from auth.users where email = 'you@example.com';
