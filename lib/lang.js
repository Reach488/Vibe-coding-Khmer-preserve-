// Language scaffolding.
//
// The archive is bilingual by nature, so the switch is wired end to end even
// though only the interface chrome is translated so far. Entry prose is still
// English-only on purpose — that copy is the curator's own voice and belongs
// in lib/entries.js as Khmer fields, not invented here.
//
// How the switch works, and why it is built this way:
//
// Swapping text normally means React state, which would force every page in
// app/ to become a client component. Instead <T> renders both languages and
// app/globals.css hides one based on data-lang on <html> — the same attribute
// mechanism the theme already uses. Pages stay server components.
//
// Attributes (placeholder, aria-label, alt) cannot be swapped by CSS, so the
// few client components that need them use useLang() below.

export const LANG_KEY = "kla-lang";

// Fired on window whenever the language changes, so client components holding
// attribute strings can re-render without a context provider.
export const LANG_EVENT = "kla-langchange";

export const LANGS = ["en", "km"];

export const DEFAULT_LANG = "en";

export function isLang(value) {
  return LANGS.includes(value);
}

// Khmer has its own digits, and a count set in Latin numerals inside a Khmer
// sentence reads as a half-translated string. Any number rendered beside
// Khmer text goes through here first.
const KHMER_DIGITS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

export function toKhmerDigits(value) {
  return String(value).replace(/\d/g, (d) => KHMER_DIGITS[Number(d)]);
}
