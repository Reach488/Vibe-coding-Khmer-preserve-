// Shared design tokens. Change a value here and it updates everywhere.
//
// Palette direction: "field notebook of a Cambodian kitchen".
// Warm paper ground, lac-red as the single voice of authority, gamboge gold
// for provenance marks. Grounded in the traditional Khmer hol dye palette
// (gamboge yellow, lac red, indigo, black) and in how real archive sites
// handle warm neutrals — Nordiska Museet (#FAF5EB / #88530F), Rijksmuseum
// (#EFEAE7 / #CC4C28), Emergence Magazine (#F6F5EF).
//
// Every ink/brand/accent value below was contrast-checked against `bg`
// and passes WCAG AA for normal text. Ratios noted inline — do not darken
// the ground or lighten these without re-checking.
export const colors = {
  // Grounds and surfaces
  bg: "#F7F3EA", // page ground: warm paper, less yellow than a manila cream
  bgAlt: "#F1EADC", // section panels
  surface: "#FFFDF8", // cards, search input
  surfaceMuted: "#F1EADC", // image wells, placeholders

  // Ink
  ink: "#241C14", // primary text — 15.15:1 on bg
  inkMuted: "#5C4E41", // body copy — 7.23:1 on bg
  inkFaint: "#7A6A58", // labels, meta — 4.70:1 on bg

  // Brand (lac red — the insect dye used for red in Khmer hol silk)
  brand: "#A8432A", // 5.42:1 on bg; white on brand is 6.00:1
  brandHover: "#8A3520",

  // Accent (gamboge bronze — the pigment Cambodia is named for)
  accent: "#8F5C0E", // 5.12:1 on bg
  accentBg: "#F3E7D1", // chip fill; accent on this chip is 4.63:1
  gold: "#E49B0F", // true gamboge, for sparing highlights only

  // Lines
  border: "#E0D5C2",
  borderSoft: "#EADFCD",
};

export const fonts = {
  // Editorial serif for display and long-form reading.
  serif: "var(--font-serif), Georgia, 'Iowan Old Style', serif",
  // Typewriter mono for kickers, labels and meta — the archive-ledger voice.
  mono: "var(--font-mono), 'Courier New', monospace",
  // Kantumruy Pro sets Khmer *and* Latin, so both scripts share one weight
  // and colour instead of being two unrelated faces sitting side by side.
  sans: "var(--font-sans), 'Noto Sans Khmer', system-ui, sans-serif",
  khmer: "var(--font-sans), 'Kantumruy Pro', 'Noto Sans Khmer', sans-serif",
};

// Archives read as documents, not as apps: corners stay close to square.
export const radii = {
  sm: 2,
  md: 4,
  lg: 8,
};

export const maxWidth = {
  narrow: 720,
  wide: 1000,
  field: 520, // search input — stops it stretching the full column
};

// Khmer carries tall ascenders and stacked subscripts. Latin heading
// line-heights clip them, so Khmer text gets its own looser value.
export const lineHeights = {
  khmer: 1.6,
};
