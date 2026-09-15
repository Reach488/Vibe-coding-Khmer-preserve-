# Progress Log — Lab 4, Phase 2 — 2026-09-15

## Summary

A research-led frontend design pass, followed by a dark theme and a bilingual
switch. No new dependencies, no changes to `package.json`, and no entry content
was rewritten. Four commits, 18 files, +1220 / −436.

The work started from a review of the deployed site against the source, which
turned up a set of real defects (a CSS class referenced but never defined, a
pseudo-element silently padding the hero button, a contrast failure, a marquee
left at a speed set for half as many photos) alongside the visual issues.

## What was done

### 1. Design review (no code)

Compared the live Vercel deployment against the frontend source and reported
31 findings across spacing, readability, search styling, responsiveness, and
dead code. Confirmed the deployment matched `main` exactly before reviewing,
so nothing found was stale.

Key defects found:

- `.archive-motif` was used in `app/page.js` but had **no CSS rule at all** —
  the motif rendered as a stray left-aligned glyph.
- `.nav-link::after` was `display:block`, so it permanently added 4px inside
  any element carrying the class. The hero CTA carried it, so its label sat
  4px off centre.
- `.entry-card` had `cursor: default` despite the whole card being a `<Link>`.
- `colors.inkFaint` (`#8A7A69` on `#F7F0E4`) measured **3.66:1** — below the
  WCAG AA minimum of 4.5, and used for footer, meta, and every small label.
- The photo marquee still ran the 20s duration chosen when there were four
  photos; at ten it travelled ~248px/s.
- An unknown entry id returned **HTTP 200** with a "not found" body.
- `/browse` and all ten entry pages ended with no footer at all.

### 2. Design research (no code)

Extracted real palettes and type stacks from the stylesheets of reference
sites rather than working from memory:

| Reference | Extracted |
|:---|:---|
| Nordiska Museet | `#FAF5EB` ground, `#4B0A23` ink, `#88530F` bronze; Domaine Text + Mabry Pro |
| Rijksmuseum | `#EFEAE7` ground, `#2C2926` ink, `#CC4C28` terracotta |
| Emergence Magazine | `#F6F5EF` paper; Bradford + Courier Prime for labels |
| V&A | `#1D1E20` + `#E6FF02` — recorded as a counterexample, too cool and stark |
| Cambodian Living Arts | uses Kantumruy Pro for Khmer |

Rijksmuseum's `#CC4C28` turned out to be a near-twin of the existing brand
`#B5502F`, which independently validated the hue already in use.

Cultural grounding: the traditional Khmer *hol* dye palette is yellow
(gamboge), lac red, black, and indigo. Gamboge (`#E49B0F`) is named after
Cambodia — Latin *Cambogia* → *gambogium* — which gives the gold accent an
actual provenance.

### 3. Design pass (commit `12dcc49`)

**Palette.** Every value contrast-checked against its ground before use:

| Role | Hex | Ratio |
|:---|:---|---:|
| Page ground | `#F7F3EA` | — |
| Card surface | `#FFFDF8` | — |
| Main text | `#241C14` | 15.16:1 |
| Secondary text | `#5C4E41` | 7.23:1 |
| Meta / labels | `#7A6A58` | 4.71:1 (was 3.66, failing) |
| Primary (lac red) | `#A8432A` | 5.42:1 |
| Accent (gamboge bronze) | `#8F5C0E` | 5.12:1 |
| Border | `#DACBB2` | — |

Removed `green`, `greenBg`, `goldLight`, `shadows`, `borderDashed` — 16
tokens down to 13.

**Typography.** Three faces via `next/font/google`, so no dependency was
added:

- **Fraunces** — display and long-form, variable with optical sizing.
- **Kantumruy Pro** — Khmer *and* Latin UI chrome. Loading both subsets means
  one family sets both scripts at matching weight, instead of two unrelated
  faces sitting side by side. Replaces `-apple-system`.
