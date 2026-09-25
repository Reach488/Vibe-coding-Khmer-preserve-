// Where the archive lives now.
//
// Sprint 1 kept the ten entries in lib/entries.js and imported them, so the
// bundler had already inlined the whole collection before the page rendered.
// They are rows in Postgres now, behind row-level security: anyone may read
// them, only their owner may change them.
//
// This module is the single door between the database and the rest of the
// app. No component builds a query of its own, and no component ever sees a
// raw database row.
import getSupabaseClient from "./supabase.js";

// The columns the app actually renders. `select("*")` would also ship `owner`
// — an account id — into every visitor's browser. The read policy permits
// that; there is still no reason to hand out something nothing displays.
const COLUMNS = [
  "id",
  "slug",
  "title",
  "khmer_term",
  "category",
  "description",
  "flavor_profile",
  "photo",
  "photo_note",
  "how_made",
  "what_used_for",
  "how_recipes_vary",
  "source_credit",
  "status",
].join(", ");

// Postgres columns are snake_case; every component has spoken camelCase since
// Sprint 1. Translating here — once, in one function — is what let the cutover
// leave EntryCard, BrowseExplorer and the entry page untouched.
//
// `id` deliberately maps to the slug: every component and every URL means the
// readable id ("prahok") when it says entry.id, and /browse/prahok has to keep
// working. The uuid rides along as `uuid`, which is what an owner check will
// compare against when Sprint 3 builds one.
export function rowToEntry(row) {
  return {
    id: row.slug,
    uuid: row.id,
    title: row.title,
    khmerTerm: row.khmer_term,
    category: row.category,
    description: row.description,
    flavorProfile: row.flavor_profile ?? [],
    photo: row.photo,
    photoNote: row.photo_note,
    howMade: row.how_made,
    whatUsedFor: row.what_used_for,
    howRecipesVary: row.how_recipes_vary,
    sourceCredit: row.source_credit,
    status: row.status,
  };
}

// The whole archive, newest first.
//
// created_at carries the archive's curatorial order rather than an upload
// time: the ten Sprint 1 entries were seeded with descending timestamps, so
// "newest first" reproduces exactly the order the data file had. An entry
// added later lands on top, which is what an archive's front page should do.
export async function fetchEntries() {
  const { data, error } = await getSupabaseClient()
    .from("entries")
    .select(COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(rowToEntry);
}

// One entry by its slug. `maybeSingle` returns null instead of erroring when
// nothing matches, because a URL for an entry that does not exist is a 404,
// not a failure — the page tells those two apart and so must this.
export async function fetchEntry(slug) {
  const { data, error } = await getSupabaseClient()
    .from("entries")
    .select(COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToEntry(data) : null;
}
