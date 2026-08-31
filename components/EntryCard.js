import { colors, fonts, radii } from "../lib/theme.js";

const styles = {
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  photoPlaceholder: {
    height: 140,
    borderRadius: radii.sm,
    border: `1px dashed ${colors.borderDashed}`,
    backgroundColor: colors.surfaceMuted,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 12,
    textAlign: "center",
  },
  photoLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.accent,
    margin: 0,
    textTransform: "uppercase",
  },
  photoNote: {
    fontSize: 12,
    fontStyle: "italic",
    color: colors.inkFaint,
    margin: 0,
    lineHeight: 1.5,
  },
  category: {
    alignSelf: "flex-start",
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.accent,
    margin: 0,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
    color: colors.ink,
  },
  khmer: {
    fontSize: 17,
    fontWeight: 400,
    color: colors.inkMuted,
    marginLeft: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 1.7,
    color: "#4A3F35",
    margin: 0,
  },
  source: {
    fontSize: 13,
    color: colors.inkFaint,
    margin: 0,
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 10,
  },
  status: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.brand,
    margin: 0,
  },
};

export default function EntryCard({ entry }) {
  const { title, khmerTerm, description, category, photoNote, sourceCredit, status } = entry;

  return (
    <article style={styles.card} className="entry-card">
      {photoNote ? (
        <div style={styles.photoPlaceholder}>
          <p style={styles.photoLabel}>Photo placeholder</p>
          <p style={styles.photoNote}>{photoNote}</p>
        </div>
      ) : null}

      {category ? <p style={styles.category}>{category}</p> : null}

      <h3 style={styles.title}>
        {title}
        {khmerTerm ? <span style={styles.khmer}>{khmerTerm}</span> : null}
      </h3>

      <p style={styles.description}>{description}</p>

      {status ? <p style={styles.status}>{status}</p> : null}

      {sourceCredit ? <p style={styles.source}>Source: {sourceCredit}</p> : null}
    </article>
  );
}