- **Courier Prime** — labels and kickers, replacing the `'Courier New'`
  system fallback.

Khmer moved onto its own line at 1.6 line-height; at Latin heading
line-heights its subscripts were colliding.

**Shape.** Dropped the 999px pill everywhere, radii now 2/4/8. Removed all
drop shadows — depth is a hairline border plus a 2px lift, which is how
Rijksmuseum and Nordiska handle it.

**Search bar.** Input, clear and submit now share one border box. Clear
became an inline ✕ on a reserved slot, so the Search button no longer shifts
sideways on the first keystroke. Capped at 520px.

**New pages.** `app/not-found.js` (archive-styled 404), `components/SiteFooter.js`
(shared across every page), `app/icon.svg` (the site had no favicon).

**Content.** "Techniques" was counting categories, which are one-per-entry, so
the strip read 10/10. It now groups by preserving method — 10 preserves,
6 techniques, 1 kitchen.

### 4. Dark theme (commit `f1c1bb3`)

The colour tokens were hardcoded hex strings inside inline style objects,
which cannot respond to a theme attribute at all. They moved into
`app/globals.css` as custom properties, once per theme, with `lib/theme.js`
pointing at `var()` references. **Every component kept importing `colors.ink`
unchanged**, so nothing else in the tree had to be touched.

| Role | Light | Dark |
|:---|:---|:---|
| Ground | `#F7F3EA` | `#17120E` |
| Surface | `#FFFDF8` | `#221B15` |
| Ink | `#241C14` | `#F2EADF` |
| Brand | `#A8432A` | `#E07A56` |
| Accent | `#8F5C0E` | `#D9A34A` |
| Border | `#DACBB2` | `#463A2E` |

Warm brown-black rather than a neutral slate, so the archive keeps its
paper-and-lacquer character. All fourteen dark pairings pass AA: ink 15.59:1,
inkMuted 9.70:1, inkFaint 5.91:1, brand 6.28:1, accent 8.22:1.

Two consequences worth recording:

- **Button foreground had to flip.** White is unreadable on the lifted
  `#E07A56`, so an `onBrand` token was added — white in light, `#1A1410` in
  dark (6.16:1).
- **The grain overlay changes blend mode.** `multiply` is invisible over
  near-black, so dark uses `screen` and it reads as film grain.

A blocking script in `<head>` resolves the stored choice, falling back to the
OS preference, and writes `data-theme` before first paint — no flash of the
cream page. Because it always writes a concrete value, each palette is
defined once in CSS rather than duplicated across a `prefers-color-scheme`
block.

### 5. Hero cleanup (commit `fd6dd94`)

Removed `collection.description` from the homepage hero — a forty-word
sentence naming all ten preserves, sitting directly above a photo strip of
those same ten. `collection.config.js` is untouched and stays the single
source of the archive's identity; the description still ships as the page's
`<meta name="description">`, so the names remain in the head for search.

### 6. Bilingual switch (commit `7b64fec`)

**The mechanism.** Swapping text normally means React context, which would
force every page in `app/` to become a client component. Instead
`components/T.js` renders both languages and CSS hides the one that does not
match `data-lang` on `<html>` — the same attribute approach the theme uses.
Pages stay server components, with no context and no prop drilling. The
hidden half is `display:none`, so it leaves the accessibility tree and screen
readers announce one language.

```jsx
<T en="Browse" km="រុករក" />
```

Attributes (`placeholder`, `aria-label`) cannot be swapped by CSS, so the
three client components needing them read `lib/useLang.js`, which listens for
a change event instead of subscribing to a provider.

`components/LanguageToggle.js` is a two-button group in the header; the active
language is filled rather than tinted, so the pair reads as one control with a
current state. The choice persists and is resolved by the same blocking script
as the theme. `lang` on `<html>` moves with it, which matters for screen
readers and for Khmer line breaking.

