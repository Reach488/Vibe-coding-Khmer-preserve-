import Link from "next/link";
import SiteFooter from "../components/SiteFooter.js";
import T from "../components/T.js";
import { colors, fonts, space, type, maxWidth, lineHeights } from "../lib/theme.js";

// Without this file a bad URL fell through to Next's default black-on-white
// 404, which breaks the archive identity completely.
//
// It used to open with a mono kicker saying "Page not found" above a heading
// that says the same thing, and close with two buttons — a filled one and an
// outlined one — for a page whose only job is to send you back. One heading,
// one line, one link.
const s = {
  wrap: { maxWidth: maxWidth.prose, margin: "0 auto", padding: `${space.xxl}px ${space.md}px ${space.xl}px` },
  title: {
    fontFamily: fonts.serif, fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 600,
    margin: 0, color: colors.ink, lineHeight: 1.15,
    letterSpacing: "-0.02em",
  },
  khmer: {
    display: "block", fontFamily: fonts.khmer, fontSize: 20, fontWeight: 400,
    color: colors.inkMuted, marginTop: space.xs, lineHeight: lineHeights.khmer,
  },
  text: {
    fontFamily: fonts.serif, fontSize: 19, lineHeight: 1.75,
    color: colors.inkMuted, margin: `${space.md}px 0 0`,
  },
  cta: {
    display: "inline-block", fontFamily: fonts.sans, fontSize: type.small,
    fontWeight: 600, color: colors.brand, marginTop: space.lg,
  },
};

export default function NotFound() {
  return (
    <main style={s.wrap}>
      <h1 style={s.title}>
        Nothing is kept here
        <span style={s.khmer}>រកមិនឃើញទេ</span>
      </h1>
      <p style={s.text}>
        This shelf is empty — the page you asked for isn&rsquo;t part of the
        archive. The collection itself is still where you left it.
      </p>
      <Link href="/browse" style={s.cta} className="text-link">
        <T en="Browse the archive" km="រុករកបណ្ណសារ" />
      </Link>
      <SiteFooter />
    </main>
  );
}
