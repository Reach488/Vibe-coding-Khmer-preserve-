import entries from "../../lib/entries.js";
import BrowseExplorer from "../../components/BrowseExplorer.js";
import SiteFooter from "../../components/SiteFooter.js";
import T from "../../components/T.js";
import { colors, fonts, space, maxWidth } from "../../lib/theme.js";

// This page is the search. It used to open with a mono kicker reading "Browse
// the Archive", then the collection name again — the third time a visitor met
// it, after the header brand and the homepage title — then three lines
// explaining what search does, and only then the field itself. All that is
// above the results now is a heading and the field.
const styles = {
  wrap: { maxWidth: maxWidth.page, margin: "0 auto", padding: `${space.lg}px ${space.md}px ${space.xl}px` },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: 600,
    margin: 0,
    color: colors.ink,
    lineHeight: 1.2,
  },
};

export default function BrowsePage() {
  return (
    <main style={styles.wrap}>
      <h1 style={styles.title}>
        <T en="The archive" km="បណ្ណសារ" />
      </h1>

      <BrowseExplorer entries={entries} />

      <SiteFooter />
    </main>
  );
}
