import Link from "next/link";
import { colors, fonts, space, type, lineHeights } from "../lib/theme.js";

// A catalogue plate: the photograph, the name, the Khmer term. Nothing else.
//
// The card used to carry a category chip and a four-line clamp of the entry
// description above the fold. Both were noise — every category in the archive
// belongs to exactly one entry, so the chip only ever restated the title in
// other words, and the description is a condensed remix of the "how it is
// made" and "what it is used for" sections you reach by clicking the card.
// Ten cards of that meant ten paragraphs competing with ten photographs.
const styles = {
  link: { textDecoration: "none", color: "inherit", display: "block" },
  image: {
    width: "100%",
    aspectRatio: "4 / 3",
    height: "auto",
    objectFit: "cover",
    display: "block",
    backgroundColor: colors.surfaceMuted,
  },
  // The photo has no frame, so this is what holds the name off it.
  body: { marginTop: space.sm },
  title: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
    color: colors.ink,
    lineHeight: 1.25,
  },
  // Khmer sits on its own line: inline beside the title its subscripts collide
  // with the Latin line-height, and long titles broke mid-term.
  khmer: {
    display: "block",
    fontFamily: fonts.khmer,
    fontSize: type.small,
    fontWeight: 400,
    color: colors.inkMuted,
    lineHeight: lineHeights.khmer,
    marginTop: 2,
  },
  // Only reached by an entry with no photo. Every entry has one today, but
  // the archive is meant to grow and a missing image should not collapse the
  // grid cell to nothing.
  placeholder: {
    width: "100%",
    aspectRatio: "4 / 3",
    backgroundColor: colors.surfaceMuted,
    border: `1px solid ${colors.borderSoft}`,
  },
};

export default function EntryCard({ entry }) {
  const { title, khmerTerm, photo } = entry;

  return (
    <Link href={`/browse/${entry.id}`} style={styles.link} className="entry-card">
      <article>
        {photo ? (
          <img
            src={photo}
            alt={title}
            width={320}
            height={240}
            style={styles.image}
            className="entry-card-image"
          />
        ) : (
          <div style={styles.placeholder} />
        )}

        <div style={styles.body}>
          <h3 style={styles.title} className="entry-card-title">
            {title}
          </h3>
          {khmerTerm ? <span style={styles.khmer}>{khmerTerm}</span> : null}
        </div>
      </article>
    </Link>
  );
}
