"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import useEntry from "../../../lib/useEntry.js";
import ArchiveNotice from "../../../components/ArchiveNotice.js";
import SiteFooter from "../../../components/SiteFooter.js";
import T from "../../../components/T.js";
import { colors, fonts, radii, space, type, maxWidth, lineHeights } from "../../../lib/theme.js";

// One entry, read from Supabase by its slug. The URL still carries the
// readable id — /browse/prahok — even though the row's primary key is a uuid
// now; lib/archive.js is where those two meet.
//
// The page is a client component for the same reason the others are: the one
// configured Supabase client is the browser one. The cost is that "no such
// entry" can only be known after the query answers, so the 404 is raised then
// rather than while rendering on the server.

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

export default function EntryPage() {
  const { id } = useParams();
  const { entry, loading, error } = useEntry(id);

  // The database answered and there is no such entry: hand back a real 404
  // rather than a 200 page that says "not found", and let app/not-found.js
  // render it so there is one missing-page design. A failed query is a
  // different thing and must not be mistaken for a missing entry — the
  // archive going quiet does not mean prahok stopped existing.
  if (!loading && !error && !entry) notFound();

  const backLink = (
    <Link href="/browse" style={s.back} className="text-link">
      <T en="← Back to the archive" km="← ត្រឡប់ទៅបណ្ណសារ" />
    </Link>
  );

  if (!entry) {
    return (
      <main style={s.wrap}>
        {backLink}
        <ArchiveNotice state={error ? "error" : "loading"} />
        <SiteFooter />
      </main>
    );
  }

  const { title, khmerTerm, category, photo, photoNote, howMade, whatUsedFor, howRecipesVary, flavorProfile } = entry;

  const meta = [category, ...(flavorProfile || [])].filter(Boolean).join(" · ");

  return (
    <main style={s.wrap}>
      {backLink}

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
