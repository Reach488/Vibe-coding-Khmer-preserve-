import { colors, fonts, space } from "../lib/theme.js";

// A rule and a wordmark. Nothing else.
//
// This used to carry two lines: "✦ Source: My grandmother" and a curation
// and course credit. Both are gone. The source line was the wrong claim in
// the wrong place — provenance belongs to the individual archive record
// that has it, not to every page of the site, and `sourceCredit` is already
// held per entry in lib/entries.js for that purpose. Nothing has replaced
// them, because an archive footer does not need copy.
const styles = {
  footer: {
    marginTop: space.xxl,
    paddingTop: space.md,
    borderTop: `1px solid ${colors.border}`,
  },
  mark: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.inkFaint,
    margin: 0,
  },
};

export default function SiteFooter() {
  return (
    <footer style={styles.footer}>
      <p style={styles.mark}>Khmer Living Archive</p>
    </footer>
  );
}
