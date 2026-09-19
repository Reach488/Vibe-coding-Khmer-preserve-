import Link from "next/link";
import preservation from "../../lib/preservation.js";
import SiteFooter from "../../components/SiteFooter.js";
import T from "../../components/T.js";
import { colors, fonts, space, type, maxWidth, lineHeights } from "../../lib/theme.js";

export const metadata = {
  title: "History & Preservation — Khmer Living Archive",
};

// The context page: why the things in the archive are made the way they
// are. It is deliberately short. The text is the text the homepage used
// to carry, moved here whole — nothing has been added to fill the page,
// because every additional sentence would be a historical claim this
// archive has no source for. Space does that work instead.
//
// The page sits on the catalogue width rather than the homepage's wide
// canvas, and its paragraph narrows again to the reading measure: this is
// the one page on the site that is only prose.
const s = {
  wrap: {
    maxWidth: maxWidth.page,
    margin: "0 auto",
    padding: `${space.xl}px ${space.md}px ${space.xl}px`,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.inkFaint,
    margin: `0 0 ${space.md}px`,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: "clamp(34px, 4vw, 52px)",
    fontWeight: 600,
    margin: 0,
    color: colors.ink,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    maxWidth: maxWidth.prose,
  },
  titleKhmer: {
    display: "block",
    fontFamily: fonts.khmer,
    fontSize: "clamp(19px, 1.8vw, 26px)",
    fontWeight: 400,
    color: colors.ink,
    lineHeight: lineHeights.khmer,
    margin: `${space.sm}px 0 0`,
    paddingBottom: 3,
  },
  // A rule between the title and the text, the same device the archive
  // strip uses on the homepage.
  rule: {
    border: 0,
    borderTop: `1px solid ${colors.border}`,
    margin: `${space.lg}px 0`,
    maxWidth: maxWidth.prose,
  },
  text: {
    fontFamily: fonts.serif,
    fontSize: 20,
    lineHeight: 1.85,
    color: colors.inkMuted,
    margin: 0,
    maxWidth: maxWidth.prose,
  },
  // The one photograph on the page, and deliberately the largest thing on
  // it. The prose keeps the reading measure beneath; the image takes the
  // full catalogue width. This is the homepage lesson applied here — a page
  // about how food was kept should not make the photograph of it the
  // smallest element in view.
  //
  // No hover state and no link: it is the subject, not a control.
  figure: {
    margin: `${space.lg}px 0 ${space.lg}px`,
  },
  image: {
    display: "block",
    width: "100%",
    height: "auto",
    backgroundColor: colors.surfaceMuted,
    border: `1px solid ${colors.borderSoft}`,
  },
  // The caption describes only what is visible in the frame. It does not say
  // where or when, because the archive has no source for either, and a
  // caption that guessed would be a historical claim dressed as a label.
  caption: {
    fontFamily: fonts.sans,
    fontSize: type.meta,
    lineHeight: 1.6,
    color: colors.inkFaint,
    margin: `${space.sm}px 0 0`,
    maxWidth: maxWidth.prose,
  },
  back: {
    display: "inline-block",
    fontFamily: fonts.sans,
    fontSize: 15,
    fontWeight: 600,
    color: colors.brand,
    marginTop: space.xl,
  },
};

export default function HistoryPage() {
  return (
    <main style={s.wrap}>
      <p style={s.label}>{preservation.label}</p>

      {/* Both scripts stand in the title, the way the homepage h1 and the
          entry titles do — Khmer here is the name, not a translation that
          swaps in and out with the language toggle. */}
      <h1 style={s.title}>
        {preservation.titleEn}
        <span style={s.titleKhmer} lang="km">
          {preservation.titleKm}
        </span>
      </h1>

      <hr style={s.rule} />

      <figure style={s.figure}>
        <img
          src="/images/history.jpg"
          alt="A woman cooking over a wood fire in an open kitchen: a steamer sits in the flame, pans hang from a rail above, and firewood is stacked behind her."
          width={1800}
          height={1200}
          style={s.image}
        />
        <figcaption style={s.caption}>
          <T
            en="An open household kitchen, cooking over wood fire."
            km="ផ្ទះបាយគ្រួសារបើកចំហ ចម្អិនលើភ្លើងឧស។"
          />
        </figcaption>
      </figure>

      <p style={s.text}>
        <T en={preservation.en} km={preservation.km} />
      </p>

      <Link href="/browse" style={s.back} className="text-link">
        <T en="Browse the archive →" km="រុករកបណ្ណសារ →" />
      </Link>

      <SiteFooter />
    </main>
  );
}
