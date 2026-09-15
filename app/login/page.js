import Link from "next/link";
import AuthForm from "../../components/AuthForm.js";
import SiteFooter from "../../components/SiteFooter.js";
import T from "../../components/T.js";
import { colors, fonts, space, type, maxWidth, lineHeights } from "../../lib/theme.js";

export const metadata = {
  title: "Log in — Khmer Living Archive",
};

// The page is a server component; only the form itself crosses into the
// client, the same split every other page in app/ uses. Layout follows
// not-found.js — prose column, serif heading, Khmer beneath it in ink.
const s = {
  wrap: {
    maxWidth: maxWidth.prose,
    margin: "0 auto",
    padding: `${space.xl}px ${space.md}px ${space.xl}px`,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: "clamp(32px, 6vw, 44px)",
    fontWeight: 600,
    margin: 0,
    color: colors.ink,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
  },
  khmer: {
    display: "block",
    fontFamily: fonts.khmer,
    fontSize: 20,
    fontWeight: 400,
    color: colors.inkMuted,
    marginTop: space.xs,
    lineHeight: lineHeights.khmer,
  },
  lede: {
    fontFamily: fonts.serif,
    fontSize: type.body,
    lineHeight: 1.7,
    color: colors.inkMuted,
    margin: `${space.md}px 0 0`,
    maxWidth: maxWidth.field,
  },
  alt: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.inkMuted,
    margin: `${space.lg}px 0 0`,
  },
  altLink: { color: colors.brand, fontWeight: 600 },
};

export default function LogIn() {
  return (
    <main style={s.wrap}>
      <h1 style={s.title}>
        Log in
        <span style={s.khmer}>ចូលគណនី</span>
      </h1>
      <p style={s.lede}>
        The archive is open to read without an account. Signing in is for the
        work of keeping it — adding entries and correcting what is already
        here.
      </p>

      <AuthForm mode="login" />

      <p style={s.alt}>
        <T en="No account yet?" km="មិនទាន់មានគណនីមែនទេ?" />{" "}
        <Link href="/signup" style={s.altLink} className="text-link">
          <T en="Create one" km="បង្កើតគណនី" />
        </Link>
      </p>

      <SiteFooter />
    </main>
  );
}
