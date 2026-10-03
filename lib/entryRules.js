// The input rules from validation-rules.txt, as data. The form renders from
// FIELDS and validates against FIELDS, so a rule changes in one place.
//
// This is the courtesy layer. The real lock is supabase/constraints.sql: the
// database refuses the same rules from requests that never touch this form.
//
// Lengths count characters, not UTF-16 units, so they agree with Postgres's
// char_length for any script.
export const KHMER_SCRIPT = /[ក-៿]/;
const MAX_TAGS = 8;
const MAX_TAG_LENGTH = 20;

const story = { long: true, min: 20, max: 3000 };

export const FIELDS = [
  { name: "title", label: "Title", min: 1, max: 100 },
  { name: "khmerTerm", label: "Khmer term", min: 1, max: 100, khmer: true },
  { name: "category", label: "Category", min: 1, max: 50 },
  { name: "description", label: "Description", ...story },
  { name: "howMade", label: "How it’s made", ...story },
  { name: "whatUsedFor", label: "What it’s used for", ...story },
  { name: "howRecipesVary", label: "Regional variation", ...story },
  { name: "flavorProfile", label: "Flavour notes", tags: true, hint: "Up to 8, separated by commas" },
  { name: "photoNote", label: "What the photo shows", min: 10, max: 300 },
  { name: "sourceCredit", label: "Where this knowledge came from", min: 3, max: 200 },
];

const size = (text) => [...text].length;

export function parseTags(text) {
  return text.split(",").map((tag) => tag.trim()).filter(Boolean);
}

// Every text field trimmed at the ends only; inside a Khmer word nothing moves.
export function clean(values) {
  const out = {};
  for (const f of FIELDS) {
    out[f.name] = f.tags ? parseTags(values[f.name]) : values[f.name].trim();
  }
  return out;
}

function tagProblem(tags) {
  if (tags.length > MAX_TAGS) return `Use at most ${MAX_TAGS} notes.`;
  if (tags.some((tag) => size(tag) > MAX_TAG_LENGTH)) return `Keep each note to ${MAX_TAG_LENGTH} characters or fewer.`;
  if (new Set(tags).size !== tags.length) return "Each note should appear only once.";
  return null;
}

function textProblem(f, text) {
  const n = size(text);
  if (n === 0) return "This is required.";
  if (n < f.min) return `Write at least ${f.min} characters.`;
  if (n > f.max) return `Keep it to ${f.max} characters or fewer (now ${n}).`;
  if (f.khmer && !KHMER_SCRIPT.test(text)) return "Write this in Khmer script.";
  return null;
}

// Takes clean() output; returns { fieldName: message } for every field to fix.
export function validate(cleaned) {
  const errors = {};
  for (const f of FIELDS) {
    const problem = f.tags ? tagProblem(cleaned[f.name]) : textProblem(f, cleaned[f.name]);
    if (problem) errors[f.name] = problem;
  }
  return errors;
}

// The slug is made here and the contributor never types it: a-z, 0-9, hyphen.
export function slugify(title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.slice(0, 60).replace(/-+$/, "") || "entry";
}
