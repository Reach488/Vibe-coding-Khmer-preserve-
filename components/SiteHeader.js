"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle.js";
import LanguageToggle from "./LanguageToggle.js";
import T from "./T.js";
import { colors, fonts, maxWidth } from "../lib/theme.js";

const styles = {
  // The rule lives on the outer element so it spans the viewport; the inner
  // element carries the width cap so the brand lines up with page content.
  outer: { width: "100%" },
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    maxWidth: maxWidth.wide,
    margin: "0 auto",
    padding: "20px 24px",
  },
  brand: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.accent,
    textDecoration: "none",
  },
  // Links on one side, the two controls bound together on the other, so the
  // header reads as three groups rather than five loose items.
  right: { display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" },
  nav: { display: "flex", alignItems: "center", gap: 20 },
  controls: { display: "flex", alignItems: "center", gap: 8 },
  link: {
    fontFamily: fonts.sans,
    fontSize: 15,
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
