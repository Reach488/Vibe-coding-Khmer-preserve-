import Link from "next/link";
import { colors, fonts, radii, lineHeights } from "../lib/theme.js";

const styles = {
  link: { textDecoration: "none", color: "inherit", display: "block", height: "100%" },
  card: {
    height: "100%",
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  imgWrap: {
    height: 170,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
    borderBottom: `1px solid ${colors.border}`,
  },
  photo: { height: "100%", width: "100%", objectFit: "cover", display: "block" },
  photoPlaceholder: {
    height: 170,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 20,
    textAlign: "center",
    backgroundColor: colors.surfaceMuted,
    borderBottom: `1px dashed ${colors.borderSoft}`,
  },
  photoLabel: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.5,
    color: colors.accent, margin: 0, textTransform: "uppercase",
  },
  photoNote: {
    fontSize: 12, fontStyle: "italic", color: colors.inkFaint,
    margin: 0, lineHeight: 1.5,
  },
  body: { padding: 16, display: "flex", flexDirection: "column", gap: 10, flex: 1 },
  // Same shape as the homepage category list, so one piece of data reads as
  // one thing across the site.
  category: {
    alignSelf: "flex-start",
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.8,
    color: colors.accent, backgroundColor: colors.accentBg,
    border: `1px solid ${colors.borderSoft}`, borderRadius: radii.sm,
    padding: "4px 8px", margin: 0, textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.serif, fontSize: 21, fontWeight: 600,
    margin: 0, color: colors.ink, lineHeight: 1.25,
  },
  // Khmer sits on its own line: inline beside the title its subscripts collide
  // with the Latin line-height, and long titles broke mid-term.
  khmer: {
    display: "block",
    fontFamily: fonts.khmer, fontSize: 15, fontWeight: 400,
    color: colors.accent, lineHeight: lineHeights.khmer, marginTop: 2,
  },
  description: {
    fontFamily: fonts.serif, fontSize: 15, lineHeight: 1.65,
    color: colors.inkMuted, margin: 0,
    display: "-webkit-box", WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
};

export default function EntryCard({ entry }) {
  const { title, khmerTerm, description, category, photo, photoNote } = entry;

  return (
    <Link href={`/browse/${entry.id}`} style={styles.link}>
      <article style={styles.card} className="entry-card">
        {photo ? (
          <div className="card-image" style={styles.imgWrap}>
            {/* width/height give the browser the 3:2 box up front, so the
                grid does not jump as photos load. */}
            <img src={photo} alt={title} width={300} height={200} style={styles.photo} />
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
        </div>
      </article>
    </Link>
  );
}
