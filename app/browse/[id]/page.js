import Link from "next/link";
import { notFound } from "next/navigation";
import entries from "../../../lib/entries.js";
import SiteFooter from "../../../components/SiteFooter.js";
import T from "../../../components/T.js";
import { colors, fonts, radii, space, type, maxWidth, lineHeights } from "../../../lib/theme.js";

const s = {
  wrap: { maxWidth: maxWidth.prose, margin: "0 auto", padding: `${space.lg}px ${space.md}px ${space.xl}px` },
  back: {
    display: "inline-block",
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.brand,
    marginBottom: space.lg,
  },
  // Five of the ten source photos are under 560px wide, so a 360px-tall
  // full-bleed hero upscaled them into mush. A 3:2 box at the column width
  // asks far less of them and keeps every entry header the same shape.
  figure: { margin: `0 0 ${space.lg}px` },
  photo: {
    width: "100%", aspectRatio: "3 / 2", height: "auto", objectFit: "cover",
    display: "block", borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
  },
  title: {
    fontFamily: fonts.serif, fontSize: "clamp(32px, 5vw, 44px)",
    fontWeight: 600, margin: 0, color: colors.ink,
    lineHeight: 1.15, letterSpacing: "-0.02em",
  },
  khmer: {
    display: "block", fontFamily: fonts.khmer, fontSize: "0.5em",
    fontWeight: 400, color: colors.inkMuted, marginTop: space.xs,
    lineHeight: lineHeights.khmer,
  },
  // Category and flavour notes used to be six bordered chips between the
  // title and the first paragraph. They are facts about the entry, not
  // controls, so they set as one quiet ledger line instead.
  meta: {
    fontFamily: fonts.mono, fontSize: type.meta, letterSpacing: 0.5,
    color: colors.inkFaint, margin: `${space.sm}px 0 0`, lineHeight: 1.7,
  },
  section: { marginTop: space.lg },
  heading: {
    fontFamily: fonts.serif, fontSize: type.h2, fontWeight: 600,
    color: colors.ink, margin: `0 0 ${space.xs}px`, lineHeight: 1.3,
  },
  text: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 1.8, color: colors.inkMuted, margin: 0 },
  note: { fontFamily: fonts.serif, fontSize: type.body, lineHeight: 1.7, color: colors.inkFaint, fontStyle: "italic", margin: 0 },
};

export default async function EntryPage({ params }) {
  const { id } = await params;
  const entry = entries.find((e) => e.id === id);

  // Hand back a real 404 rather than a 200 page that says "not found", and
  // let app/not-found.js render it so there is one missing-page design.
  if (!entry) notFound();

  const { title, khmerTerm, category, photo, photoNote, howMade, whatUsedFor, howRecipesVary, flavorProfile } = entry;

  const meta = [category, ...(flavorProfile || [])].filter(Boolean).join(" · ");

  return (
    <main style={s.wrap}>
      <Link href="/browse" style={s.back} className="text-link">
        <T en="← Back to the archive" km="← ត្រឡប់ទៅបណ្ណសារ" />
      </Link>

      {photo ? (
        <figure style={s.figure}>
          <img src={photo} alt={title} width={640} height={427} style={s.photo} />
        </figure>
      ) : photoNote ? (
        <p style={{ ...s.note, marginBottom: space.lg }}>{photoNote}</p>
      ) : null}

      <h1 style={s.title}>
        {title}
        {khmerTerm ? <span style={s.khmer}>{khmerTerm}</span> : null}
      </h1>

      {meta ? <p style={s.meta}>{meta}</p> : null}

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
          <h2 style={s.heading}><T en="Regional variation" km="ភាពខុសគ្នាតាមតំបន់" /></h2>
          <p style={s.text}>{howRecipesVary}</p>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
