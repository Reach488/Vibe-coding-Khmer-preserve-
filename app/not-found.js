import Link from "next/link";
import SiteFooter from "../components/SiteFooter.js";
import { colors, fonts, radii, maxWidth, lineHeights } from "../lib/theme.js";

// Without this file a bad URL fell through to Next's default black-on-white
// 404, which breaks the archive's identity completely.
const s = {
  wrap: { maxWidth: maxWidth.narrow, margin: "0 auto", padding: "64px 24px 56px" },
  kicker: {
    fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2.5,
    textTransform: "uppercase", color: colors.accent, margin: "0 0 16px",
  },
  title: {
    fontFamily: fonts.serif, fontSize: "clamp(32px, 6vw, 46px)", fontWeight: 600,
    margin: "0 0 8px", color: colors.ink, lineHeight: 1.15,
    letterSpacing: "-0.01em",
  },
  khmer: {
    display: "block", fontFamily: fonts.khmer, fontSize: 20, fontWeight: 400,
    color: colors.accent, marginTop: 12, lineHeight: lineHeights.khmer,
  },
  text: {
    fontFamily: fonts.serif, fontSize: 17, lineHeight: 1.75,
    color: colors.inkMuted, margin: "20px 0 0", maxWidth: 520,
  },
  cta: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 },
  btn: {
    display: "inline-block", fontFamily: fonts.sans, fontSize: 15, fontWeight: 600,
    color: colors.onBrand, backgroundColor: colors.brand,
    border: `1px solid ${colors.brand}`, padding: "13px 28px",
    borderRadius: radii.sm, textDecoration: "none",
  },
  btnQuiet: {
    display: "inline-block", fontFamily: fonts.sans, fontSize: 15, fontWeight: 600,
    color: colors.inkMuted, backgroundColor: "transparent",
    border: `1px solid ${colors.border}`, padding: "13px 28px",
    borderRadius: radii.sm, textDecoration: "none",
  },
};

export default function NotFound() {
  return (
    <main style={s.wrap}>
      <p style={s.kicker}>Page not found</p>
      <h1 style={s.title}>
        Nothing is kept here
        <span style={s.khmer}>រកមិនឃើញទេ</span>
      </h1>
      <p style={s.text}>
        This shelf is empty — the page you asked for isn&rsquo;t part of the
        archive. The collection itself is still where you left it.
      </p>
      <div style={s.cta}>
        <Link href="/browse" style={s.btn} className="btn-primary">
          Browse the Archive
        </Link>
        <Link href="/" style={s.btnQuiet}>
          Back to Home
        </Link>
      </div>
      <SiteFooter />
    </main>
  );
}
