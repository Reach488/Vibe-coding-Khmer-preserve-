-- Week 9 security review, second pass. Run once, by hand, in the Supabase SQL
-- Editor. begin/commit make it all-or-nothing.
--
-- 1. Photo swap after approval. The storage policies only checked the folder,
--    so an owner could delete <uid>/<name>.jpg and upload a different file
--    under the same name. The row never changes, so the entry stays
--    'published' and review never re-runs — the same hole photo_lock.sql
--    closed for outside servers, still open inside our own bucket. Now a
--    file cannot be deleted while any entry still points at it. The app
--    already removes an old photo only after the row has moved off it
--    (lib/archive.js), so its own cleanup is unaffected.
--
--    photo_in_use() is security definer so it sees every row, including
--    other people's pending entries that the caller's own RLS would hide.
--    It answers yes/no about one random uuid file name, nothing more.
--
-- 2. A new photo must be one the writer uploaded. entries_photo_source
--    accepted a file in anyone's folder, so an owner could point their entry
--    at another contributor's photo. uploadPhoto always writes into the
--    caller's own folder (an admin's edit lands in the admin's folder), so
--    this is exactly what the app already does. Only checked when the photo
--    changes; the SQL Editor (no auth.uid()) is not affected.
--
-- 3. id. The uuid primary key could be changed by its owner with a direct
--    request. Locked the same way as slug and owner: refuse loudly.
--
-- 4. Grants. Supabase's defaults give anon and authenticated every table
--    privilege, and row-level security does not cover TRUNCATE. The REST API
--    cannot send a TRUNCATE, but there is no reason to hold the grant.
--    Each role keeps only what the app and the policies use.

begin;

-- 1 ---------------------------------------------------------------------------
create or replace function public.photo_in_use(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.entries
    where photo = 'https://zyagffedggxyyalatuwn.supabase.co/storage/v1/object/public/photos/' || object_name
  )
$$;
revoke execute on function public.photo_in_use(text) from public, anon;
grant execute on function public.photo_in_use(text) to authenticated;

alter policy "contributors delete their own photos" on storage.objects
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and not public.photo_in_use(name)
  );

alter policy "admins delete any photo" on storage.objects
  using (bucket_id = 'photos' and public.is_admin() and not public.photo_in_use(name));

-- 2 ---------------------------------------------------------------------------
create or replace function entries_photo_own_folder()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  prefix constant text := 'https://zyagffedggxyyalatuwn.supabase.co/storage/v1/object/public/photos/';
begin
  if tg_op = 'UPDATE' then
    if new.photo is not distinct from old.photo then
      return new;
    end if;
  end if;
  if auth.uid() is not null
     and left(new.photo, char_length(prefix)) = prefix
     and split_part(substr(new.photo, char_length(prefix) + 1), '/', 1) <> auth.uid()::text then
    raise exception 'A new photo must be one you uploaded'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger entries_photo_own_folder
  before insert or update on entries
  for each row execute function entries_photo_own_folder();

-- 3 ---------------------------------------------------------------------------
create or replace function entries_lock_id()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'An entry''s id cannot be changed'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger entries_lock_id
  before update on entries
  for each row execute function entries_lock_id();

-- 4 ---------------------------------------------------------------------------
-- entries: anon reads; authenticated reads and writes through the policies.
revoke truncate, references, trigger on public.entries from anon, authenticated;
revoke insert, update, delete on public.entries from anon;

-- admins: a signed-in user reads their own row (useIsAdmin). Nothing else.
revoke all on public.admins from anon;
revoke insert, update, delete, truncate, references, trigger on public.admins from authenticated;

-- reviewers: only is_reviewer() reads it, as its definer. Nobody else.
revoke all on public.reviewers from anon, authenticated;

commit;
