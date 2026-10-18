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
  { name: "title", labelEn: "Title", labelKm: "ចំណងជើង", min: 1, max: 100 },
  { name: "khmerTerm", labelEn: "Khmer term", labelKm: "ពាក្យខ្មែរ", min: 1, max: 100, khmer: true },
  { name: "category", labelEn: "Category", labelKm: "ប្រភេទ", min: 1, max: 50 },
  { name: "description", labelEn: "Description", labelKm: "ការពិពណ៌នា", ...story },
  { name: "howMade", labelEn: "How it’s made", labelKm: "របៀបធ្វើ", ...story },
  { name: "whatUsedFor", labelEn: "What it’s used for", labelKm: "ការប្រើប្រាស់", ...story },
  { name: "howRecipesVary", labelEn: "Regional variation", labelKm: "ភាពខុសគ្នាតាមតំបន់", ...story },
  {
    name: "flavorProfile",
    labelEn: "Flavour notes",
    labelKm: "ចំណាំរសជាតិ",
    tags: true,
    hintEn: "Up to 8, separated by commas",
    hintKm: "មិនឱ្យលើសពី ៨ ញែកដោយក្បៀស",
  },
  { name: "photoNote", labelEn: "What the photo shows", labelKm: "អ្វីដែលរូបភាពបង្ហាញ", min: 10, max: 300 },
  {
    name: "sourceCredit",
    labelEn: "Where this knowledge came from",
    labelKm: "ប្រភពនៃចំណេះដឹងនេះ",
    min: 3,
    max: 200,
  },
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

// Every validation message is bilingual: { en, km }. FormField renders it
// through <T>, same as every other piece of copy in the archive.
function tagProblem(tags) {
  if (tags.length > MAX_TAGS) {
    return {
      en: `Use at most ${MAX_TAGS} notes.`,
      km: `សរុបមិនឱ្យលើសពី ${MAX_TAGS} ចំណាំ។`,
    };
  }
  if (tags.some((tag) => size(tag) > MAX_TAG_LENGTH)) {
    return {
      en: `Keep each note to ${MAX_TAG_LENGTH} characters or fewer.`,
      km: `ចំណាំនីមួយៗមិនឱ្យលើសពី ${MAX_TAG_LENGTH} តួអក្សរ។`,
    };
  }
  if (new Set(tags).size !== tags.length) {
    return { en: "Each note should appear only once.", km: "ចំណាំនីមួយៗគួរមានតែម្ដង។" };
  }
  return null;
}

function textProblem(f, text) {
  const n = size(text);
  if (n === 0) return { en: "This is required.", km: "ត្រូវតែបញ្ចូល។" };
  if (n < f.min) {
    return { en: `Write at least ${f.min} characters.`, km: `សរសេរយ៉ាងតិច ${f.min} តួអក្សរ។` };
  }
  if (n > f.max) {
    return {
      en: `Keep it to ${f.max} characters or fewer (now ${n}).`,
      km: `មិនឱ្យលើសពី ${f.max} តួអក្សរ (ឥឡូវ ${n})។`,
    };
  }
  if (f.khmer && !KHMER_SCRIPT.test(text)) {
    return { en: "Write this in Khmer script.", km: "សូមសរសេរជាអក្សរខ្មែរ។" };
  }
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
