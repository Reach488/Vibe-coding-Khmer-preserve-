"use client";

import { useState } from "react";
import EntryCard from "./EntryCard.js";
import { colors, fonts, radii } from "../lib/theme.js";

const styles = {
  form: {
    display: "flex",
    gap: 12,
    marginTop: 32,
    marginBottom: 40,
    flexWrap: "wrap",
  },
  input: {
    flex: "1 1 240px",
    padding: "12px 16px",
    fontSize: 16,
    color: colors.ink,
    backgroundColor: "#FFFFFF",
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
  },
  count: {
    fontSize: 14,
    color: colors.inkFaint,
    margin: "0 0 8px",
  },
  empty: {
    fontSize: 15,
    color: colors.inkMuted,
    padding: "40px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
  },
};

export default function BrowseExplorer({ entries }) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const results = trimmed
    ? entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(trimmed.toLowerCase()) ||
          entry.khmerTerm.includes(query) ||
          entry.description.toLowerCase().includes(trimmed.toLowerCase())
      )
    : entries;

  return (
    <>
      <div style={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search prahok, kroeung, palm sugar…"
          style={styles.input}
          className="search-input"
          aria-label="Search the archive"
        />
      </div>

      <p style={styles.count}>
        {trimmed
          ? `${results.length} ${results.length === 1 ? "entry" : "entries"} match "${query}"`
          : `${results.length} entries in the archive`}
      </p>

      {results.length === 0 ? (
        <p style={styles.empty}>
          No entries match &ldquo;{query}&rdquo;. Try a different search term.
        </p>
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