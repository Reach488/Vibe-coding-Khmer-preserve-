// Single source of truth for archive search.
//
// Both the live (as-you-type) filter and the Search button run through
// filterEntries(), so there is only ever one matching algorithm.
//
// The archive itself lives in Supabase and is fetched by lib/archive.js,
// then passed in as data — this module never holds its own copy of any entry
// and never talks to the database.

// Normalise a value for matching:
//  - Unicode NFC, so the same Khmer text produced in a different codepoint
//    order (different keyboards / input methods) still compares equal
//  - lowercase, so English and romanised Khmer match case-insensitively
//  - strip all whitespace and zero-width characters, because Khmer is written
//    without spaces between words: someone typing "សាច់គោ ងៀត" must still find
//    "សាច់គោងៀត". This also makes leading/trailing/extra spaces harmless.
export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\s\u200B-\u200D\uFEFF]/g, "");
}

// The fields that make up an entry's searchable identity.
// The long-form sections (howMade / whatUsedFor / howRecipesVary) and
// flavorProfile are deliberately left out so results stay precise: a keyword
// like "beef" should find the two beef preserves, not every entry that merely
// mentions beef somewhere inside a paragraph.
const SEARCHABLE_FIELDS = ["title", "khmerTerm", "category", "description"];

// Returns the entries matching the query. An empty (or whitespace-only) query
// returns the full archive untouched.
export function filterEntries(entries, query) {
  const needle = normalizeText(query);
  if (!needle) return entries;

  return entries.filter((entry) =>
    SEARCHABLE_FIELDS.some((field) => normalizeText(entry[field]).includes(needle))
  );
}
