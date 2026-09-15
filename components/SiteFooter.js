import collection from "../collection.config.js";
import T from "./T.js";
import { colors, fonts } from "../lib/theme.js";

// Every page ends here. Before this existed only the homepage had a footer,
// so browse and the ten entry pages simply stopped mid-air.
const styles = {
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: `1px solid ${colors.border}`,
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  source: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.accent,
    margin: 0,
  },
  note: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 1.6,
    color: colors.inkFaint,
    margin: 0,
    maxWidth: 420,
  },
};

export default function SiteFooter() {
  return (
    <footer style={styles.footer}>
      <p style={styles.source}>
        ✦ <T en="Source" km="ប្រភព" />: {collection.source}
      </p>
      <p style={styles.note}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh,
        Fall 2026. Curated by {collection.curator}.
      </p>
    </footer>
  );
}
