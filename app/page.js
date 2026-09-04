import collection from "../collection.config.js";
import entries from "../lib/entries.js";
import { colors, fonts, radii, maxWidth, shadows } from "../lib/theme.js";

const categories = [...new Set(entries.map((entry) => entry.category))];

const entryPhotos = entries.filter((e) => e.photo);

const s = {
  wrap: {
    maxWidth: maxWidth.narrow,
    margin: "0 auto",
    padding: "80px 24px 96px",
  },
  hero: { textAlign: "center", padding: "64px 0 40px" },
  kicker: {
    fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2.5,
    textTransform: "uppercase", color: colors.accent, margin: "0 0 28px",
  },
  title: {
    fontFamily: fonts.serif, fontSize: "clamp(38px, 7vw, 56px)",
    fontWeight: 700, margin: "0", lineHeight: 1.15, color: colors.ink,
    letterSpacing: "-0.01em",
  },
  titleKhmer: {
    display: "block", fontFamily: fonts.khmer, fontSize: "0.45em",
    fontWeight: 400, color: colors.accent, marginTop: 20, lineHeight: 1.4,
  },
  description: {
    fontSize: 17, color: colors.inkMuted, lineHeight: 1.8,
    margin: "24px auto 0", maxWidth: 540,
  },
  heroCta: {
    display: "flex", flexWrap: "wrap", gap: 12,
    justifyContent: "center", marginTop: 32,
  },
  btnPrimary: {
    display: "inline-block", fontSize: 15, fontWeight: 600,
    color: "#FFF", backgroundColor: colors.brand,
    padding: "14px 32px", borderRadius: radii.pill,
    textDecoration: "none", boxShadow: shadows.md,
    transition: "background-color 0.2s ease, transform 0.15s ease",
  },
  strip: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 16, margin: "56px 0 64px", padding: "24px 0",
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
    textAlign: "center",
  },
  val: {
    fontFamily: fonts.serif, fontSize: 32, fontWeight: 700,
    color: colors.brand, margin: 0,
  },
  lab: {
    fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1,
    textTransform: "uppercase", color: colors.inkMuted, margin: "4px 0 0",
  },
  section: { marginTop: 64 },
  st2: {
    fontFamily: fonts.serif, fontSize: 26, fontWeight: 700,
    margin: "0 0 12px", color: colors.ink,
  },
  stxt: {
    fontSize: 16, lineHeight: 1.8, color: colors.inkMuted, margin: "0 0 18px",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 },
  chip: {
    fontFamily: fonts.mono, fontSize: 12, color: colors.accent,
    backgroundColor: colors.accentBg, border: `1px solid ${colors.border}`,
    borderRadius: radii.pill, padding: "8px 16px",
  },
  introBox: {
    marginTop: 64, padding: "40px", backgroundColor: colors.bgAlt,
    border: `1px solid ${colors.border}`, borderRadius: radii.lg,
  },
  susadei: {
    fontFamily: fonts.khmer, fontSize: 44, textAlign: "center",
    color: colors.brand, margin: "0 0 8px", lineHeight: 1.2,
  },
  noteLabel: {
    fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1.5,
    textTransform: "uppercase", textAlign: "center",
    color: colors.inkFaint, margin: "0 0 20px",
  },
  card: {
    padding: 24, backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md, boxShadow: shadows.sm,
  },
  cardL: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5,
    color: colors.accent, margin: 0, textTransform: "uppercase",
  },
  cardV: {
    fontFamily: fonts.serif, fontSize: 20, margin: "8px 0 0", color: colors.ink,
  },
  count: {
    fontFamily: fonts.mono, fontSize: 13, color: colors.inkFaint,
    marginTop: 48, textAlign: "center", letterSpacing: 1,
    textTransform: "uppercase",
  },
  source: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 16, marginTop: 48, color: colors.inkFaint,
    fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1,
    textTransform: "uppercase",
  },
  footer: {
    marginTop: 64, paddingTop: 24, borderTop: `1px solid ${colors.border}`,
    fontSize: 13, textAlign: "center", color: colors.inkFaint,
  },
};

export default function Home() {
  return (
    <main style={s.wrap}>
      {/* Hero */}
      <section style={s.hero}>
        <p style={s.kicker}>THE KHMER LIVING ARCHIVE</p>
        <h1 style={s.title}>
          {collection.name}
          <span style={s.titleKhmer}>អាហារសម្ងួត និង គ្រឿងផ្សំ</span>
        </h1>
        <p style={s.description}>{collection.description}</p>
        <div className="hero-divider" style={{ margin: "24px auto" }} />
        <div style={s.heroCta}>
          <a href="/browse" style={s.btnPrimary} className="nav-link">
            Browse the Archive
          </a>
        </div>
        {entryPhotos.length > 0 && (
          <div className="photo-strip">
            <div className="photo-strip-track">
              {[...entryPhotos, ...entryPhotos].map((entry, i) => (
                <img key={`${entry.id}-${i}`} src={entry.photo} alt={entry.title} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Stats strip */}
      <section style={s.strip}>
        <div>
          <p style={s.val}>{entries.length}</p>
          <p style={s.lab}>Preserves</p>
        </div>
        <div>
          <p style={s.val}>{categories.length}</p>
          <p style={s.lab}>Techniques</p>
        </div>
        <div>
          <p style={s.val}>100%</p>
          <p style={s.lab}>Real Knowledge</p>
        </div>
      </section>

      {/* Why this archive exists */}
      <section style={s.section}>
        <h2 style={s.st2}>Why this archive exists</h2>
        <p style={s.stxt}>
          Long before refrigeration, Khmer households relied on salting,
          fermenting, and sun-drying to carry a harvest through the dry
          season — turning fish, herbs, and palm sap into pastes and syrups
          that could keep for months. Each technique was passed down by
          hand, not by recipe card, which means it survives only as long as
          someone keeps making it and someone else keeps asking how.
        </p>
        <p style={s.stxt}>
          This archive records that knowledge while it's still spoken
          knowledge: what an ingredient is called, how it's made, what it's
          used for, and whose kitchen it came from.
        </p>
      </section>

      {/* Motif divider */}
      <div className="archive-motif" style={{ margin: "48px 0" }}>
        <span style={{ color: colors.brand, fontSize: 18 }}>✷</span>
      </div>

      {/* What's preserved here */}
      <section style={s.section}>
        <h2 style={s.st2}>What&rsquo;s preserved here</h2>
        <p style={s.stxt}>
          Every entry documents one traditional paste or preserve —
          ingredients, method, and regional variation. The archive currently
          spans:
        </p>
        <div style={s.chips}>
          {categories.map((category) => (
            <span key={category} style={s.chip} className="category-chip">
              {category}
            </span>
          ))}
        </div>
      </section>

      {/* Curator intro feature */}
      <section style={s.introBox}>
        <p style={s.susadei}>សួស្តី</p>
        <p style={s.noteLabel}>A note from the curator</p>
        <div style={s.card}>
          <p style={s.cardL}>CURATED BY</p>
          <p style={s.cardV}>{collection.curator}</p>
          <p style={{ ...s.stxt, margin: "12px 0 0" }}>
            Knowledge gathered from {collection.source} and the kitchens
            of families across the country, recorded to be passed on.
          </p>
        </div>
      </section>

      <p style={s.count}>
        {entries.length} entries preserved in this archive
      </p>

      <p style={s.source}>
        <span>✦</span> Source: {collection.source} <span>✦</span>
      </p>

      <footer style={s.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
