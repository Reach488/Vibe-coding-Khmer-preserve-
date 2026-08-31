"use client";

import { colors, radii } from "../lib/theme.js";

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
};

export default function SearchForm({ value, onChange }) {
  return (
    <div style={styles.form}>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search prahok, kroeung, palm sugar…"
        style={styles.input}
        className="search-input"
        aria-label="Search the archive"
      />
    </div>
  );
}
