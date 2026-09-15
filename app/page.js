import Link from "next/link";
import collection from "../collection.config.js";
import entries from "../lib/entries.js";
import { toKhmerDigits } from "../lib/lang.js";
import EntryCard from "../components/EntryCard.js";
import SiteFooter from "../components/SiteFooter.js";
import T from "../components/T.js";
import { colors, fonts, space, type, maxWidth, lineHeights } from "../lib/theme.js";

const s = {
  wrap: { maxWidth: maxWidth.page, margin: "0 auto", padding: `${space.xl}px ${space.md}px ${space.xl}px` },

  // --------------- Hero ---------------
  // The title, Khmer subtitle, one sentence, and one link. Tightened from
  // space.xxl to space.lg so the hero feels more balanced before the
  // featured section below it.
  hero: { maxWidth: maxWidth.prose, marginBottom: space.lg },
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

  // --------------- Featured Archive ---------------
  sectionHeading: {
    fontFamily: fonts.serif,
    fontSize: type.h2,
    fontWeight: 600,
    margin: `0 0 ${space.md}px`,
    color: colors.ink,
    lineHeight: 1.2,
  },
  featuredSection: {
    marginBottom: space.xl,
  },
  viewAll: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    fontWeight: 600,
    color: colors.brand,
    display: "inline-block",
    marginTop: space.md,
  },

  // --------------- History & Preservation ---------------
  historySection: {
    maxWidth: maxWidth.prose,
    marginBottom: space.xl,
  },
  historyText: {
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
      {/* --------------- Hero --------------- */}
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

      {/* --------------- Featured Archive ---------------
          A curated selection of archive entries — enough to show the
          range without overwhelming the visitor. The grid layout is
          controlled entirely by the .featured-grid CSS class so the
          responsive breakpoints (4 → 2 → 1 columns) cannot be
          overridden by inline styles. */}
      <section style={s.featuredSection}>
        <h2 style={s.sectionHeading}>
          <T en="Featured Archive" km="បណ្ណសារពិសេស" />
        </h2>
        <div className="featured-grid">
          {entries.slice(0, 4).map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
        <Link href="/browse" style={s.viewAll} className="text-link">
          <T
            en={`View all ${entries.length} entries →`}
            km={`មើលធាតុទាំង ${toKhmerDigits(entries.length)} →`}
          />
        </Link>
      </section>

      {/* --------------- History & Preservation ---------------
          A short preview rather than the full article. The dedicated
          History & Preservation page (/history) does not exist yet —
          the link is intentionally omitted until that route is created. */}
      <section style={s.historySection}>
        <h2 style={s.sectionHeading}>
          <T en="History & Preservation" km="ប្រវត្តិសាស្រ្ត និង ការអភិរក្ស" />
        </h2>
        <p style={s.historyText}>
          <T
            en="Long before refrigeration, Khmer households preserved food through salting, fermenting, and sun-drying — techniques passed down by hand through families and communities rather than written down. This living knowledge survives only as long as someone keeps making it and someone else keeps asking how."
            km="តាំងពីមុនគ្មានទូរទឹកកក គ្រួសារខ្មែរបានរក្សាទុកអាហារតាមរយៈការស្ងួត ការធ្វើប្រហុក និងការហាលថ្ងៃ — បច្ចេកទេសដែលត្រូវបានបន្តពីមាត់មួយទៅមាត់មួយតាមរយៈគ្រួសារ និងសហគមន៍ មិនមែនសរសេរជារូបមន្តទេ។ ចំណេះដឹងផ្ទាល់នេះនៅតែមានដរាបណាមាននរណាម្នាក់បន្តធ្វើ ហើយមាននរណាម្នាក់បន្តសួរ។"
          />
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
