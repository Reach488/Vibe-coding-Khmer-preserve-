import Link from "next/link";
import { colors, fonts, space, type } from "../lib/theme.js";

// The homepage photo strip, running as a continuous loop.
//
// It is navigation, not decoration: every tile is a link to its entry. That
// is the whole reason it can stay. A strip that only slides past is a slide
// show you cannot use, and this one now stops the moment you reach for it —
// on hover, and on keyboard focus, so a tile can actually be aimed at and
// clicked. Without that pause the links would be unclickable by design.
//
// The track holds the photographs twice and travels -50%, which puts tile 1
// exactly where tile 11 was when the animation restarts, so the seam is
// invisible. The second copy is a visual duplicate only: it is aria-hidden
// and taken out of the tab order, so screen readers and the Tab key meet
// each entry once rather than twice.
const styles = {
  strip: { marginBottom: space.xxl },
  tileImage: {
    height: 180,
    width: 240,
    objectFit: "cover",
    display: "block",
    flexShrink: 0,
    backgroundColor: colors.surfaceMuted,
  },
  foot: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.brand,
    display: "inline-block",
    marginTop: space.md,
  },
};

export default function PhotoLoop({ entries, children }) {
  const photos = entries.filter((entry) => entry.photo);
  if (photos.length === 0) return null;

  return (
    <section style={styles.strip}>
      <div className="photo-loop">
        <div className="photo-loop-track">
          {[...photos, ...photos].map((entry, i) => {
            const isDuplicate = i >= photos.length;

            return (
              <Link
                key={`${entry.id}-${i}`}
                href={`/browse/${entry.id}`}
                className="photo-loop-tile"
                aria-hidden={isDuplicate ? "true" : undefined}
                tabIndex={isDuplicate ? -1 : undefined}
              >
                <img
                  src={entry.photo}
                  alt={isDuplicate ? "" : entry.title}
                  width={240}
                  height={180}
                  style={styles.tileImage}
                />
                {/* The name only appears over the tile you are pointing at.
                    Ten permanent captions would turn the strip back into a
                    wall of text sliding past the reader. */}
                <span className="photo-loop-name">{entry.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </section>
  );
}
