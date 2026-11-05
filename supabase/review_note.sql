-- Lab 11, "if you finish early": a returned entry carries the reviewer's
-- reason. Run once, by hand, in the Supabase SQL Editor. This replaces the
-- two-argument review_entry from gate.sql; begin/commit make it all or nothing.
--
-- Read before running:
-- - The note is only ever set on 'returned'. Publishing clears it, so a
--   published entry never shows an old note to the public.
-- - Nothing else about the function changes: still reviewers only, still
--   only 'published' or 'returned', still only a row that is still pending.
-- - authenticated has table-level insert/update on entries, so a contributor
--   could write review_note on their own entry. That is harmless: only the
--   owner and the reviewer can see a returned row, and publishing wipes it.

begin;

-- 1. a place for the note
alter table entries add column review_note text;

-- 2. swap the old two-argument door for one that also takes a note
drop function public.review_entry(uuid, text);

create function public.review_entry(entry_id uuid, decision text, note text default null)
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
  update public.entries
    set status = decision,
        review_note = case when decision = 'returned' then note else null end
    where id = entry_id and status = 'pending';
  return found;
end;
$$;
revoke execute on function public.review_entry(uuid, text, text) from public, anon;
grant execute on function public.review_entry(uuid, text, text) to authenticated;

commit;
