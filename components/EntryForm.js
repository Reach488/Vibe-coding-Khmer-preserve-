"use client";

import FormField from "./FormField.js";
import PhotoField from "./PhotoField.js";
import T from "./T.js";
import useEntryForm from "../lib/useEntryForm.js";
import { FIELDS } from "../lib/entryRules.js";
import { colors, fonts, radii, space, type, maxWidth } from "../lib/theme.js";

// One form for adding and editing. Pass `entry` to edit it, nothing to add.
// Everything it does when submitted lives in lib/useEntryForm.js.
const styles = {
  form: { maxWidth: maxWidth.prose, marginTop: space.lg },
  failed: {
    fontFamily: fonts.sans, fontSize: type.small, color: colors.brand,
    borderLeft: `2px solid ${colors.brand}`, padding: `${space.xs}px 0 ${space.xs}px ${space.sm}px`,
    margin: `0 0 ${space.md}px`,
  },
  submit: {
    padding: "13px 28px", fontFamily: fonts.sans, fontSize: type.small, fontWeight: 600,
    color: colors.onBrand, backgroundColor: colors.brand, border: `1px solid ${colors.brand}`,
    borderRadius: radii.sm, cursor: "pointer",
  },
};

export default function EntryForm({ entry }) {
  const { values, errors, failed, busy, change, setFile, handleSubmit } = useEntryForm(entry);

  return (
    <form style={styles.form} onSubmit={handleSubmit} noValidate>
      {failed ? (
        <p style={styles.failed} role="alert">
          <T en={failed.en} km={failed.km} />
        </p>
      ) : null}
      {FIELDS.map((field) => (
        <FormField key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={change} />
      ))}
      <PhotoField error={errors.photo} hasCurrent={Boolean(entry)} onChange={setFile} />
      <button type="submit" style={styles.submit} className="btn-primary" disabled={busy}>
        {busy ? (
          <T en="Saving…" km="កំពុងរក្សាទុក…" />
        ) : entry ? (
          <T en="Save changes" km="រក្សាទុកការផ្លាស់ប្ដូរ" />
        ) : (
          <T en="Add to the archive" km="បញ្ចូលទៅបណ្ណសារ" />
        )}
      </button>
    </form>
  );
}
