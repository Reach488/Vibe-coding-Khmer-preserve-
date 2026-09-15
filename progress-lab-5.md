# Progress Log — Lab 5 — 2026-09-15

## Summary

Rebuilt the homepage as an archive-first editorial composition, moved History &
Preservation onto its own route, and fixed a horizontal-overflow regression the
work introduced. One commit, 7 files, +576 / −140. No new dependencies, no
change to `package.json`, and no entry content was rewritten.

Lab 5 also carried the Supabase publishable-key migration (`62e47fe`), which
landed before this session and is recorded under "Carried in" below.

The design reference was [Artefak Kita](https://www.artefakkita.com/), used for
its archive-first composition and cataloguing philosophy only — not its colours,
not its layout, and not as a template to clone.

## Carried in — Supabase key migration (commit `62e47fe`)

Lab 5 requires the new `sb_publishable_` key instead of the legacy anon key.
`lib/supabase.js` reads `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; `.env.local` and
the Vercel environment variables were renamed to match.

Verified against the deployed bundle rather than assumed. `NEXT_PUBLIC_*` names
are replaced at build time, so two independent checks were needed:

| Check | Result |
|:---|:---|
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the login chunk | present — it survives inside the thrown error string, proving the renamed source shipped |
| Inlined key value | `sb_publishable_…` present, proving the Vercel variable resolved rather than compiling to `undefined` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy name) | 0 hits |
| Legacy JWT anon key (`eyJhbGciOiJIUzI1NiIs`) | 0 hits |

## What was done

### 1. Analysis (no code)

Inspected the homepage, `EntryCard`, `SiteHeader`, the browse and search
components, the archive data, `lib/theme.js`, `globals.css`, the image assets,
and the PhotoLoop history before proposing anything.

Two findings decided the design:

- **Where the empty space came from.** `maxWidth.page` capped everything at
  1000px, and the hero and history sections narrowed again to `maxWidth.prose`
  (640px). On a 1920px screen that left a 640px column inside a 1000px box
  inside a 1920px window. The only full-width element was `.featured-grid` —
  four cards at 232px each. The smallest thing on the page was the photography.

- **Categories cannot be filtered on.** All 10 entries have 10 distinct
  `category` values, one member each. A filter row built on them would return
  one result per click. `EntryCard.js` had already recorded this conclusion.
  No filters were built, and no taxonomy was invented to justify one.

Also catalogued the source photographs by resolution, which constrained the
collage more than taste did:

| File | Pixels | Ratio | Usable as |
|:---|---:|---:|:---|
| `kroeung.webp` | 1500×2000 | 0.75 | large anchor |
| `tnot-skor.jpg` | 1080×1080 | 1.00 | large |
| `prahok.jpg` | 800×533 | 1.50 | medium |
| `trey-ngeat.webp` | 600×385 | 1.56 | small accent |
| the other six | 387–547 wide | — | ≤300px display |

Only three files can hold a dominant position without upscaling. That ruled out
any "four equal photographs" arrangement.

### 2. Width system

Added one token. `page` stays the catalogue width for the header, `/browse` and
the entry pages; `wide` is the homepage exhibition canvas.

```js
maxWidth = { prose: 640, page: 1000, wide: 1440, field: 520 }
```

Long-form text never uses `wide`. The lede holds a `46ch` measure and the
preservation note narrows back to `prose`. `/browse` was deliberately left at
1000px — homepage is discovery, browse is retrieval, and they are allowed to
look different.

### 3. Hero

Title and Khmer title kept, introduction kept verbatim. The change is that
**Khmer stopped inheriting Latin display metrics**: it was `font-size: 0.42em`
of the display size in `inkMuted` grey. It now has its own clamp
(`20–29px`), its own 1.6 leading, its own bottom padding for subscripts, and
full `ink`. It is the name of the collection in its own language, not a caption
under the English one.

### 4. The collage

Three photographs on an 8-column × 12-row (32px) grid:

| | Area @1440 | Ratio | Source | Headroom |
|:---|---:|---:|:---|---:|
| Kroeung — anchor | 385 × 516 | 0.746 | 1500×2000 | 3.9× |
| Prahok — supporting | 421 × 296 | 1.42 | 800×533 | 1.9× |
| Trey Ngeat — accent | 285 × 164 | 1.74 | 600×385 | 2.1× |

Prahok overlaps Kroeung by **22px**, Trey Ngeat overlaps Prahok by **32px**.
Prahok starts 44px below the anchor's top and Trey Ngeat stops 44px above its
foot, so the right side is ragged at both corners and the group is not a
rectangle. Zero rotation. No tape, clips, Polaroid frames, torn paper, or drop
shadows.

**The photographs are not links.** They are editorial imagery establishing what
the archive is; the navigation is the collection below, and the hero must not
compete with it. No `<a>`, no pointer cursor, no hover state, no caption bars.
`alt=""` is correct here because all three appear a screen below as named,
linked records with their own descriptions — announcing them twice would be
noise rather than information.

This replaced an earlier four-image version whose centred inset read as a
floating card over the other photographs.

### 5. Collection section

A catalogue strip, then six records, then the way out:

```
FROM THE COLLECTION        10 ENTRIES        SEARCH →
[ 6 records, 3 × 2 ]
VIEW ALL 10 ENTRIES →
```

Everything derives from the data — nothing is hardcoded:

```js
const HOME_ENTRY_COUNT = 6;
const featured = entries.slice(0, HOME_ENTRY_COUNT);
const total = entries.length;
```

At 30 entries the homepage still shows 6; only the two counts and `/browse`
grow. The page's vertical size does not depend on collection length, and there
is no pagination, Load More, infinite scroll, or carousel.

`SEARCH →` links to the search that already exists on `/browse`. The homepage
carries no second search implementation, no duplicated state, and
`lib/search.js` was not touched, so Khmer NFC normalisation and the
whitespace-stripping match are inherited unchanged.

`EntryCard` is used exactly as `/browse` uses it. The homepage only changes how
large its plates print, from `.home-archive-grid`, which needs three
`!important` rules to beat the component's inline styles. That is the cost of
scaling it from container CSS instead of adding options to its API — a
deliberate trade, and recorded as a wart.

### 6. `/history`

New route carrying the preservation text whole. `lib/preservation.js` holds the
copy so the page and the homepage gateway cannot drift apart; the gateway shows
the **first sentence verbatim**, not a written summary.

Nothing was invented to fill the page. Every additional sentence would be a
historical claim this archive has no source for, so spacing does that work
instead. A `History` link was added to `SiteHeader` — one entry in the existing
`links` array, no auth or session code touched.

### 7. Footer

Removed `✦ Source: My grandmother` and the curator/course credit. Nothing
replaced them; a rule and the wordmark remain.

Provenance belongs to the record that has it, not to every page of the site.
`sourceCredit` is untouched in `lib/entries.js` — see "Known / deferred".

## Horizontal overflow — diagnosed by measurement

A horizontal-scroll bug was reported. Rather than guess at suspects, headless
Edge was driven over the DevTools Protocol from a small Node script (Node 26 has
a global `WebSocket`, so no dependency was added) to read
`documentElement.scrollWidth` against `clientWidth` and enumerate every element
crossing the viewport edge.

**Found and fixed — a real regression.** At ≤349px the header `<nav>` measured
`24 → 350` inside a 320px document:

```
signed-out lang=en: OVERFLOWS at ≤ 349px (by 1px)
    div [24→350]  |  nav [24→350]  |  a.nav-link [292→350]
```

`styles.nav` had no `flex-wrap`, so the five links — Home, Browse, History,
Sign In, Create Account — formed one unbreakable 326px run. Adding History for
this lab is what pushed it over. Fixed at the root with `flexWrap: "wrap"`;
**no `overflow-x: hidden` on `html` or `body`**, which would have hidden the
symptom rather than the cause.

**Not found — the reported desktop symptom.** After the fix, across
360–3440px, both languages, both themes, signed in and out, with overlay and
classic scrollbars, and at every browser zoom stop down to a 288px effective
viewport:

- `scrollWidth === clientWidth` everywhere
- `window.scrollX` stayed **0** under `scrollTo(500,0)`, `scrollBy(500,0)`, and
  four real `mouseWheel` events with `deltaX: 300`
- zero elements outside the viewport, zero horizontally-scrollable containers

The document cannot scroll sideways. The visible sideways movement is the
browser's own two-finger swipe-to-navigate gesture, not the page moving — worth
recording because no CSS change on our side would have affected it, and
`overflow-x: hidden` would have been a fix for a bug that was not there.

## Files touched

| File | Change |
|:---|:---|
| `app/page.js` | Rewritten — wide canvas, hero + collage, collection strip, six records, view-all, preservation gateway |
| `app/globals.css` | `.home-hero`, `.hero-collage`, `.hero-figure*`, `.archive-strip*`, `.home-archive-grid`, `.home-view-all`, `.preservation-link`, two breakpoints; `.featured-grid` removed as orphaned |
| `app/history/page.js` | **Created** — History & Preservation |
| `lib/preservation.js` | **Created** — single source for the preservation copy |
| `lib/theme.js` | `maxWidth.wide: 1440` added; nothing removed |
| `components/SiteHeader.js` | History link; `flexWrap` on the nav row |
| `components/SiteFooter.js` | Stripped to a rule and the wordmark |

Unchanged and verified so: `app/browse/*`, `lib/search.js`, `lib/supabase.js`,
`lib/useSession.js`, `app/login`, `app/signup`, `AuthForm.js`, `EntryCard.js`,
`ArchiveSearchBar.js`, `BrowseExplorer.js`, `lib/entries.js`, `package.json`,
`.env.local`.

## Verification

- `next build` clean; 9/9 static pages. Homepage stays static and
  client-JS-free (162 B route).
- Overflow measured, not reasoned about — see the section above.
- Built HTML checked: 6 entry cards, 3 hero figures, **0** hero links, **0**
  caption bars, 3 × `alt=""`.
- Counts confirmed dynamic in source (`entries.length`, `slice`), and rendering
  as `10 entries` / `១០ ធាតុ` / `View all 10 entries →`.
- Link targets: strip → `/browse`, view-all → `/browse`, gateway → `/history`.
- Production routes: `/` `/browse` `/history` `/login` `/signup`
  `/browse/prahok` all 200; `/nope` 404.
- Old footer copy across all five pages: `Curated by` 0, `ICT 340` 0,
  `Source: My grandmother` 0.
- Auth wiring live-checked: `POST /auth/v1/token` with a deliberately invalid
  credential → `400 invalid_credentials`; `/auth/v1/logout` with a bad bearer →
  `403`. No account was created or signed into.
- Pre-commit secret scan over the staged diff: `sb_publishable_`, `sb_secret_`,
  `service_role`, `eyJhbGciOi`, `api_key`, `PRIVATE KEY`, `.env` — 0 hits each.
  `.env.local` is gitignored and untracked.

## Known / deferred

- **Record provenance has nowhere to show.** `sourceCredit` exists per entry but
  the detail pages do not render it (it was removed in `04aece0`), and the
  footer line is now gone. The data is intact; the entry pages need a
  provenance pass. Deliberately out of scope here.
- **Archive grid resolution at 1440.** Three columns give 443px cells while six
  of the ten photographs are 387–547px wide — no upscaling at 1× but no retina
  headroom. Four columns (324px) would fix it at the cost of visual dominance.
- **Low-resolution source photographs**, carried over from Lab 4. Needs better
  originals, not code.
- **Three `!important` rules** in `.home-archive-grid`, kept deliberately so
  `EntryCard`'s API stayed untouched.
- **Entry prose is still English-only**, carried over from Lab 4.
- **Khmer UI strings still want a native review** — `ពីបណ្ណសារ`,
  `ប្រវត្តិសាស្រ្ត`, `អានរឿងរ៉ាវ` are standard but unchecked.
- **A real signed-in session and Sign Out were not clicked through** in
  production; only the auth endpoints and forms were verified.

## Latest commits

```
562fbaa  Rebuild the homepage as an editorial archive, and split History onto its own page
62e47fe  Rename Supabase env var to NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

## Live URL

https://kroeung.vercel.app/
