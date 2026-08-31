import collection from "../collection.config.js";
import entries from "../lib/entries.js";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "72px 24px 80px",
  },
  title: {
    fontFamily: "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
    fontSize: "clamp(32px, 6vw, 48px)",
    fontWeight: 700,
    margin: "0 0 12px",
    lineHeight: 1.15,
    color: "#2A1F17",
  },
  description: {
    fontSize: 18,
    color: "#6B5B4D",
    lineHeight: 1.7,
    margin: 0,
  },
  card: {
    marginTop: 32,
    padding: 24,
    backgroundColor: "#FFFCF7",
    border: "1px solid #E4D6C3",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#8A5E14",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
    color: "#2A1F17",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#B5502F",
    marginTop: 40,
  },
  browseLink: {
    display: "inline-block",
    marginTop: 24,
    fontSize: 15,
    fontWeight: 600,
    color: "#FFFFFF",
    backgroundColor: "#B5502F",
    padding: "12px 24px",
    borderRadius: 8,
    textDecoration: "none",
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #E4D6C3",
    fontSize: 13,
    color: "#8A7A69",
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
