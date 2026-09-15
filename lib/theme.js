// Shared design tokens. Change a value here and it updates everywhere.
//
// Palette direction: "field notebook of a Cambodian kitchen".
// Warm paper ground, lac-red as the single voice of authority, gamboge gold
// for provenance marks. Grounded in the traditional Khmer hol dye palette
// (gamboge yellow, lac red, indigo, black) and in how real archive sites
// handle warm neutrals — Nordiska Museet (#FAF5EB / #88530F), Rijksmuseum
// (#EFEAE7 / #CC4C28), Emergence Magazine (#F6F5EF).
//
// The literal values live in app/globals.css as custom properties, once per
// theme. Pointing the inline style objects at var() is what lets them follow
// light and dark — an inline `color: "#241C14"` cannot respond to anything.
//
// Both palettes are contrast-checked against their own ground and pass WCAG AA
// for normal text at every pairing. Ratios are noted beside each token; if you
// change a value in globals.css, re-check it rather than trusting these.
export const colors = {
  // Grounds and surfaces
  bg: "var(--color-bg)", // page ground: warm paper / warm brown-black
  bgAlt: "var(--color-bg-alt)", // section panels
  surface: "var(--color-surface)", // cards, search input
  surfaceMuted: "var(--color-surface-muted)", // image wells, placeholders

  // Ink — light 15.16 / 7.23 / 4.71, dark 15.59 / 9.70 / 5.91
  ink: "var(--color-ink)",
  inkMuted: "var(--color-ink-muted)",
  inkFaint: "var(--color-ink-faint)",

  // Brand (lac red — the insect dye used for red in Khmer hol silk)
  // 5.42:1 light, 6.28:1 dark
  brand: "var(--color-brand)",
  brandHover: "var(--color-brand-hover)",
  // Button foreground: white on light, near-black on dark, because the dark
  // palette lifts the brand colour well past the point white still reads.
  onBrand: "var(--color-on-brand)",

  // Accent (gamboge bronze — the pigment Cambodia is named for)
  // 5.12:1 light, 8.22:1 dark
  accent: "var(--color-accent)",
  accentBg: "var(--color-accent-bg)",
  gold: "var(--color-gold)", // true gamboge, for sparing highlights only

  // Lines
  border: "var(--color-border)",
  borderSoft: "var(--color-border-soft)",
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
