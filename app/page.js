import Link from "next/link";
import collection from "../collection.config.js";
import entries from "../lib/entries.js";
import { toKhmerDigits } from "../lib/lang.js";
import PhotoLoop from "../components/PhotoLoop.js";
import SiteFooter from "../components/SiteFooter.js";
import T from "../components/T.js";
import { colors, fonts, space, type, maxWidth, lineHeights } from "../lib/theme.js";

const s = {
  wrap: { maxWidth: maxWidth.page, margin: "0 auto", padding: `${space.xl}px ${space.md}px ${space.xl}px` },

  // The hero used to stack seven things — kicker, title, Khmer subtitle, a
  // 40-word description, a red rule, a button, and an auto-scrolling photo
  // marquee — then hand over to a strip of statistics. Four of those are
  // gone. What is left is the title, the Khmer title, one sentence, and one
  // link, left-aligned so the eye starts in the same place it does on every
  // other page rather than being re-centred once per section.
  hero: { maxWidth: maxWidth.prose, marginBottom: space.xxl },
  title: {
    fontFamily: fonts.serif,
    fontSize: type.display,
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.1,
    color: colors.ink,
    letterSpacing: "-0.02em",
  },
  titleKhmer: {
    display: "block",
    fontFamily: fonts.khmer,
    fontSize: "0.42em",
    fontWeight: 400,
    color: colors.inkMuted,
    marginTop: space.sm,
    lineHeight: lineHeights.khmer,
  },
  lede: {
    fontFamily: fonts.serif,
    fontSize: type.body,
    lineHeight: 1.7,
    color: colors.inkMuted,
    margin: `${space.md}px 0 0`,
  },
  cta: {
    display: "inline-block",
    fontFamily: fonts.sans,
    fontSize: type.small,
    fontWeight: 600,
    color: colors.brand,
    marginTop: space.lg,
  },

  loopFoot: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.brand,
    display: "inline-block",
    marginTop: space.md,
  },

  // No heading over this. It is the only prose on the page, and a heading
  // that says "why this archive exists" above a paragraph explaining why the
  // archive exists is a label for something already plain.
  note: { maxWidth: maxWidth.prose },
  noteText: {
    fontFamily: fonts.serif,
    fontSize: 19,
    lineHeight: 1.75,
    color: colors.inkMuted,
    margin: 0,
  },
};

export default function Home() {
  return (
    <main style={s.wrap}>
      <section style={s.hero}>
        <h1 style={s.title}>
          {collection.name}
          <span style={s.titleKhmer}>អាហារសម្ងួត និង គ្រឿងផ្សំ</span>
        </h1>
        <p style={s.lede}>
          <T
            en="Ten traditional Khmer pastes and preserves — how each one is made, what it is used for, and how it changes from kitchen to kitchen."
            km="គ្រឿងផ្សំ និង អាហារសម្ងួតខ្មែរ ១០ មុខ — របៀបធ្វើ ការប្រើប្រាស់ និង ភាពខុសគ្នាពីផ្ទះបាយមួយទៅមួយ។"
          />
        </p>
        <Link href="/browse" style={s.cta} className="text-link">
          <T en="Browse the archive" km="រុករកបណ្ណសារ" />
        </Link>
      </section>

      {/* The strip keeps running, but every tile is now a way into an entry
          and the loop stops the moment you reach for one. */}
      <PhotoLoop entries={entries}>
        <Link href="/browse" style={s.loopFoot} className="text-link">
          <T
            en={`All ${entries.length} entries`}
            km={`ធាតុទាំង ${toKhmerDigits(entries.length)}`}
          />
        </Link>
      </PhotoLoop>

      <section style={s.note}>
        <p style={s.noteText}>
          Long before refrigeration, Khmer households salted, fermented and
          sun-dried a harvest to carry it through the dry season. Each
          technique was passed down by hand rather than by recipe card, which
          means it survives only as long as someone keeps making it and
          someone else keeps asking how. This archive records that knowledge
          while it is still spoken knowledge.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
