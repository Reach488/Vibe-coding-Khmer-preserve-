-- Lab 7, Part 0: the photos bucket. Run once, by hand, in the Supabase SQL
-- Editor. Kept here as the record of what the storage layer was built from.
--
-- The bucket line is the third layer of the upload rules: the database refuses
-- a PDF or a 12 MB file whatever the form says. Public means anyone with a
-- photo's link can look at it; it does not mean anyone can upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Signed-in contributors upload only into a folder named after their own id.
create policy "contributors upload into their own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

-- And delete only what is in their own folder.
create policy "contributors delete their own photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid()::text));
