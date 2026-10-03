import { colors, fonts, radii, space, type } from "../lib/theme.js";

// One labelled text field or textarea, with its problem written beside it.
// The box is AuthField's; this one also takes a long (textarea) variant and an
// error line. Values render as React text, never as HTML.
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
  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    fontFamily: fonts.khmer,
    fontSize: 16,
    lineHeight: 1.6,
    color: colors.ink,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
  },
  error: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    color: colors.brand,
    margin: `${space.xs}px 0 0`,
  },
};

export default function FormField({ field, value, error, onChange }) {
  const id = `field-${field.name}`;
  const Control = field.long ? "textarea" : "input";

  return (
    <div style={styles.row}>
      <label htmlFor={id} style={styles.label}>
        {field.label}
        {field.hint ? <span style={styles.hint}> — {field.hint}</span> : null}
      </label>
      <Control
        id={id}
        name={field.name}
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
        rows={field.long ? 6 : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        style={styles.input}
        className="auth-input"
      />
      {error ? (
        <p id={`${id}-error`} style={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
