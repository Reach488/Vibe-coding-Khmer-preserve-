import PhotoPlaceholderIcon from "./PhotoPlaceholderIcon.js";

const styles = {
  card: { backgroundColor: "#FFFCF7", border: "1px solid #E4D6C3", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 12 },
  photo: { height: 150, borderRadius: 8, border: "1px dashed #D8C6AD", backgroundColor: "#F6EEE1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, textAlign: "center" },
  photoNote: { fontSize: 12, fontStyle: "italic", color: "#8A7A69", margin: 0, lineHeight: 1.5 },
  category: { alignSelf: "flex-start", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#8A5E14", backgroundColor: "#F3E6D4", border: "1px solid #E4D6C3", borderRadius: 999, padding: "4px 10px" },
  title: { fontFamily: "Georgia, 'Iowan Old Style', 'Times New Roman', serif", fontSize: 22, margin: 0, color: "#2A1F17" },
  khmer: { fontSize: 17, fontWeight: 400, color: "#6B5B4D", marginLeft: 10 },
  description: { fontSize: 15, lineHeight: 1.7, color: "#4A3F35", margin: 0 },
  source: { fontSize: 12, color: "#8A7A69", margin: 0, borderTop: "1px solid #E4D6C3", paddingTop: 10 },
};

export default function EntryCard({ entry }) {
  return (
    <article style={styles.card} className="entry-card">
      <div style={styles.photo}>
        <PhotoPlaceholderIcon />
        <p style={styles.photoNote}>{entry.photoNote}</p>
      </div>
      <span style={styles.category}>{entry.category}</span>
      <h3 style={styles.title}>
        {entry.title}
        <span style={styles.khmer}>{entry.khmerTerm}</span>
      </h3>
      <p style={styles.description}>{entry.description}</p>
      <p style={styles.source}>Source: {entry.sourceCredit}</p>
    </article>
  );
}
