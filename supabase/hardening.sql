-- Lab 7 follow-up: four gaps found by testing the rules against the table.
-- Run once, by hand, in the Supabase SQL Editor.
--
-- 1. status and created_at were settable from the console. The form never
--    sends them, but "the contributor cannot set it" has to hold for requests
--    that never touch the form. Until Sprint 3 designs submit-review-publish,
--    the only valid status is 'published' — loosen this check then.
--    created_at is forced by a trigger: on insert it is now(), on update it
--    cannot change. (It also means a future bulk seed cannot choose its own
--    timestamps; drop the trigger first if that is ever needed.)
--
-- 2. Storage's remove() only deletes objects it can first see, and Part 0
--    gave contributors no SELECT policy, so removing their own photo
--    silently did nothing. Own folder only; the bucket stays public, so
--    readers of the archive are unaffected.

alter table entries
  add constraint entries_status_published check (status = 'published');

create or replace function entries_lock_created_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := now();
  else
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;

create trigger entries_lock_created_at
  before insert or update on entries
  for each row execute function entries_lock_created_at();

create policy "contributors see their own photos"
  on storage.objects for select to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

-- 3. slug. The rules say a contributor cannot change it later: it is the
--    entry's address, so changing it would break every saved link. The form
--    never sends it, but nothing stopped a direct request. Unlike created_at
--    this one refuses loudly rather than silently keeping the old value, so a
--    caller learns the change did not happen. The app never updates a slug, so
--    nothing it does is affected; setting it to its current value is allowed.
create or replace function entries_lock_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.slug is distinct from old.slug then
    raise exception 'An entry''s slug cannot be changed'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger entries_lock_slug
  before update on entries
  for each row execute function entries_lock_slug();

-- 4. photo. The rules say a photo is required, and until now only the form
--    said so: the column was nullable. NOT NULL closes the direct-request route
--    (an insert with no photo, or an update that sets it to null), and the check
--    rejects an empty or whitespace-only value, which NOT NULL alone lets
--    through. All ten existing entries already had a photo. Together with
--    entries_photo_note_length, every entry now needs a photo and a 10-300
--    character note describing it.
alter table entries
  alter column photo set not null,
  add constraint entries_photo_present check (char_length(trim(photo)) > 0);
