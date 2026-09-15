import Link from "next/link";
import AuthForm from "../../components/AuthForm.js";
import SiteFooter from "../../components/SiteFooter.js";
import T from "../../components/T.js";
import { colors, fonts, space, type, maxWidth, lineHeights } from "../../lib/theme.js";

export const metadata = {
  title: "Create an account — Khmer Living Archive",
};

// Same shape as app/login/page.js. The two pages are deliberately not one
// parameterised route: /signup and /login are separate addresses a visitor
// types and bookmarks, and each carries its own heading, sentence and title.
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
  hint: {
    fontFamily: fonts.sans,
    fontSize: type.meta,
    color: colors.inkFaint,
    margin: `${space.sm}px 0 0`,
  },
  alt: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.inkMuted,
    margin: `${space.lg}px 0 0`,
  },
  altLink: { color: colors.brand, fontWeight: 600 },
};

export default function SignUp() {
  return (
    <main style={s.wrap}>
      <h1 style={s.title}>
        Create an account
        <span style={s.khmer}>បង្កើតគណនី</span>
      </h1>
      <p style={s.lede}>
        An account is how the archive knows who added what. Reading needs
        nothing — this is for the people who keep the collection.
      </p>
      <p style={s.hint}>
        <T
          en="Passwords must be at least 6 characters."
          km="ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ។"
        />
      </p>

      <AuthForm mode="signup" />

      <p style={s.alt}>
        <T en="Already have an account?" km="មានគណនីរួចហើយមែនទេ?" />{" "}
        <Link href="/login" style={s.altLink} className="text-link">
          <T en="Log in" km="ចូលគណនី" />
        </Link>
      </p>

      <SiteFooter />
    </main>
  );
}
