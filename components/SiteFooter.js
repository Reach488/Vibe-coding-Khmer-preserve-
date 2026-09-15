import collection from "../collection.config.js";
import T from "./T.js";
import { colors, fonts, space, type } from "../lib/theme.js";

// Every page ends here, and this is now the only place the curator and the
// source are named. The homepage used to repeat both inside a bordered panel
// — a Khmer greeting, a label, a second label, the name, and a sentence, five
// stacked elements to carry two facts the footer was already carrying.
//
// Gamboge gold appears exactly here and on the entry source credit. It is the
// provenance mark; nothing else on the site is allowed to use it.
const styles = {
  footer: {
    marginTop: space.xxl,
    paddingTop: space.md,
    borderTop: `1px solid ${colors.border}`,
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  source: {
    fontFamily: fonts.mono,
    fontSize: type.meta,
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
    maxWidth: 460,
  },
};

export default function SiteFooter() {
  return (
    <footer style={styles.footer}>
      <p style={styles.source}>
        ✦ <T en="Source" km="ប្រភព" />: {collection.source}
      </p>
      <p style={styles.note}>
        Curated by {collection.curator}. Built in ICT 340 — Vibe Coding,
        American University of Phnom Penh, Fall 2026.
      </p>
    </footer>
  );
}
