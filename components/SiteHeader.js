"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle.js";
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
  // The nav links and the theme control sit in one group so the row stays a
  // clean two-part header once the language toggle joins them.
  right: { display: "flex", alignItems: "center", gap: 20 },
  nav: { display: "flex", gap: 24 },
  link: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    textDecoration: "none",
  },
};

const links = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
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
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={styles.link}
                className="nav-link"
                aria-current={isCurrent(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
