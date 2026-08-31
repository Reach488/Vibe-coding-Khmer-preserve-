import entries from "../../lib/entries.js";
import collection from "../../collection.config.js";
import SearchForm from "../../components/SearchForm.js";
import EntryCard from "../../components/EntryCard.js";
import { colors, fonts, maxWidth } from "../../lib/theme.js";

const styles = {
  wrap: { maxWidth: maxWidth.wide, margin: "0 auto", padding: "56px 24px 80px" },
  kicker: { fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1, color: colors.accent, margin: 0 },
  title: { fontFamily: fonts.serif, fontSize: "clamp(28px, 5vw, 40px)", margin: "12px 0 8px", color: colors.ink },
  intro: { fontSize: 16, lineHeight: 1.7, color: colors.inkMuted, maxWidth: 640, margin: 0 },
  count: { fontSize: 14, color: colors.inkFaint, margin: "0 0 8px" },
  empty: { fontSize: 15, color: colors.inkMuted, padding: "40px 0" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
  },
};

export default async function BrowsePage({ searchParams }) {
  const params = await searchParams;
  const query = (params?.q || "").trim();
  const q = query.toLowerCase();

  const results = q
    ? entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.khmerTerm.includes(query) ||
          entry.description.toLowerCase().includes(q)
      )
    : entries;

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>BROWSE THE ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.intro}>{collection.description}</p>

      <SearchForm defaultValue={query} />

      <p style={styles.count}>
        {query
          ? `${results.length} ${results.length === 1 ? "entry" : "entries"} match "${query}"`
          : `${results.length} entries in the archive`}
      </p>

      {results.length === 0 ? (
        <p style={styles.empty}>No entries match "{query}". Try a different search term.</p>
      ) : (
        <div className="entry-grid" style={styles.grid}>
          {results.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </main>
  );
}
