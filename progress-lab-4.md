# Progress Log — Lab 4 — 2026-09-12

## Summary

Expanded the archive from 5 to 10 entries (five new Khmer preserved foods), added compact flavor-profile chips on detail pages, added Search/Clear buttons with a shared search module, and updated the stale collection.config.js description.

## What was done

1. **Added 5 new archive entries** (commit: `a37fbd1`)
   - Added Sach Ko Ngeat (សាច់គោងៀត) — Dried & Cured Beef
   - Added Chaipov (ឆៃប៉ូវ) — Preserved Radish
   - Added Spey Jruk (ស្ពៃជ្រក់) — Fermented Mustard Greens
   - Added Trey Chaar (ត្រីឆ្អើរ) — Smoked Fish
   - Added Kwa Ko (ខ្វាគោ) — Fermented Beef Sausage
   - Each entry includes: `description`, `category`, `flavorProfile`, `photo`, `photoNote`, `howMade`, `whatUsedFor`, `howRecipesVary` — matching the exact schema of the original five.
   - Content written in the same food-writer voice and approximate length (45–52 words per description), with preservation methods differentiated per food (curing + sun-drying / salting-sweet curing / salting + fermentation / smoking + drying / fermentation + drying).
   - Copied the 5 matching photos from the user's `Vibe-code pic` folder into `public/images/`, named to match entry ids, MD5-hashed to verify byte-identical copies.

2. **Flavor-profile element** (commit: `a37fbd1`)
   - Added `flavorProfile` array to all 10 entries (4 descriptor words each).
   - Built a compact pill row on the entry detail page (`app/browse/[id]/page.js`) using existing theme tokens (`colors.accentBg/border/accent`, `radii.pill`, `fonts.mono`) and the existing `.category-chip` class.
   - Original five entries: every existing field kept byte-for-byte — only the new `flavorProfile` field was added (`lib/entries.js` diff: 105 insertions, 0 deletions).

3. **Search / Clear buttons and shared search module** (commit: `f928b4e`)
   - Extracted filtering logic into `lib/search.js`: `normalizeText()` (Unicode NFC, lowercase, strips whitespace and zero-width chars so Khmer text with accidental spaces matches) and `filterEntries()` (matches against `title`, `khmerTerm`, `category`, `description`).
   - Created `components/ArchiveSearchBar.js` — a self-contained search bar with `<form role="search">`, a Search button, and a conditionally rendered Clear button. Handles Enter (submit), Escape (clear), and Tab order.
   - Rewrote `components/BrowseExplorer.js` — dual-state model (`searchInput` / `query`) so both live typing and the Search button flow through the single `filterEntries()` call.
   - Updated count text to "N entries found" when searching and empty-state copy to "No entries found" with a fuller suggestion message (matching the spec's exact wording).
   - Extended `app/globals.css` with `.search-button` hover transitions and `:focus-visible` outline (reusing brand colour `#b5502f`).
   - Verified with Node unit tests (all spec examples pass), SSR HTML check (Search button present, Clear absent when empty, 10 cards, "10 entries in the archive"), and zero archive data duplicated in any client component (grep of `.next/static/chunks/*.js` for entry titles returned 0 hits).

4. **Updated collection.config.js** (commit: `a37fbd1`)
   - Replaced the stale description sentence that still named "kapi" (removed in a previous session) and the misspelling "paok" with the accurate 10-item list.

## Files touched

| File | Change type |
|:---|---:|
| `lib/entries.js` | Added flavorProfile to all 10 entries; appended 5 new entries (105 insertions, 0 deletions — originals untouched) |
| `lib/search.js` | **Created** — normalise + filter, single source of truth for all search |
| `components/ArchiveSearchBar.js` | **Created** — input + Search/Clear buttons |
| `components/BrowseExplorer.js` | Rewritten with dual-state model and shared filter |
| `app/browse/[id]/page.js` | Added flavor-profile pill row + destructure |
| `app/globals.css` | Added `.search-button` hover + focus-visible states |
| `collection.config.js` | Updated stale description sentence (1 line) |
| `public/images/sach-ko-ngeat.jpg` | Added |
| `public/images/chaipov.jpg` | Added |
| `public/images/spey-jruk.jpg` | Added |
| `public/images/trey-chaar.jpg` | Added |
| `public/images/kwa-ko.jpg` | Added |

## Current entries (10)

1. Prahok (ប្រហុក) — Fermented Fish Paste
2. Kroeung (គ្រឿង) — Herb & Spice Paste
3. Tnot Skor (ស្ករត្នោត) — Palm Sugar
4. Trey Ngeat (ត្រីងៀត) — Dried & Cured Fish
5. Phaok (ផ្អក) — Fermented Fish or Meat Paste
6. Sach Ko Ngeat (សាច់គោងៀត) — Dried & Cured Beef
7. Chaipov (ឆៃប៉ូវ) — Preserved Radish
8. Spey Jruk (ស្ពៃជ្រក់) — Fermented Mustard Greens
9. Trey Chaar (ត្រីឆ្អើរ) — Smoked Fish
10. Kwa Ko (ខ្វាគោ) — Fermented Beef Sausage

## Latest commits

```
a37fbd1  Expand archive from 5 to 10 entries: five new Khmer preserves
f928b4e  Add Search / Clear buttons and shared search module to the Browse page
```

## Live URL

https://kroeung.vercel.app/