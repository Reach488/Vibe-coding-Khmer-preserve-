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
  button: {
    padding: "12px 24px",
    fontSize: 15,
    fontWeight: 600,
    color: "#FFFFFF",
    backgroundColor: colors.brand,
    border: "none",
    borderRadius: radii.sm,
    cursor: "pointer",
  },
};

export default function SearchForm({ defaultValue }) {
  return (
    <form action="/browse" method="GET" style={styles.form}>
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search prahok, kroeung, palm sugar…"
        style={styles.input}
        className="search-input"
        aria-label="Search the archive"
      />
      <button type="submit" style={styles.button} className="search-button">
        Search
      </button>
    </form>
  );
}
