-- Week 8 follow-up: two gaps found by Supabase's own security advisor, no
-- partner needed to surface these. Run once, by hand, in the Supabase SQL
-- Editor.
--
-- 1. entry_tags_ok() had no pinned search_path, unlike every other function
--    in this project (entries_lock_created_at, entries_lock_slug, is_admin).
--    Same fix, same reason: a caller cannot redirect it to a same-named
--    function in another schema.
create or replace function entry_tags_ok(tags text[])
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(bool_and(char_length(trim(tag)) between 1 and 20), true)
  from unnest(tags) as tag
$$;

-- 2. is_admin() is security definer so the entry policies can read the
-- admins table whatever the caller's own access, but that also means Postgres
-- lets it be called directly over the REST API by anyone, signed in or not —
-- not just invoked inside a policy. It still only ever answers true/false
-- about the caller's own auth.uid(), so an anonymous caller just gets false,
-- but there is no reason the function needs to be public. Revoking execute
-- does not touch the policies: a policy evaluates the function from inside
-- the database, not through a grant.
revoke execute on function is_admin() from public, anon, authenticated;
