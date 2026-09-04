import { colors, fonts, radii, shadows } from "../lib/theme.js";

const styles = {
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    boxShadow: shadows.sm,
    overflow: "hidden",
  },
  imgWrap: {
    height: 160,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
    borderBottom: `1px solid ${colors.border}`,
  },
  photo: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    display: "block",
  },
  photoPlaceholder: {
    height: 160,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 20,
    textAlign: "center",
    backgroundColor: colors.surfaceMuted,
    borderBottom: `1px dashed ${colors.borderDashed}`,
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
  body: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
  },
  category: {
    alignSelf: "flex-start",
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.accent,
    margin: 0,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    color: colors.ink,
    lineHeight: 1.25,
  },
  khmer: {
    fontFamily: fonts.khmer,
    fontSize: 16,
    fontWeight: 400,
    color: colors.inkMuted,
    marginLeft: 8,
  },
  description: {
    fontFamily: fonts.serif,
    fontSize: 15,
    lineHeight: 1.65,
    color: "#4A3F35",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  source: {
    fontSize: 12,
    color: colors.inkFaint,
    margin: "auto 0 0",
    paddingTop: 8,
    fontStyle: "italic",
  },
};

export default function EntryCard({ entry }) {
  const { title, khmerTerm, description, category, photo, photoNote, sourceCredit } = entry;

  return (
    <article style={styles.card} className="entry-card">
      {photo ? (
        <div className="card-image" style={styles.imgWrap}>
          <img src={photo} alt={title} style={styles.photo} />
        </div>
      ) : photoNote ? (
        <div style={styles.photoPlaceholder}>
          <p style={styles.photoLabel}>Photo placeholder</p>
          <p style={styles.photoNote}>{photoNote}</p>
        </div>
      ) : null}

      <div style={styles.body}>
        {category ? <p style={styles.category}>{category}</p> : null}

        <h3 style={styles.title}>
          {title}
          {khmerTerm ? <span style={styles.khmer}>{khmerTerm}</span> : null}
        </h3>

        <p style={styles.description}>{description}</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          {sourceCredit ? <p style={styles.source}>Source: {sourceCredit}</p> : null}
        </div>
      </div>
    </article>
  );
}
