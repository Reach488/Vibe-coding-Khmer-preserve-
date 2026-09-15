import collection from "../collection.config.js";
import entries from "../lib/entries.js";
import SiteFooter from "../components/SiteFooter.js";
import T from "../components/T.js";
import { colors, fonts, radii, maxWidth, lineHeights } from "../lib/theme.js";

const categories = [...new Set(entries.map((entry) => entry.category))];

const entryPhotos = entries.filter((e) => e.photo);

// Techniques, not categories: the categories list is one-per-entry, so
// counting it just restated the entry count. Group by preserving method
// instead, which is the thing the archive is actually organised around.
const techniques = [...new Set(entries.map((entry) => techniqueOf(entry)))];

function techniqueOf(entry) {
  const text = `${entry.category} ${entry.title}`.toLowerCase();
  if (text.includes("ferment")) return "Fermenting";
  if (text.includes("smok")) return "Smoking";
  if (text.includes("dried") || text.includes("cured")) return "Sun-drying";
  if (text.includes("sugar")) return "Rendering";
  if (text.includes("preserved")) return "Salt-curing";
  return "Pounding";
}

const s = {
  wrap: { maxWidth: maxWidth.narrow, margin: "0 auto", padding: "32px 24px 56px" },
  hero: { textAlign: "center", padding: "8px 0 24px" },
  kicker: {
    fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2.5,
    textTransform: "uppercase", color: colors.accent, margin: "0 0 20px",
  },
  title: {
    fontFamily: fonts.serif, fontSize: "clamp(34px, 7vw, 58px)",
    fontWeight: 600, margin: 0, lineHeight: 1.12, color: colors.ink,
    letterSpacing: "-0.015em",
  },
  titleKhmer: {
    display: "block", fontFamily: fonts.khmer, fontSize: "0.4em",
    fontWeight: 400, color: colors.accent, marginTop: 18,
    lineHeight: lineHeights.khmer,
  },
  heroCta: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 28 },
  // No pill, no shadow, and no .nav-link class — that underline pseudo-element
  // was padding the button and pushing its label off centre.
  btnPrimary: {
    display: "inline-block", fontFamily: fonts.sans, fontSize: 15, fontWeight: 600,
    color: colors.onBrand, backgroundColor: colors.brand,
    border: `1px solid ${colors.brand}`, padding: "13px 28px",
    borderRadius: radii.sm, textDecoration: "none",
  },
  strip: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 16, margin: "40px 0", padding: "20px 0",
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
    textAlign: "center",
  },
  val: { fontFamily: fonts.serif, fontSize: 30, fontWeight: 600, color: colors.brand, margin: 0 },
  lab: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1,
    textTransform: "uppercase", color: colors.inkFaint, margin: "4px 0 0",
  },
  section: { marginTop: 44 },
  st2: {
    fontFamily: fonts.serif, fontSize: 27, fontWeight: 600,
    margin: "0 0 12px", color: colors.ink, lineHeight: 1.25,
  },
  stxt: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 1.75, color: colors.inkMuted, margin: "0 0 14px" },
  chips: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 },
  chip: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.5,
    textTransform: "uppercase", color: colors.accent,
    backgroundColor: colors.accentBg, border: `1px solid ${colors.borderSoft}`,
    borderRadius: radii.sm, padding: "5px 10px",
  },
  introBox: {
    marginTop: 44, padding: 28, backgroundColor: colors.bgAlt,
    border: `1px solid ${colors.border}`, borderRadius: radii.lg,
  },
  susadei: {
    fontFamily: fonts.khmer, fontSize: 34, color: colors.brand,
    margin: "0 0 4px", lineHeight: lineHeights.khmer,
  },
  noteLabel: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5,
    textTransform: "uppercase", color: colors.inkFaint, margin: "0 0 16px",
  },
  cardL: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5,
    color: colors.accent, margin: 0, textTransform: "uppercase",
  },
  cardV: { fontFamily: fonts.serif, fontSize: 20, fontWeight: 600, margin: "6px 0 0", color: colors.ink },
};

export default function Home() {
  return (
    <main style={s.wrap}>
      {/* Hero */}
      <section style={s.hero}>
        <p style={s.kicker}>
          <T en="The Khmer Living Archive" km="បណ្ណសាររស់ខ្មែរ" />
        </p>
        <h1 style={s.title}>
          {collection.name}
          <span style={s.titleKhmer}>អាហារសម្ងួត និង គ្រឿងផ្សំ</span>
        </h1>
        {/* The collection description used to sit here. It is a 40-word
            sentence naming all ten preserves, directly above a photo strip
            of those same ten — it crowded the hero without adding anything
            the photos and the "Why this archive exists" section below do not
            already say. It still ships as the page's meta description. */}
        <div className="hero-divider" style={{ margin: "30px auto 0" }} />
        <div style={s.heroCta}>
          <a href="/browse" style={s.btnPrimary} className="btn-primary">
            <T en="Browse the Archive" km="រុករកបណ្ណសារ" />
          </a>
        </div>
        {entryPhotos.length > 0 && (
          <div className="photo-strip">
            <div className="photo-strip-track">
              {[...entryPhotos, ...entryPhotos].map((entry, i) => (
                <img
                  key={`${entry.id}-${i}`}
                  src={entry.photo}
                  alt={i < entryPhotos.length ? entry.title : ""}
                  aria-hidden={i >= entryPhotos.length ? "true" : undefined}
                  width={240}
                  height={180}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Stats strip */}
      <section className="stat-strip" style={s.strip}>
        <div>
          <p style={s.val}>{entries.length}</p>
          <p style={s.lab}><T en="Preserves" km="អាហារសម្ងួត" /></p>
        </div>
        <div>
          <p style={s.val}>{techniques.length}</p>
          <p style={s.lab}><T en="Techniques" km="បច្ចេកទេស" /></p>
        </div>
        <div>
          <p style={s.val}>1</p>
          <p style={s.lab}><T en="Kitchen" km="ផ្ទះបាយ" /></p>
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
          This archive records that knowledge while it&rsquo;s still spoken
          knowledge: what an ingredient is called, how it&rsquo;s made, what
          it&rsquo;s used for, and whose kitchen it came from.
        </p>
      </section>

      {/* Motif divider */}
      <div className="archive-motif" style={{ margin: "40px 0" }}>
        <span style={{ fontSize: 16 }}>✷</span>
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
        <p style={s.noteLabel}>
          <T en="A note from the curator" km="សារពីអ្នកចងក្រង" />
        </p>
        <p style={s.cardL}><T en="Curated by" km="ចងក្រងដោយ" /></p>
        <p style={s.cardV}>{collection.curator}</p>
        <p style={{ ...s.stxt, margin: "12px 0 0" }}>
          Knowledge gathered from {collection.source} and the kitchens
          of families across the country, recorded to be passed on.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
