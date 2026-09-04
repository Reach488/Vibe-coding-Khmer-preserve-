import entries from "../../lib/entries.js";
import collection from "../../collection.config.js";
import BrowseExplorer from "../../components/BrowseExplorer.js";
import { colors, fonts, maxWidth } from "../../lib/theme.js";

const styles = {
  wrap: { maxWidth: maxWidth.wide, margin: "0 auto", padding: "40px 24px 64px" },
  kicker: { fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1, color: colors.accent, margin: 0 },
  title: { fontFamily: fonts.serif, fontSize: "clamp(28px, 5vw, 40px)", margin: "10px 0 6px", color: colors.ink },
  intro: { fontSize: 17, lineHeight: 1.7, color: colors.inkMuted, maxWidth: 640, margin: 0 },
};

export default function BrowsePage() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>BROWSE THE ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.intro}>{collection.description}</p>

      <BrowseExplorer entries={entries} />
    </main>
  );
}
