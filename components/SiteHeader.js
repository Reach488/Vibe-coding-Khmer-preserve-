"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle.js";
import LanguageToggle from "./LanguageToggle.js";
import T from "./T.js";
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
  brand: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.ink,
    textDecoration: "none",
  },
  // Links on one side, the two controls bound together on the other, so the
  // header reads as three groups rather than five loose items.
  right: { display: "flex", alignItems: "center", gap: space.md, flexWrap: "wrap" },
  nav: { display: "flex", alignItems: "center", gap: space.md },
  controls: { display: "flex", alignItems: "center", gap: space.xs },
  link: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.ink,
    textDecoration: "none",
  },
};

const links = [
  { href: "/", en: "Home", km: "ទំព័រដើម" },
  { href: "/browse", en: "Browse", km: "រុករក" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  // /browse and /browse/[id] both belong to Browse, so the entry pages keep
  // showing where you are in the archive.
  const isCurrent = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header" style={styles.outer}>
      <div className="site-header-inner" style={styles.bar}>
        <Link
          href="/"
          style={styles.brand}
          className="nav-link site-header-brand"
        >
          KHMER LIVING ARCHIVE
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
          </nav>
          <div style={styles.controls}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
