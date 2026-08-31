import collection from "../../collection.config.js";
import BrowseExplorer from "../../components/BrowseExplorer.js";
import { colors, fonts, maxWidth } from "../../lib/theme.js";

const styles = {
  wrap: { maxWidth: maxWidth.wide, margin: "0 auto", padding: "56px 24px 80px" },
  kicker: { fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1, color: colors.accent, margin: 0 },
  title: { fontFamily: fonts.serif, fontSize: "clamp(28px, 5vw, 40px)", margin: "12px 0 8px", color: colors.ink },
  intro: { fontSize: 16, lineHeight: 1.7, color: colors.inkMuted, maxWidth: 640, margin: 0 },
};

export default async function BrowsePage({ searchParams }) {
  const params = await searchParams;
  const initialQuery = (params?.q || "").trim();

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>BROWSE THE ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.intro}>{collection.description}</p>

      <BrowseExplorer initialQuery={initialQuery} />
    </main>
  );
}
