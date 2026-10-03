import { colors, fonts, space, type } from "../lib/theme.js";

// The file picker. `accept` only filters the picker's dialog; lib/photo.js is
// what actually checks the file when the form is submitted.
const styles = {
  row: { display: "block", marginBottom: space.md },
  label: {
    display: "block",
    fontFamily: fonts.sans,
    fontSize: type.small,
    fontWeight: 600,
    color: colors.ink,
    marginBottom: space.xs,
  },
  hint: { fontWeight: 400, color: colors.inkMuted },
  input: { fontFamily: fonts.sans, fontSize: type.small, color: colors.ink, maxWidth: "100%" },
  error: { fontFamily: fonts.sans, fontSize: type.small, color: colors.brand, margin: `${space.xs}px 0 0` },
};

export default function PhotoField({ error, hasCurrent, onChange }) {
  return (
    <div style={styles.row}>
      <label htmlFor="field-photo" style={styles.label}>
        Photo
        <span style={styles.hint}>
          {hasCurrent
            ? " — leave empty to keep the current photo"
            : " — JPEG, PNG or WebP, up to 5 MB"}
        </span>
      </label>
      <input
        id="field-photo"
        name="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "field-photo-error" : undefined}
        style={styles.input}
      />
      {error ? (
        <p id="field-photo-error" style={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
