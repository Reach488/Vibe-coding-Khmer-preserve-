"use client";

import { colors, fonts, radii, maxWidth } from "../lib/theme.js";

const styles = {
  // Input, clear and submit share one border box, the way archive search
  // reads on Rijksmuseum and the V&A — not a rounded field beside a pill.
  form: {
    display: "flex",
    alignItems: "stretch",
    maxWidth: maxWidth.field,
    marginTop: 24,
    marginBottom: 20,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  input: {
    flex: "1 1 auto",
    minWidth: 0,
    padding: "12px 14px",
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: "transparent",
    border: "none",
  },
  // Clear lives inside the field, so the submit button never moves when it
  // appears. Reserving the width keeps the input from reflowing too.
  clearSlot: {
    flex: "0 0 36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  clear: {
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    fontSize: 15,
    lineHeight: 1,
    color: colors.inkFaint,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: radii.sm,
    cursor: "pointer",
  },
  submit: {
    flex: "0 0 auto",
    padding: "12px 22px",
    fontFamily: fonts.sans,
    fontSize: 15,
    fontWeight: 600,
    color: colors.onBrand,
    backgroundColor: colors.brand,
    border: "none",
    borderLeft: `1px solid ${colors.brand}`,
    cursor: "pointer",
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
    <form
      style={styles.form}
      className="search-field"
      onSubmit={handleSubmit}
      role="search"
    >
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

      <span style={styles.clearSlot}>
        {value ? (
          <button
            type="button"
            onClick={onClear}
            style={styles.clear}
            className="search-clear"
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </span>

      <button
        type="submit"
        style={styles.submit}
        className="search-button search-button-primary"
      >
        Search
      </button>
    </form>
  );
}
