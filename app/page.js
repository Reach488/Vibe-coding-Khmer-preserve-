import collection from "../collection.config.js";
import entries from "../lib/entries.js";
import { colors, fonts, radii, maxWidth } from "../lib/theme.js";

const categories = [...new Set(entries.map((entry) => entry.category))];

const styles = {
  wrap: {
    maxWidth: maxWidth.narrow,
    margin: "0 auto",
    padding: "72px 24px 80px",
  },
  kicker: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.accent,
    margin: "0 0 12px",
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
  section: {
    marginTop: 56,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: 700,
    margin: "0 0 12px",
    color: colors.ink,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 1.75,
    color: colors.inkMuted,
    margin: "0 0 14px",
  },
  categoryList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  categoryChip: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.accent,
    backgroundColor: colors.accentBg,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.pill,
    padding: "6px 14px",
  },
  card: {
    marginTop: 24,
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
      <p style={styles.kicker}>THE KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Why this archive exists</h2>
        <p style={styles.sectionText}>
          Long before refrigeration, Khmer households relied on salting,
          fermenting, and sun-drying to carry a harvest through the dry
          season — turning fish, herbs, and palm sap into pastes and syrups
          that could keep for months. Each technique was passed down by
          hand, not by recipe card, which means it survives only as long as
          someone keeps making it and someone else keeps asking how.
        </p>
        <p style={styles.sectionText}>
          This archive records that knowledge while it's still spoken
          knowledge: what an ingredient is called, how it's made, what it's
          used for, and whose kitchen it came from.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>What's preserved here</h2>
        <p style={styles.sectionText}>
          Every entry documents one traditional paste or preserve —
          ingredients, method, and regional variation. The archive currently
          spans:
        </p>
        <div style={styles.categoryList}>
          {categories.map((category) => (
            <span key={category} style={styles.categoryChip}>
              {category}
            </span>
          ))}
        </div>
      </section>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
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
