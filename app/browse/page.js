import entries from "../../lib/entries.js";
import collection from "../../collection.config.js";
import SearchForm from "../../components/SearchForm.js";
import EntryCard from "../../components/EntryCard.js";

const styles = {
  wrap: { maxWidth: 1000, margin: "0 auto", padding: "56px 24px 80px" },
  kicker: { fontFamily: "'Courier New', monospace", fontSize: 13, letterSpacing: 1, color: "#8A5E14", margin: 0 },
  title: { fontFamily: "Georgia, 'Iowan Old Style', 'Times New Roman', serif", fontSize: "clamp(28px, 5vw, 40px)", margin: "12px 0 8px", color: "#2A1F17" },
  intro: { fontSize: 16, lineHeight: 1.7, color: "#6B5B4D", maxWidth: 640, margin: 0 },
  count: { fontSize: 14, color: "#8A7A69", margin: "0 0 8px" },
  empty: { fontSize: 15, color: "#6B5B4D", padding: "40px 0" },
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
        <div
          className="entry-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}
        >
          {results.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </main>
  );
}
