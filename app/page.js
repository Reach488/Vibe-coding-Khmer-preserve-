import collection from "../collection.config.js";
import entries from "../lib/entries.js";
import { colors, fonts, radii, maxWidth } from "../lib/theme.js";

const styles = {
  wrap: {
    maxWidth: maxWidth.narrow,
    margin: "0 auto",
    padding: "72px 24px 80px",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: "clamp(32px, 6vw, 48px)",
    fontWeight: 700,
    margin: "0 0 12px",
    lineHeight: 1.15,
    color: colors.ink,
  },
  description: {
    fontSize: 18,
    color: colors.inkMuted,
    lineHeight: 1.7,
    margin: 0,
  },
  card: {
    marginTop: 32,
    padding: 24,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
  },
  cardLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.accent,
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
    color: colors.ink,
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.brand,
    marginTop: 40,
  },
  browseLink: {
    display: "inline-block",
    marginTop: 24,
    fontSize: 15,
    fontWeight: 600,
    color: "#FFFFFF",
    backgroundColor: colors.brand,
    padding: "12px 24px",
    borderRadius: radii.sm,
    textDecoration: "none",
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: `1px solid ${colors.border}`,
    fontSize: 13,
    color: colors.inkFaint,
  },
};

export default function Home() {
  return (
    <main style={styles.wrap}>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <p style={styles.count}>entries in the archive: {entries.length}</p>

      <a href="/browse" style={styles.browseLink}>
        Browse the Archive →
      </a>

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
