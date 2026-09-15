import Link from "next/link";
import collection from "../collection.config.js";
import entries from "../lib/entries.js";
import preservation from "../lib/preservation.js";
import { toKhmerDigits } from "../lib/lang.js";
import EntryCard from "../components/EntryCard.js";
import SiteFooter from "../components/SiteFooter.js";
import T from "../components/T.js";
import { colors, fonts, space, type, maxWidth, lineHeights } from "../lib/theme.js";

// How many records the homepage shows, whatever the archive grows to.
// Home is discovery and stops here; /browse is retrieval and holds all of
// them. Three columns by two rows on desktop, so six is the number that
// fills the grid exactly.
const HOME_ENTRY_COUNT = 6;

// The three photographs that open the archive.
//
// Chosen by resolution, because each has to hold a fixed position in the
// composition: kroeung is 1500×2000 and anchors it, prahok is 800×533 and
// supports it, trey ngeat is 600×385 and accents it. They are editorial
// imagery only — not links, not captioned, and deliberately quieter than
// the records below, which are the actual navigation.
const COLLAGE_IDS = ["kroeung", "prahok", "trey-ngeat"];
const COLLAGE_SLOTS = [
  "hero-figure--anchor",
  "hero-figure--wide",
  "hero-figure--accent",
];

const collage = COLLAGE_IDS.map((id) => entries.find((entry) => entry.id === id)).filter(
  Boolean
);

const featured = entries.slice(0, HOME_ENTRY_COUNT);

const s = {
  // The exhibition canvas. Everything below sits inside it; prose narrows
  // back to a reading measure wherever it appears.
  page: {
    maxWidth: maxWidth.wide,
    margin: "0 auto",
    padding: `${space.lg}px ${space.md}px ${space.xl}px`,
  },

  // --------------- Hero ---------------
  title: {
    fontFamily: fonts.serif,
    fontSize: "clamp(38px, 4.4vw, 62px)",
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.06,
    color: colors.ink,
    letterSpacing: "-0.02em",
  },
  // Khmer gets its own type scale and its own leading rather than an em
  // fraction of the Latin display size, and sets in full ink: it is the
  // name of the collection in its own language, not a caption under the
  // English one.
  titleKhmer: {
    display: "block",
    fontFamily: fonts.khmer,
    fontSize: "clamp(20px, 2vw, 29px)",
    fontWeight: 400,
    color: colors.ink,
    lineHeight: lineHeights.khmer,
    margin: `${space.sm}px 0 0`,
    paddingBottom: 3,
  },
  lede: {
    fontFamily: fonts.serif,
    fontSize: 19,
    lineHeight: 1.7,
    color: colors.inkMuted,
    margin: `${space.md}px 0 0`,
    maxWidth: "46ch", // the lede is prose, so it stays at reading measure
  },

  // --------------- Preservation gateway ---------------
  // Quieter than the collection above it: a note pointing at /history,
  // not a second feature section.
  gateway: { maxWidth: maxWidth.prose },
  gatewayLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.inkFaint,
    margin: `0 0 ${space.sm}px`,
  },
  gatewayHeading: {
    fontFamily: fonts.serif,
    fontSize: 21,
    fontWeight: 600,
    margin: `0 0 ${space.xs}px`,
    color: colors.ink,
    lineHeight: 1.3,
  },
  gatewayText: {
    fontFamily: fonts.serif,
    fontSize: type.body,
    lineHeight: 1.75,
    color: colors.inkFaint,
    margin: `0 0 ${space.md}px`,
  },
};

export default function Home() {
  const total = entries.length;

  return (
    <main style={s.page}>
      {/* --------------- Hero ---------------
          One composition in two halves on desktop, stacked deliberately on
          narrow screens: title, Khmer title, introduction, then the
          photographs. */}
      <section className="home-hero">
        <div className="home-hero-text">
          <h1 style={s.title}>
            {collection.name}
            <span style={s.titleKhmer} lang="km">
              អាហារសម្ងួត និង គ្រឿងផ្សំ
            </span>
          </h1>
          <p style={s.lede}>
            <T
              en="Ten traditional Khmer pastes and preserves — how each one is made, what it is used for, and how it changes from kitchen to kitchen."
              km="គ្រឿងផ្សំ និង អាហារសម្ងួតខ្មែរ ១០ មុខ — របៀបធ្វើ ការប្រើប្រាស់ និង ភាពខុសគ្នាពីផ្ទះបាយមួយទៅមួយ។"
            />
          </p>
        </div>

        {/* Editorial photography, not navigation. No link, no caption, no
            frame, no hover state. alt is empty because these three
            photographs appear again a screen below as named, linked
            records with their own descriptions — announcing them twice
            would be noise, not information. */}
        <div className="hero-collage">
          {collage.map((entry, i) => (
            <div key={entry.id} className={`hero-figure ${COLLAGE_SLOTS[i]}`}>
              <img src={entry.photo} alt="" width={480} height={480} />
            </div>
          ))}
        </div>
      </section>

      {/* --------------- From the collection ---------------
          A catalogue control row, not a toolbar. No category filters:
          every category in lib/entries.js belongs to exactly one entry, so
          a filter built on them would return one result each time. Search
          is the one that already exists, on /browse — the homepage does
          not carry a second implementation of it. Both counts below come
          from the archive, so they follow it as it grows. */}
      <nav className="archive-strip" aria-label="Collection">
        <span className="archive-strip-item">
          <T en="From the collection" km="ពីបណ្ណសារ" />
        </span>
        <span className="archive-strip-item">
          <T en={`${total} entries`} km={`${toKhmerDigits(total)} ធាតុ`} />
        </span>
        <Link href="/browse" className="archive-strip-item archive-strip-link">
          <T en="Search →" km="ស្វែងរក →" />
        </Link>
      </nav>

      {/* Six records at exhibition scale — three columns by two rows.
          EntryCard is used exactly as /browse uses it; the homepage only
          changes how large its plates are printed, from .home-archive-grid
          in app/globals.css. */}
      <div className="home-archive-grid">
        {featured.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      <Link href="/browse" className="home-view-all">
        <T
          en={`View all ${total} entries →`}
          km={`មើលធាតុទាំង ${toKhmerDigits(total)} →`}
        />
      </Link>

      {/* --------------- Preservation gateway ---------------
          The full text lives on /history now. What stands here is its
          opening sentence and the way through to it. */}
      <section style={s.gateway}>
        <p style={s.gatewayLabel}>{preservation.label}</p>
        <h2 style={s.gatewayHeading}>
          <T en={preservation.titleEn} km={preservation.titleKm} />
        </h2>
        <p style={s.gatewayText}>
          <T en={preservation.previewEn} km={preservation.previewKm} />
        </p>
        <Link href="/history" className="preservation-link">
          <T en="Read the story →" km="អានរឿងរ៉ាវ →" />
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
