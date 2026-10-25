-- Lab 10, Part 2: the review gate. Run once, by hand, in the Supabase SQL
-- Editor. begin/commit make it all-or-nothing.
--
-- Sprint 2's hardening.sql pinned status to always 'published'
-- (entries_status_published) with a comment saying to loosen it once
-- Sprint 3 designed submit-review-publish. This is that day: the old
-- constraint is dropped before the new one is added, or the two would
-- contradict each other and status could never be anything else.

begin;

alter table entries drop constraint entries_status_published;

alter table entries
  alter column status set default 'pending',
  add constraint entries_status_values check (status in ('pending', 'published', 'returned'));

-- Everything already in the archive came from the curator and real sources:
-- publish it. (No-op today — every row is already 'published' — kept so
-- this file is a complete record of what Part 2 asked for.)
update entries set status = 'published';

-- Who can review: a list only the SQL Editor can change. Row-level security
-- is on with no policies at all, so the API can neither read nor write it.
create table reviewers (
  user_id uuid primary key references auth.users (id)
);
alter table reviewers enable row level security;
insert into reviewers (user_id) values ('a4a773de-e49d-4e2e-9f0b-7b48685b67db');

-- A yes/no question any request can ask. security definer so it can read
-- reviewers on the caller's behalf without anyone being granted access to
-- the table itself; search_path is pinned so it cannot be redirected.
create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.reviewers where user_id = (select auth.uid()));
$$;

-- Reading: everyone sees published, an owner sees their own at any status,
-- a reviewer sees everything.
drop policy "anyone can read entries" on entries;
create policy "anyone can read published entries"
  on entries for select
  using (status = 'published' or (select auth.uid()) = owner or (select public.is_reviewer()));

-- Adding: your own, and it waits for review. The default makes this true
-- even when the app sends no status at all.
drop policy "owners add their own entries" on entries;
create policy "owners add their own entries"
  on entries for insert to authenticated
  with check ((select auth.uid()) = owner and status = 'pending');

-- Editing: your own, and an edit goes back to review unless you're a
-- reviewer. Same shape as the admin policies in admin.sql: a role gets a
-- narrow allowance, never a blank check.
drop policy "owners edit their own entries" on entries;
create policy "owners edit their own entries"
  on entries for update to authenticated
  using ((select auth.uid()) = owner)
  with check ((select auth.uid()) = owner and (status = 'pending' or (select public.is_reviewer())));

-- The one door reviewers use, and it only moves status. Refuses anyone not
-- on the list, refuses any decision but published/returned, and only
-- touches a row that is still pending — never someone else's published
-- entry. Reviewers do not get a general update grant; they get this.
create or replace function public.review_entry(entry_id uuid, decision text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_reviewer() then
    return false;
  end if;
  if decision not in ('published', 'returned') then
    return false;
  end if;
  update public.entries set status = decision
    where id = entry_id and status = 'pending';
  return found;
end;
$$;
revoke execute on function public.review_entry(uuid, text) from public, anon;
grant execute on function public.review_entry(uuid, text) to authenticated;

commit;
