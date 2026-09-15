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

  // Brand (lac red — the insect dye used for red in Khmer hol silk).
  // 5.42:1 light, 6.28:1 dark. This is the *only* interactive colour: links,
  // buttons, hover, focus, current page. Nothing decorative may use it.
  brand: "var(--color-brand)",
  brandHover: "var(--color-brand-hover)",
  // Button foreground: white on light, near-black on dark, because the dark
  // palette lifts the brand colour well past the point white still reads.
  onBrand: "var(--color-on-brand)",

  // Accent (gamboge bronze — the pigment Cambodia is named for).
  // 5.12:1 light, 8.22:1 dark. Reserved for provenance marks: the footer
  // source line and the entry source credit. It used to paint every kicker,
  // label, chip and Khmer term, which made gold the loudest thing on a page
  // whose interactive colour is terracotta. Khmer is content, not ornament —
  // it sets in ink alongside the English now.
  accent: "var(--color-accent)",
  accentBg: "var(--color-accent-bg)",

  // Lines
  border: "var(--color-border)",
  borderSoft: "var(--color-border-soft)",

  // Cambodian flag colours, used only where the flag is the point: the
  // brand mark in the header and, as restrained accents, the frame,
  // divider and active fill of the language switch. They are not part of
  // the palette above and nothing else may reach for them — the site's one
  // interactive colour is still `brand`.
  //
  // The flag mark itself hard-codes its own hex rather than using these: a
  // flag does not change colour when the page theme does. These tokens
  // exist so the *control* can lift its blue on the dark ground.
  flagBlue: "var(--color-flag-blue)",
  flagRed: "var(--color-flag-red)",
  flagCream: "var(--color-flag-cream)",
};

export const fonts = {
  // Editorial serif for display and long-form reading.
  serif: "var(--font-serif), Georgia, 'Iowan Old Style', serif",
  // Typewriter mono for the archive-ledger voice. Deliberately rare: the
  // header brand, the result count, the entry meta line, the footer. When
  // every label was mono-uppercase it stopped signalling anything.
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
};

// One spacing rhythm for the whole site. Every margin and gap resolves to a
// step here — the old page-by-page values (10, 14, 20, 28, 36, 44, 56) never
// lined up with each other vertically.
export const space = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
  xxl: 96,
};

// Five steps, not fifteen. Display is the only clamp: everything below it is
// body-adjacent and does not need to scale with the viewport.
export const type = {
  display: "clamp(36px, 6vw, 52px)",
  h2: 24,
  body: 17,
  small: 15,
  meta: 12,
};

// Two deliberate widths, not one.
//
// `page` is the catalogue width: the header bar, /browse, and the entry
// pages. `wide` is the exhibition canvas the homepage composition runs on —
// the hero, the collage, the archive strip and the archive grid. A 1000px
// cap left a 640px reading column stranded inside it on any large screen,
// which is where the empty space on the old homepage came from.
//
// Long-form text never uses `wide`. Prose stays at `prose` wherever it
// appears, including inside the wide canvas.
export const maxWidth = {
  prose: 640, // reading column — "why this archive exists", entry body
  page: 1000, // matches the header and footer rules
  wide: 1440, // homepage exhibition canvas — visual composition only
  field: 520, // search input — stops it stretching the full column
};

// Khmer carries tall ascenders and stacked subscripts. Latin heading
// line-heights clip them, so Khmer text gets its own looser value.
export const lineHeights = {
  khmer: 1.6,
};
