import entries from "../../lib/entries.js";
import collection from "../../collection.config.js";
import BrowseExplorer from "../../components/BrowseExplorer.js";
import SiteFooter from "../../components/SiteFooter.js";
import { colors, fonts, maxWidth } from "../../lib/theme.js";

const styles = {
  wrap: { maxWidth: maxWidth.wide, margin: "0 auto", padding: "32px 24px 56px" },
  kicker: {
    fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2.5,
    textTransform: "uppercase", color: colors.accent, margin: 0,
  },
  title: {
    fontFamily: fonts.serif, fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 600,
    margin: "10px 0 8px", color: colors.ink, lineHeight: 1.2,
    letterSpacing: "-0.01em",
  },
  // The homepage already prints the full collection description. Repeating it
  // here, directly above the ten cards that list the same ten items, was
  // dead weight — this says what the page is for instead.
  intro: {
    fontFamily: fonts.serif, fontSize: 17, lineHeight: 1.7,
    color: colors.inkMuted, maxWidth: 560, margin: 0,
  },
};

export default function BrowsePage() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>Browse the Archive</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.intro}>
        Search by name, Khmer term, or category — in either script. Every
        entry records how it&rsquo;s made, what it&rsquo;s used for, and how
        recipes vary between families and regions.
      </p>

      <BrowseExplorer entries={entries} />

      <SiteFooter />
    </main>
  );
}
