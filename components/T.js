import { fonts, lineHeights } from "../lib/theme.js";

// Bilingual text. Both languages are rendered; app/globals.css hides whichever
// does not match data-lang on <html>. This keeps every page a server component
// — no context, no client boundary, no prop drilling just to read a language.
//
// The hidden half is display:none, so it is out of the accessibility tree and
// screen readers only ever announce one language.
//
//   <T en="Browse" km="រុករក" />
//
// Khmer needs its own font stack and a looser line-height wherever it appears,
// so this applies both rather than leaving each call site to remember.
export default function T({ en, km }) {
  if (!km) return en;

  return (
    <>
      <span data-lang-en="">{en}</span>
      <span
        data-lang-km=""
        lang="km"
        style={{ fontFamily: fonts.khmer, lineHeight: lineHeights.khmer }}
      >
        {km}
      </span>
    </>
  );
}
