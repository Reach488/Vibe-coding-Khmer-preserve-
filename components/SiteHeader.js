"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle.js";
import LanguageToggle from "./LanguageToggle.js";
import KhmerFlag from "./KhmerFlag.js";
import T from "./T.js";
import useSession from "../lib/useSession.js";
import getSupabaseClient from "../lib/supabase.js";
import { colors, fonts, space, type, maxWidth } from "../lib/theme.js";

const styles = {
  // The rule lives on the outer element so it spans the viewport; the inner
  // element carries the width cap so the brand lines up with page content.
  outer: { width: "100%" },
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: space.sm,
    maxWidth: maxWidth.page,
    margin: "0 auto",
    padding: `${space.md}px ${space.md}px`,
  },
  // The wordmark, and one of the four places mono survives. It sets in ink
  // rather than gamboge: gold is the provenance mark now, not a text colour,
  // and the wordmark is not an interactive accent either.
  //
  // inline-flex rather than a plain inline box so the flag and the words sit
  // on one baseline-centred row inside a single link — the whole mark is the
  // home link, not a flag next to a link.
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xs,
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.ink,
    textDecoration: "none",
  },
  // Links on one side, account state and controls bound together on the
  // other, so the header reads as three groups rather than a scattered row.
  right: { display: "flex", alignItems: "center", gap: space.md, flexWrap: "wrap" },
  // The row wraps. Without this the five links (Home, Browse, History, and
  // the two signed-out auth links) are one unbreakable 326px run, which is
  // wider than a 320px viewport can hold — the nav then forces the whole
  // document wider than the screen and the page scrolls sideways. The
  // parent wraps too, but that only moves this block as a unit; the links
  // inside it have to be allowed to break as well.
  nav: { display: "flex", alignItems: "center", gap: space.md, flexWrap: "wrap" },
  account: { display: "flex", alignItems: "center", gap: space.xs },
  controls: { display: "flex", alignItems: "center", gap: space.xs },
  link: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.ink,
    textDecoration: "none",
  },
  email: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.inkMuted,
  },
  signOut: {
    padding: "6px 10px",
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.ink,
    backgroundColor: "transparent",
    border: `1px solid ${colors.border}`,
    borderRadius: 2,
    cursor: "pointer",
  },
};

const links = [
  { href: "/", en: "Home", km: "ទំព័រដើម" },
  { href: "/browse", en: "Browse", km: "រុករក" },
  { href: "/history", en: "History", km: "ប្រវត្តិសាស្រ្ត" },
];

// Kept here rather than in lib/authCopy.js — that file is the two auth
// pages' form copy; this is header chrome, same as the `links` array above.
const authLinks = {
  signIn: { en: "Sign In", km: "ចូលគណនី" },
  createAccount: { en: "Create Account", km: "បង្កើតគណនី" },
  signOut: { en: "Sign Out", km: "ចេញពីគណនី" },
};

export default function SiteHeader() {
  const pathname = usePathname();
  const user = useSession();
  const [signingOut, setSigningOut] = useState(false);

  // /browse and /browse/[id] both belong to Browse, so the entry pages keep
  // showing where you are in the archive.
  const isCurrent = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // signingOut flips the header to its logged-out view the instant the
  // button is clicked, rather than waiting on the network round-trip to
  // Supabase — the old, signed-in view must never linger on screen.
  const isSignedIn = Boolean(user) && !signingOut;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await getSupabaseClient().auth.signOut();
    } catch {
      // No raw error is ever surfaced; the header already reads as signed
      // out regardless of whether the network round-trip succeeded.
    }
    setSigningOut(false);
  };

  return (
    <header className="site-header" style={styles.outer}>
      <div className="site-header-inner" style={styles.bar}>
        <Link
          href="/"
          style={styles.brand}
          className="nav-link site-header-brand"
        >
          <KhmerFlag />
          <span>KHMER LIVING ARCHIVE</span>
        </Link>
        <div style={styles.right}>
          <nav style={styles.nav}>
            {links.map(({ href, en, km }) => (
              <Link
                key={href}
                href={href}
                style={styles.link}
                className="nav-link"
                aria-current={isCurrent(href) ? "page" : undefined}
              >
                <T en={en} km={km} />
              </Link>
            ))}
            {user === undefined ? null : isSignedIn ? null : (
              <>
                <Link href="/login" style={styles.link} className="nav-link">
                  <T en={authLinks.signIn.en} km={authLinks.signIn.km} />
                </Link>
                <Link href="/signup" style={styles.link} className="nav-link">
                  <T
                    en={authLinks.createAccount.en}
                    km={authLinks.createAccount.km}
                  />
                </Link>
              </>
            )}
          </nav>
          {isSignedIn ? (
            <div style={styles.account}>
              <span style={styles.email} className="site-header-email" title={user.email}>
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                style={styles.signOut}
                className="signout-button"
              >
                <T en={authLinks.signOut.en} km={authLinks.signOut.km} />
              </button>
            </div>
          ) : null}
          <div style={styles.controls}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
