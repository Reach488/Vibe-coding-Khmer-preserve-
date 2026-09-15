import { colors, fonts, radii, space, type } from "../lib/theme.js";
import T from "./T.js";

// One labelled field. The archive has exactly one existing input — the search
// bar — and this borrows its box: 1px border, 2px corners, surface fill,
// 16px text so iOS does not zoom on focus. The difference is that search is a
// single field sharing a border box with its button, while a form is a stack
// of separate fields, so the border sits on the input itself here.
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
  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
  },
};

export default function AuthField({
  id,
  inputType,
  autoComplete,
  value,
  onChange,
  labelEn,
  labelKm,
  minLength,
}) {
  return (
    <div style={styles.row}>
      <label htmlFor={id} style={styles.label}>
        <T en={labelEn} km={labelKm} />
      </label>
      <input
        id={id}
        name={id}
        type={inputType}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        minLength={minLength}
        style={styles.input}
        className="auth-input"
      />
    </div>
  );
}
