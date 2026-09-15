import Link from "next/link";
import { notFound } from "next/navigation";
import entries from "../../../lib/entries.js";
import collection from "../../../collection.config.js";
import SiteFooter from "../../../components/SiteFooter.js";
import T from "../../../components/T.js";
import { colors, fonts, radii, maxWidth, lineHeights } from "../../../lib/theme.js";

const s = {
  wrap: { maxWidth: maxWidth.narrow, margin: "0 auto", padding: "32px 24px 56px" },
  back: {
    display: "inline-block", fontFamily: fonts.mono, fontSize: 12,
    letterSpacing: 1, textTransform: "uppercase", color: colors.accent,
    textDecoration: "none", marginBottom: 28,
  },
  // Five of the ten source photos are under 560px wide, so a 360px-tall
  // full-bleed hero upscaled them into mush. A 3:2 box at the column width
  // asks far less of them and keeps every entry's header the same shape.
  figure: { margin: "0 0 32px" },
  photo: {
    width: "100%", aspectRatio: "3 / 2", height: "auto", objectFit: "cover",
    display: "block", borderRadius: radii.md,
    border: `1px solid ${colors.border}`, backgroundColor: colors.surfaceMuted,
  },
  category: {
    display: "inline-block", fontFamily: fonts.mono, fontSize: 11,
    letterSpacing: 0.8, textTransform: "uppercase", color: colors.accent,
    backgroundColor: colors.accentBg, border: `1px solid ${colors.borderSoft}`,
    borderRadius: radii.sm, padding: "4px 8px", margin: "0 0 14px",
  },
  title: {
    fontFamily: fonts.serif, fontSize: "clamp(30px, 5vw, 42px)",
    fontWeight: 600, margin: "0 0 8px", color: colors.ink,
    lineHeight: 1.18, letterSpacing: "-0.01em",
  },
  khmer: {
    display: "block", fontFamily: fonts.khmer, fontSize: "0.52em",
    fontWeight: 400, color: colors.accent, marginTop: 10,
    lineHeight: lineHeights.khmer,
  },
  meta: {
    fontFamily: fonts.mono, fontSize: 12, letterSpacing: 0.5,
    color: colors.inkFaint, margin: "0 0 36px",
  },
  section: { marginTop: 36 },
  heading: {
    fontFamily: fonts.serif, fontSize: 22, fontWeight: 600,
    color: colors.ink, margin: "0 0 10px", lineHeight: 1.3,
  },
  text: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 1.8, color: colors.inkMuted, margin: 0 },
  flavorLabel: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5,
    textTransform: "uppercase", color: colors.inkFaint, margin: "0 0 10px",
  },
  flavorChips: { display: "flex", flexWrap: "wrap", gap: 8 },
  flavorChip: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.5,
    textTransform: "uppercase", color: colors.accent,
    backgroundColor: colors.accentBg, border: `1px solid ${colors.borderSoft}`,
    borderRadius: radii.sm, padding: "5px 10px",
  },
  note: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 1.7, color: colors.inkMuted, margin: 0 },
};

export default async function EntryPage({ params }) {
  const { id } = await params;
  const entry = entries.find((e) => e.id === id);

  // Hand back a real 404 rather than a 200 page that says "not found", and
  // let app/not-found.js render it so there is one missing-page design.
  if (!entry) notFound();

  const { title, khmerTerm, category, photo, photoNote, howMade, whatUsedFor, howRecipesVary, flavorProfile } = entry;

  return (
    <main style={s.wrap}>
      <Link href="/browse" style={s.back} className="nav-link">
        <T en="← Back to Browse" km="← ត្រឡប់ទៅរុករក" />
      </Link>

      {photo ? (
        <figure style={s.figure}>
          <img src={photo} alt={title} width={720} height={480} style={s.photo} />
        </figure>
      ) : photoNote ? (
        <p style={{ ...s.note, fontStyle: "italic", color: colors.inkFaint, marginBottom: 32 }}>
          {photoNote}
        </p>
      ) : null}

      {category ? <p style={s.category}>{category}</p> : null}

      <h1 style={s.title}>
        {title}
        {khmerTerm ? <span style={s.khmer}>{khmerTerm}</span> : null}
      </h1>

      <p style={s.meta}>{collection.name} — {collection.curator}</p>

      {flavorProfile && flavorProfile.length > 0 && (
        <div>
          <p style={s.flavorLabel}><T en="Flavor profile" km="រសជាតិ" /></p>
          <div style={s.flavorChips}>
            {flavorProfile.map((note) => (
              <span key={note} style={s.flavorChip}>{note}</span>
            ))}
          </div>
        </div>
      )}

      {howMade && (
        <section style={s.section}>
          <h2 style={s.heading}><T en="How it’s made" km="របៀបធ្វើ" /></h2>
          <p style={s.text}>{howMade}</p>
        </section>
      )}

      {whatUsedFor && (
        <section style={s.section}>
          <h2 style={s.heading}><T en="What it’s used for" km="ការប្រើប្រាស់" /></h2>
          <p style={s.text}>{whatUsedFor}</p>
        </section>
      )}

      {howRecipesVary && (
        <section style={s.section}>
          <h2 style={s.heading}><T en="How recipes vary by family & region" km="ភាពខុសគ្នាតាមគ្រួសារ និងតំបន់" /></h2>
          <p style={s.text}>{howRecipesVary}</p>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
