import Link from "next/link";
import { colors, fonts, maxWidth } from "../lib/theme.js";

const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    maxWidth: maxWidth.wide,
    margin: "0 auto",
    padding: "20px 24px",
    borderBottom: `1px solid ${colors.border}`,
  },
  brand: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.accent,
    textDecoration: "none",
  },
  nav: {
    display: "flex",
    gap: 24,
  },
  link: {
    fontSize: 15,
    color: colors.ink,
    textDecoration: "none",
  },
};

export default function SiteHeader() {
  return (
    <header style={styles.bar}>
      <Link href="/" style={styles.brand} className="nav-link">
        KHMER LIVING ARCHIVE
      </Link>
      <nav style={styles.nav}>
        <Link href="/" style={styles.link} className="nav-link">
          Home
        </Link>
        <Link href="/browse" style={styles.link} className="nav-link">
          Browse
        </Link>
      </nav>
    </header>
  );
}
