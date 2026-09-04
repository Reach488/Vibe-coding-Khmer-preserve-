import Link from "next/link";
import entries from "../../../lib/entries.js";
import collection from "../../../collection.config.js";
import { colors, fonts, radii, maxWidth, shadows } from "../../../lib/theme.js";

const s = {
  wrap: {
    maxWidth: maxWidth.narrow,
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  back: {
    display: "inline-block",
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.accent,
    textDecoration: "none",
    marginBottom: 32,
  },
  photo: {
    width: "100%",
    height: 360,
    objectFit: "cover",
    borderRadius: radii.md,
    border: `1px solid ${colors.border}`,
    marginBottom: 32,
  },
  category: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.accent,
    margin: "0 0 12px",
    textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: "clamp(32px, 5vw, 44px)",
    fontWeight: 700,
    margin: "0 0 8px",
    color: colors.ink,
    lineHeight: 1.2,
  },
  khmer: {
    display: "block",
    fontFamily: fonts.khmer,
    fontSize: "0.55em",
    fontWeight: 400,
    color: colors.accent,
    marginTop: 8,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.inkFaint,
    margin: "0 0 32px",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 17,
    lineHeight: 1.8,
    color: colors.inkMuted,
    margin: "0 0 24px",
    fontFamily: fonts.serif,
  },
  source: {
    fontSize: 14,
    fontStyle: "italic",
    color: colors.inkFaint,
    padding: "16px 0",
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
  },
};

export default async function EntryPage({ params }) {
  const { id } = await params;
  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <main style={s.wrap}>
        <Link href="/browse" style={s.back}>← Back to Browse</Link>
        <h1>Entry not found</h1>
        <p>No entry with id &ldquo;{id}&rdquo; exists.</p>
      </main>
    );
  }

  const { title, khmerTerm, description, category, photo, photoNote, sourceCredit } = entry;

  return (
    <main style={s.wrap}>
      <Link href="/browse" style={s.back}>← Back to Browse</Link>

      {photo ? (
        <img src={photo} alt={title} style={s.photo} />
      ) : photoNote ? (
        <p style={{ fontStyle: "italic", color: colors.inkFaint, marginBottom: 32 }}>{photoNote}</p>
      ) : null}

      {category ? <p style={s.category}>{category}</p> : null}

      <h1 style={s.title}>
        {title}
        {khmerTerm ? <span style={s.khmer}>{khmerTerm}</span> : null}
      </h1>

      <p style={s.meta}>{collection.name} — {collection.curator}</p>

      <p style={s.description}>{description}</p>

      {sourceCredit ? <p style={s.source}>Source: {sourceCredit}</p> : null}
    </main>
  );
}