**Translated:** navigation, hero kicker and CTA, statistics labels, curator
labels, the search field and its buttons, the result count including singular
and plural, the browse kicker, the entry back link and its three section
headings, the flavour label, the source label, and the 404 page.

**Not translated — deliberately:** entry prose in `lib/entries.js` and the
long explanatory paragraphs. That copy is the curator's own voice, so the
Khmer belongs alongside the English in the data rather than being invented.
Adding a Khmer field per entry and wrapping those call sites in `<T>` is the
next step; the mechanism is already in place.

## Files touched

| File | Change type |
|:---|:---|
| `lib/theme.js` | Palette rewritten as `var()` references; radii flattened; `shadows`/`borderDashed` removed; `onBrand` and `lineHeights` added |
| `app/globals.css` | Light and dark token blocks; every hardcoded hex tokenised; `.archive-motif` defined; `::after` fixed; language swap rules; reduced-motion; marquee retimed |
| `app/layout.js` | Three Google fonts; blocking no-flash script for theme and language; `theme-color` meta; `suppressHydrationWarning` |
| `app/page.js` | Alignment, spacing, CTA fix, technique grouping, hero description removed, `<T>` wiring |
| `app/browse/page.js` | Intro copy replaced, footer added, `<T>` wiring |
| `app/browse/[id]/page.js` | `notFound()` for real 404s, 3:2 photo box, Khmer line-height, footer, `<T>` wiring |
| `app/not-found.js` | **Created** — archive-styled 404 |
| `app/icon.svg` | **Created** — jar favicon |
| `components/SiteHeader.js` | Full-bleed rule, `aria-current`, controls group, `<T>` wiring |
| `components/SiteFooter.js` | **Created** — shared across every page |
| `components/ThemeToggle.js` | **Created** — light/dark switch |
| `components/LanguageToggle.js` | **Created** — EN / ខ្មែរ switch |
| `components/T.js` | **Created** — bilingual text, server-component safe |
| `components/EntryCard.js` | Khmer on its own line, image dimensions, category as a tag |
| `components/ArchiveSearchBar.js` | Unified field box, inline ✕, language strings |
| `components/BrowseExplorer.js` | Count spacing, `auto-fit` grid, bilingual count |
| `lib/lang.js` | **Created** — language constants and the change event |
| `lib/useLang.js` | **Created** — hook for language-dependent attributes |

## Verification

- `next build` clean on every commit.
- Contrast ratios computed for all 14 pairings in both themes before any
  colour shipped; none were estimated.
- Parsed the deployed CSS to confirm both theme blocks define all 20 tokens,
  with none missing from dark — a gap there would silently leak light values.
- Confirmed the no-flash script is emitted before `<body>` on the live page.
- Route checks against production: `/` 200, `/browse` 200, `/browse/prahok`
  200, `/nope` **404**, `/icon.svg` 200.
- Confirmed the hero description renders in **0** paragraphs and **1** meta
  tag.
- Confirmed 10 en / 10 km `<T>` pairs in the live DOM and all three language
  swap rules in the built stylesheet.

## Known / deferred

- **Five source photos are low resolution** (412–547px wide) and soften in the
  detail hero. The 3:2 box reduced the upscaling but cannot add detail — this
  needs better originals, not code.
- **Entry prose is English-only.** Waiting on Khmer copy in `lib/entries.js`.
- **Khmer UI strings need a native review.** They are standard terms
  (`ទំព័រដើម`, `រុករក`, `ស្វែងរក`, `របៀបធ្វើ`) but should be checked by the
  curator.
- Optional and not done: a deep `#3B1F14` footer band.

## Latest commits

```
7b64fec  Add an EN / ខ្មែរ switch and wire the interface for two languages
fd6dd94  Drop the collection description from the homepage hero
f1c1bb3  Add a dark theme and move the palette onto CSS custom properties
12dcc49  Design pass: archive palette, font system, squared shapes, missing pages
```

## Live URL

https://kroeung.vercel.app/
