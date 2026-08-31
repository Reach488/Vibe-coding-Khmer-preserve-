"use client";

import { useMemo, useState } from "react";
import entries from "../lib/entries.js";
import SearchForm from "./SearchForm.js";
import EntryCard from "./EntryCard.js";
import { colors } from "../lib/theme.js";

const styles = {
  count: { fontSize: 14, color: colors.inkFaint, margin: "0 0 8px" },
  empty: { fontSize: 15, color: colors.inkMuted, padding: "40px 0" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
  },
};

export default function BrowseExplorer({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query) return entries;
    return entries.filter(
      (entry) =>
        entry.title.includes(query) ||
        entry.khmerTerm.includes(query) ||
        entry.description.includes(query)
    );
  }, [query]);

  return (
    <>
      <SearchForm value={query} onChange={setQuery} />

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
    </>
  );
}
