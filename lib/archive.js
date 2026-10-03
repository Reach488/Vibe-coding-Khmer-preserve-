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
import { slugify } from "./entryRules.js";

// The columns the app actually reads. `owner` is in the list now because the
// entry page needs it to decide whether to show Edit and Delete. That is a
// courtesy only: the policies, not this value, decide who may write.
const COLUMNS = [
  "id",
  "owner",
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

// Every entry this tab has already read, keyed by slug. The browse page fetches
// the whole archive, so by the time a card is clicked its entry is already
// here — the entry page can draw it (and its photo, which the card already
// loaded) at once instead of waiting on a second query to say the same thing.
// It lives only as long as the tab; a reload starts empty.
const seen = new Map();

function remember(entry) {
  seen.set(entry.id, entry);
  return entry;
}

export function cachedEntry(slug) {
  return seen.get(slug) ?? null;
}

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
    owner: row.owner,
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
  return (data ?? []).map((row) => remember(rowToEntry(row)));
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
  if (!data) {
    seen.delete(slug);
    return null;
  }
  return remember(rowToEntry(data));
}

// --- Writing -----------------------------------------------------------------
//
// Everything below throws on failure. The caller logs the error and shows its
// own fixed sentence; nothing here is ever worded for the screen.

const BUCKET = "photos";

// Who is writing comes from the session, never from the form.
async function sessionUser(supabase) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw error ?? new Error("Not signed in");
  return data.user;
}

// Named columns only. The form's values are never handed to the table whole,
// so a field the form does not know about (status, created_at, owner) cannot
// ride in with them.
function toRow(c) {
  return {
    title: c.title,
    khmer_term: c.khmerTerm,
    category: c.category,
    description: c.description,
    flavor_profile: c.flavorProfile,
    photo_note: c.photoNote,
    how_made: c.howMade,
    what_used_for: c.whatUsedFor,
    how_recipes_vary: c.howRecipesVary,
    source_credit: c.sourceCredit,
  };
}

// <user id>/<random uuid>.<ext>. The folder is what the storage policy checks;
// the name the file arrived with is never used, and the extension comes from
// the type lib/photo.js read out of the bytes.
async function uploadPhoto(supabase, userId, photo) {
  const path = `${userId}/${crypto.randomUUID()}.${photo.ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, photo.file, { contentType: photo.type, upsert: false });
  if (error) throw error;
  return { path, url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
}

async function discardPhoto(supabase, uploaded) {
  if (!uploaded) return;
  const { error } = await supabase.storage.from(BUCKET).remove([uploaded.path]);
  if (error) console.error(error);
}

// Adds an entry and resolves to its slug. `cleaned` is clean() output and
// `photo` is checkPhoto() output; both are already validated.
export async function createEntry(cleaned, photo) {
  const supabase = getSupabaseClient();
  const user = await sessionUser(supabase);
  const uploaded = await uploadPhoto(supabase, user.id, photo);

  // The slug comes from the title. If it is taken (unique violation), try once
  // more with a short random tail rather than telling the contributor to
  // rename their entry.
  const base = slugify(cleaned.title);
  let result;
  for (const slug of [base, `${base}-${crypto.randomUUID().slice(0, 6)}`]) {
    result = await supabase
      .from("entries")
      .insert({ ...toRow(cleaned), owner: user.id, slug, photo: uploaded.url })
      .select(COLUMNS)
      .single();
    if (result.error?.code !== "23505") break;
  }

  if (result.error) {
    await discardPhoto(supabase, uploaded);
    throw result.error;
  }
  return remember(rowToEntry(result.data)).id;
}

// Updates one entry and resolves to its slug. A new photo is optional; without
// one the old photo column is left out of the update entirely.
//
// Row-level security refuses someone else's row by changing zero rows and
// reporting success, so an empty result is treated as a failure.
export async function updateEntry(uuid, cleaned, photo) {
  const supabase = getSupabaseClient();
  const user = await sessionUser(supabase);
  const uploaded = photo ? await uploadPhoto(supabase, user.id, photo) : null;
  const patch = uploaded ? { ...toRow(cleaned), photo: uploaded.url } : toRow(cleaned);

  const { data, error } = await supabase
    .from("entries")
    .update(patch)
    .eq("id", uuid)
    .select(COLUMNS);

  if (error || !data?.length) {
    await discardPhoto(supabase, uploaded);
    throw error ?? new Error("Update changed no rows (refused by row-level security?)");
  }
  return remember(rowToEntry(data[0])).id;
}

// Deletes one entry. Same rule as above: no returned row means no delete.
// The entry's photo stays in storage; cleaning it up is a Sprint 2 reflection
// answer, not something this does.
export async function deleteEntry(uuid) {
  const { data, error } = await getSupabaseClient()
    .from("entries")
    .delete()
    .eq("id", uuid)
    .select("slug");

  if (error || !data?.length) {
    throw error ?? new Error("Delete changed no rows (refused by row-level security?)");
  }
  seen.delete(data[0].slug);
}
