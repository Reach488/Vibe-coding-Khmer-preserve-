"use client";

import { useState } from "react";
import ArchiveSearchBar from "./ArchiveSearchBar.js";
import EntryCard from "./EntryCard.js";
import { filterEntries, normalizeText } from "../lib/search.js";
import { toKhmerDigits } from "../lib/lang.js";
import useLang from "../lib/useLang.js";
import { colors, fonts, space, type, maxWidth } from "../lib/theme.js";

const styles = {
  // One of the few places mono still earns its keep: this is a ledger count,
  // and it reads as instrument output rather than as prose.
  count: {
    fontFamily: fonts.mono,
    fontSize: type.meta,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.inkFaint,
    margin: `0 0 ${space.md}px`,
  },
  empty: {
    fontFamily: fonts.serif,
    fontSize: type.body,
    lineHeight: 1.7,
    color: colors.inkMuted,
    margin: 0,
    maxWidth: maxWidth.prose,
    paddingBottom: space.lg,
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

  // These strings interpolate a count, so they are built here rather than
  // handed to <T> as two fixed halves.
  const isKm = useLang() === "km";
  const count = hasQuery
    ? isKm
      ? `រកឃើញ ${toKhmerDigits(results.length)} ធាតុ`
      : `${results.length} ${results.length === 1 ? "entry" : "entries"} found`
    : isKm
      ? `${toKhmerDigits(results.length)} ធាតុក្នុងបណ្ណសារ`
      : `${results.length} entries in the archive`;

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

      <p style={styles.count}>{count}</p>

      {results.length === 0 ? (
        // One line, not a heading over a paragraph. The count directly above
        // already says nothing was found; this only has to say what to try.
        <p style={styles.empty}>
          {isKm
            ? `គ្មានធាតុត្រូវនឹង “${searchInput}” ទេ — សាកល្បងឈ្មោះខ្មែរ ឈ្មោះអង់គ្លេស ឬ ពាក្យទូលាយជាង។`
            : `Nothing matches “${searchInput}” — try the Khmer name, the English name, or a broader word.`}
        </p>
      ) : (
        <div className="entry-grid">
          {results.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </>
  );
}
