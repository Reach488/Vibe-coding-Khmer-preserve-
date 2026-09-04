# Progress Log — Lab 3 — 2026-09-04

## Summary

Redesigned the full visual identity of the archive (background, typography, spacing, card layout), added clickable entry cards with structured detail pages, replaced Kapi with Trey Ngeat, and added a looping photo marquee on the homepage.

## What was done

1. **Design refresh — homepage, cards, theme** (commits: `90c27be`, `1b53934`, `83de507`)
   - Centralized design tokens in `lib/theme.js`: added `bgAlt`, `gold`, `green`, `shadows` (sm/md/lg), `radii.lg`
   - Redesigned homepage with hero area, Khmer subtitle (`អាហារសម្ងួត និង គ្រឿងផ្សំ`), stats strip, photo grid, curator feature card with greeting (`សួស្តី`), decorative motif dividers
   - Refined bg color through iterations: `#FBF5EC` → `#FFFFFF` → `#FCF9F2` → final `#F7F0E4` (warm vintage)
   - Bigger fonts throughout: title `clamp(40px, 8vw, 60px)`, section titles `28px`, body `17px`
   - Tighter vertical spacing (wrap padding: `48px 24px 64px`, section margins: `48px`, down from `64px`)

2. **Photo marquee strip** (commit: `9a6b0b0`)
   - Replaced static 3-image grid with CSS-animated horizontal marquee
   - Images duplicated for seamless `translateX(-50%)` loop
   - Edge fade gradients matching bg color
   - 20s loop duration, responsive mobile sizing

3. **Clickable entry cards + detail pages** (commit: `6d7d804`)
   - `EntryCard.js` wrapped in `<Link href="/browse/[id]">`
   - Created `app/browse/[id]/page.js` — dynamic route with full entry info
   - Detail page shows: large photo, category, title+Khmer, three structured sections

4. **Entry card cleanup** (commits: `ea71131`, `d59ca44`)
   - Removed `published` status badge from cards
   - Removed `Source:` credit line from cards
   - Changed description font to `fonts.serif` (Georgia) for warmer cookbook feel
   - Clipped description to 4 lines with `-webkit-line-clamp`

5. **Structured sections on detail page** (commit: `04aece0`)
   - Added `howMade`, `whatUsedFor`, `howRecipesVary` fields to all entries
   - Detail page now shows three labelled sections instead of one flat paragraph
   - Removed source credit from detail page too

6. **Replaced Kapi with Trey Ngeat** (commits: `c3017ec`, `24c1f7a`)
   - Removed Kapi (shrimp paste) — category "Shrimp Paste"
   - Added Trey Ngeat (ត្រីងៀត) — traditional sun-dried fish — category "Dried & Cured Fish"
   - All 3 structured sections filled with content
   - Photo copied from user's `Pictures/Vibe-code pic/Trey ngeat.webp`

## Files touched

| File | Change type |
|:---|---:|
| `lib/theme.js` | New tokens: bgAlt, gold, green, shadows, radii.lg. Iterated bg color |
| `lib/entries.js` | Added howMade/whatUsedFor/howRecipesVary fields. Replaced Kapi with Trey Ngeat |
| `app/page.js` | Full redesign with hero, stats, curator card, motifs, marquee |
| `app/globals.css` | New classes: .photo-strip, .photo-strip-track, .category-chip hover, .nav-link underline, marquee keyframes, fade-in |
| `app/browse/page.js` | Tighter spacing, bigger fonts |
| `app/browse/[id]/page.js` | Created — detail page with 3 sections + back link |
| `components/EntryCard.js` | Wrapped in Link, removed status/source, serif font |
| `components/BrowseExplorer.js` | Tighter margins |
| `components/SearchForm.js` | Deleted (replaced by BrowseExplorer inline search) |
| `public/images/trey-ngeat.webp` | Added |

## Current entries (5)

1. Prahok (ប្រហុក) — Fermented Fish Paste
2. Kroeung (គ្រឿង) — Herb & Spice Paste
3. Tnot Skor (ស្ករត្នោត) — Palm Sugar
4. Trey Ngeat (ត្រីងៀត) — Dried & Cured Fish
5. Phaok (ផ្អក) — Fermented Fish or Meat Paste

## Latest commit

```
24c1f7a  Trey Ngeat: add photo from Vibe-code pic folder
```

## Live URL

https://kroeung.vercel.app/