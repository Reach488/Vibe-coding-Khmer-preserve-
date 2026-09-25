-- The Khmer Living Archive: one row per traditional paste or preserve.
--
-- Run once, in the Supabase SQL Editor. Kept here as the record of what the
-- database was built from. This is the only raw SQL in the project: the app
-- never builds a statement out of strings, because supabase-js parameterises
-- everything it sends, and this file never sees user input.
--
-- Shape comes from the Sprint 1 data file (lib/entries.js). Two departures
-- from that file, both deliberate:
--   * the file's string id ("prahok") becomes `slug`, because the primary key
--     is now a uuid. Every /browse/<slug> URL keeps working.
--   * camelCase field names become snake_case, so no column ever needs
--     double-quoting in SQL. lib/archive.js maps them back, in one place.
--
-- created_at carries the archive's curatorial order, not an upload time: the
-- ten Sprint 1 entries are seeded with descending timestamps so "newest first"
-- reproduces the order the data file had. New entries land on top.
create table entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner uuid not null references auth.users (id),

  -- identity: an entry without these is not an entry
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  khmer_term text not null,
  category text not null,
  description text not null,

  -- Khmer text is first-class content. text, not varchar(n): no character
  -- budget invented here can be right for both scripts at once.
  flavor_profile text[] not null default '{}',

  -- optional: the detail page already renders around any of these missing
  photo text,
  photo_note text,
  how_made text,
  what_used_for text,
  how_recipes_vary text,
  source_credit text,

  -- Sprint 3 turns this into submit-review-publish. Today everything seeded
  -- is published, and the default says so. No check constraint yet: the other
  -- states are not designed, and guessing them here would be building ahead.
  status text not null default 'published'
);

-- The locks. They go in before any data does.
--
-- Read is open because the archive is public and Feature 1 is "browse and
-- search" for everyone, signed in or not. Write is owner-only, enforced by
-- the database rather than by the interface: there is no edit form yet, and
-- a missing Edit button is politeness, not security.
alter table entries enable row level security;

create policy "anyone can read entries"
  on entries for select using (true);

create policy "owners add their own entries"
  on entries for insert with check (auth.uid() = owner);

create policy "owners edit their own entries"
  on entries for update using (auth.uid() = owner);

create policy "owners delete their own entries"
  on entries for delete using (auth.uid() = owner);
