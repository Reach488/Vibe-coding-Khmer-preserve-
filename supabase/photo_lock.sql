-- Week 9 security review follow-up. Run once, by hand, in the Supabase SQL
-- Editor. begin/commit make it all-or-nothing.
--
-- 1. photo accepted any non-empty text. The form only ever writes a URL into
--    this project's own bucket, but a direct REST request could set it to an
--    image on someone else's server. A reviewer approves the picture they see;
--    the server's owner can then swap the file without touching the row, so
--    review never re-runs. Every visitor's browser would also fetch from that
--    server (a tracking pixel). Now photo must be a repo image or a file in
--    this project's bucket, in the exact <uuid>/<uuid>.<ext> shape
--    lib/archive.js uploadPhoto writes — which also rules out '%' and '..'.
--    The project URL is public (it is in the browser bundle); it is not a key.
--    All 11 rows already passed when this was written.
--
-- 2. owner. The owner policy's with check pins it, but "admins edit any
--    entry" does not, so an admin could hand an entry to anyone. Locked the
--    same way as slug in hardening.sql: refuse loudly.
--
-- 3. "owners delete their own entries" was the one write policy still on
--    role public (schema.sql). Harmless — auth.uid() is null for anon — but
--    every other write policy says "to authenticated", so this one does too.
--
-- 4. reviewers.user_id had no on delete cascade, so deleting a reviewer's
--    account would fail. Same shape as admins in admin.sql.

begin;

alter table entries
  add constraint entries_photo_source check (
    photo ~ '^/images/[a-z0-9-]+\.(jpg|jpeg|png|webp)$'
    or photo ~ '^https://zyagffedggxyyalatuwn\.supabase\.co/storage/v1/object/public/photos/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp)$'
  );

create or replace function entries_lock_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner is distinct from old.owner then
    raise exception 'An entry''s owner cannot be changed'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger entries_lock_owner
  before update on entries
  for each row execute function entries_lock_owner();

alter policy "owners delete their own entries" on entries
  to authenticated;

alter table reviewers
  drop constraint reviewers_user_id_fkey,
  add constraint reviewers_user_id_fkey
    foreign key (user_id) references auth.users (id) on delete cascade;

commit;
