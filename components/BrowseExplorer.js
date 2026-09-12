"use client";

import { useState } from "react";
import ArchiveSearchBar from "./ArchiveSearchBar.js";
import EntryCard from "./EntryCard.js";
import { filterEntries, normalizeText } from "../lib/search.js";
import { colors, fonts } from "../lib/theme.js";

const styles = {
  count: {
    fontSize: 14,
    color: colors.inkFaint,
    margin: "0 0 6px",
  },
  empty: {
    padding: "48px 0",
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: 700,
    color: colors.ink,
    margin: "0 0 8px",
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 1.7,
    color: colors.inkMuted,
    margin: 0,
    maxWidth: 540,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
  },
};

export default function BrowseExplorer({ entries }) {
  // searchInput = what the user sees in the box; query = the value actually
  // being matched. Typing updates both so live search keeps working, and the
  // Search button re-commits the input. Either way the results below come from
  // one single call to filterEntries() — never a second algorithm.
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const results = filterEntries(entries, query);
  const hasQuery = normalizeText(query).length > 0;

  const handleChange = (next) => {
    setSearchInput(next);
    setQuery(next);
  };

  const handleSearch = () => {
    setQuery(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setQuery("");
  };

  return (
    <>
      <ArchiveSearchBar
        value={searchInput}
        onChange={handleChange}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <p style={styles.count}>
        {hasQuery
          ? `${results.length} ${results.length === 1 ? "entry" : "entries"} found`
          : `${results.length} entries in the archive`}
      </p>

      {results.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyTitle}>No entries found</p>
          <p style={styles.emptyText}>
            We couldn&rsquo;t find anything in the archive matching &ldquo;{searchInput}&rdquo;.
            Try a different spelling, Khmer name, English name, or broader keyword.
          </p>
        </div>
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
