import Link from "next/link";

const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1000,
    margin: "0 auto",
    padding: "20px 24px",
    borderBottom: "1px solid #E4D6C3",
  },
  brand: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    letterSpacing: 1,
    color: "#8A5E14",
    textDecoration: "none",
  },
  nav: {
    display: "flex",
    gap: 24,
  },
  link: {
    fontSize: 15,
    color: "#2A1F17",
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
