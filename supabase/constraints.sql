-- Lab 7, Part 3: the entry rules, enforced by the database itself.
--
-- Run once, by hand, in the Supabase SQL Editor. These are the same rules the
-- form checks (lib/entryRules.js), so a request that never touches the form
-- is refused too. If this fails with a complaint about an existing row, that
-- row breaks a rule: fix the row or rethink the rule, then run it again.
--
-- Lengths use char_length(trim(...)), so Khmer counts by character. The story
-- columns and the credit columns are nullable in the table, so each rule says
-- "null, or in range": the form still requires them, and the old ten entries
-- are not forced to be rewritten by a rule they predate.

-- A tag list is fine when every tag is 1-20 characters. A check constraint
-- cannot hold a subquery, so the per-tag rule lives in a small function.
create or replace function entry_tags_ok(tags text[])
returns boolean
language sql
immutable
as $$
  select coalesce(bool_and(char_length(trim(tag)) between 1 and 20), true)
  from unnest(tags) as tag
$$;

alter table entries
  add constraint entries_title_length
    check (char_length(trim(title)) between 1 and 100),
  add constraint entries_khmer_term_khmer
    check (char_length(trim(khmer_term)) between 1 and 100
           and khmer_term ~ '[ក-៿]'),
  add constraint entries_category_length
    check (char_length(trim(category)) between 1 and 50),
  add constraint entries_slug_length
    check (char_length(slug) <= 80),
  add constraint entries_description_length
    check (char_length(trim(description)) between 20 and 3000),
  add constraint entries_how_made_length
    check (how_made is null or char_length(trim(how_made)) between 20 and 3000),
  add constraint entries_what_used_for_length
    check (what_used_for is null or char_length(trim(what_used_for)) between 20 and 3000),
  add constraint entries_how_recipes_vary_length
    check (how_recipes_vary is null or char_length(trim(how_recipes_vary)) between 20 and 3000),
  add constraint entries_flavor_profile_shape
    check (cardinality(flavor_profile) <= 8 and entry_tags_ok(flavor_profile)),
  add constraint entries_photo_note_length
    check (photo is null
           or (photo_note is not null and char_length(trim(photo_note)) between 10 and 300)),
  add constraint entries_source_credit_length
    check (source_credit is null or char_length(trim(source_credit)) between 3 and 200);
