"use client";

import { colors, fonts, radii, shadows } from "../lib/theme.js";

const styles = {
  form: {
    display: "flex",
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
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
  button: {
    padding: "12px 24px",
    fontFamily: fonts.sans,
    fontSize: 15,
    fontWeight: 600,
    borderRadius: radii.pill,
    cursor: "pointer",
  },
  searchButton: {
    color: "#FFFFFF",
    backgroundColor: colors.brand,
    border: `1px solid ${colors.brand}`,
    boxShadow: shadows.sm,
  },
  clearButton: {
    color: colors.inkMuted,
    backgroundColor: "transparent",
    border: `1px solid ${colors.border}`,
  },
};

export default function ArchiveSearchBar({ value, onChange, onSearch, onClear }) {
  // Enter inside the field submits the form, which lands here. The search runs
  // locally against the archive; the page never reloads or navigates away.
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && value) onClear();
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit} role="search">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search prahok, kroeung, palm sugar…"
        style={styles.input}
        className="search-input"
        aria-label="Search the archive"
      />

      <button
        type="submit"
        style={{ ...styles.button, ...styles.searchButton }}
        className="search-button search-button-primary"
      >
        Search
      </button>

      {value ? (
        <button
          type="button"
          onClick={onClear}
          style={{ ...styles.button, ...styles.clearButton }}
          className="search-button search-button-secondary"
        >
          Clear
        </button>
      ) : null}
    </form>
  );
}
