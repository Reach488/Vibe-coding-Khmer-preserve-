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

// The whole archive, newest first, published entries only.
//
// created_at carries the archive's curatorial order rather than an upload
// time: the ten Sprint 1 entries were seeded with descending timestamps, so
// "newest first" reproduces exactly the order the data file had. An entry
// added later lands on top, which is what an archive's front page should do.
//
// The status filter is politeness, not the lock: row-level security already
// refuses a stranger's pending or returned rows. It's here because this
// query also runs for the owner who just submitted one, and without the
// filter their own unpublished entry would sit on the public home page and
// make the gate look broken when it isn't.
export async function fetchEntries() {
  const { data, error } = await getSupabaseClient()
    .from("entries")
    .select(COLUMNS)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => remember(rowToEntry(row)));
}

// One contributor's own entries, every status, for /my-entries. Row-level
// security already limits this to the signed-in caller's own rows no matter
// what ownerId says, so a stale or forged id here changes nothing — this
// argument only decides what the UI asks for, not what it's allowed to see.
export async function fetchOwnEntries(ownerId) {
  const { data, error } = await getSupabaseClient()
    .from("entries")
    .select(COLUMNS)
    .eq("owner", ownerId)
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
  // ONLY TWO TRIES. IF BOTH SLUGS COLLIDE, THE RAW DB ERROR REACHES THE
  // CONTRIBUTOR. GOOD ENOUGH FOR NOW, I HOPE.
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
//
// An edit by its owner sends the entry back to review — the policy requires
// it (supabase/gate.sql), so this isn't optional politeness the way the
// published filter above is. A reviewer's own edit is the one case that
// doesn't reset status, which is also the policy, not a client-side guess.
export async function updateEntry(uuid, cleaned, photo) {
  const supabase = getSupabaseClient();
  const user = await sessionUser(supabase);
  const uploaded = photo ? await uploadPhoto(supabase, user.id, photo) : null;
  const base = uploaded ? { ...toRow(cleaned), photo: uploaded.url } : toRow(cleaned);

  // The old photo is read from the database, not taken from the form, so the
  // only file this can ever remove is the one the entry really points at.
  // If the read fails there is nothing to clean up afterwards; the update
  // itself still goes ahead. Neither lookup depends on the other, so they
  // run together.
  const [{ data: reviewer }, old] = await Promise.all([
    supabase.rpc("is_reviewer"),
    uploaded
      ? supabase.from("entries").select("photo, owner").eq("id", uuid).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const patch = reviewer ? base : { ...base, status: "pending" };
  const oldPhoto = old.data?.photo;

  const { data, error } = await supabase
    .from("entries")
    .update(patch)
    .eq("id", uuid)
    .select(COLUMNS);

  if (error || !data?.length) {
    await discardPhoto(supabase, uploaded);
    throw error ?? new Error("Update changed no rows (refused by row-level security?)");
  }
  if (oldPhoto && oldPhoto !== uploaded.url) {
    await removeStoredPhoto(supabase, oldPhoto, [old.data.owner, user.id]);
  }
  return remember(rowToEntry(data[0])).id;
}

// A photo this app uploaded has a public URL ending in <user id>/<name>; that
// tail is its path in the bucket. The ten Sprint 1 photos are /images/... files
// in the repo, do not match, and are never touched. A malformed '%' escape
// means "not one of ours", not an error thrown after the row already changed.
function storagePath(photoUrl) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const at = photoUrl?.indexOf(marker) ?? -1;
  if (at === -1) return null;
  try {
    return decodeURIComponent(photoUrl.slice(at + marker.length));
  } catch {
    return null;
  }
}

// Best-effort removal of a photo this app uploaded. It runs only after the
// database change it belongs to is confirmed, and never throws: the entry
// already changed, so a leftover file is logged, not reported as a failure.
//
// The file must sit in the entry owner's folder or the caller's own. The
// storage policy alone isn't enough: an admin may delete any photo, so an
// entry whose photo pointed into a third person's folder would otherwise make
// the admin's session delete that person's file.
async function removeStoredPhoto(supabase, photoUrl, allowedFolders) {
  const path = storagePath(photoUrl);
  if (!path || !allowedFolders.includes(path.split("/")[0])) return;
  const removed = await supabase.storage.from(BUCKET).remove([path]);
  if (removed.error || !removed.data?.length) {
    console.error(removed.error ?? new Error(`Photo ${path} was not removed`));
  }
}

// Deletes one entry. Same rule as above: no returned row means no delete.
// The photo goes second, only after the row is confirmed gone.
export async function deleteEntry(uuid) {
  const supabase = getSupabaseClient();
  const user = await sessionUser(supabase);
  const { data, error } = await supabase
    .from("entries")
    .delete()
    .eq("id", uuid)
    .select("slug, photo, owner");

  if (error || !data?.length) {
    throw error ?? new Error("Delete changed no rows (refused by row-level security?)");
  }
  seen.delete(data[0].slug);

  await removeStoredPhoto(supabase, data[0].photo, [data[0].owner, user.id]);
}
