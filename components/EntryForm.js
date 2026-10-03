"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "./FormField.js";
import PhotoField from "./PhotoField.js";
import { FIELDS, clean, validate } from "../lib/entryRules.js";
import checkPhoto from "../lib/photo.js";
import { createEntry, updateEntry } from "../lib/archive.js";
import { colors, fonts, radii, space, type, maxWidth } from "../lib/theme.js";

// One form for adding and editing. Pass `entry` to edit it, nothing to add.
// The sentences the contributor sees are fixed here; the real error goes to
// the console and never to the screen.
const FAILED = {
  add: "Your entry couldn’t be saved. Check your connection and try again.",
  edit: "That change wasn’t saved.",
};

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

const initialValues = (entry) =>
  Object.fromEntries(
    FIELDS.map((f) => {
      const value = entry?.[f.name] ?? "";
      return [f.name, f.tags ? value.join?.(", ") ?? "" : value];
    })
  );

export default function EntryForm({ entry }) {
  const router = useRouter();
  const [values, setValues] = useState(() => initialValues(entry));
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [failed, setFailed] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFailed("");
    const cleaned = clean(values);
    const found = validate(cleaned);

    let photo = null;
    if (file || !entry) {
      const checked = await checkPhoto(file);
      if (checked.error) found.photo = checked.error;
      else photo = checked;
    }
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      const slug = entry
        ? await updateEntry(entry.uuid, cleaned, photo)
        : await createEntry(cleaned, photo);
      router.push(`/browse/${slug}`);
    } catch (error) {
      console.error(error);
      setFailed(entry ? FAILED.edit : FAILED.add);
      setBusy(false);
    }
  };

  const change = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  return (
    <form style={styles.form} onSubmit={handleSubmit} noValidate>
      {failed ? <p style={styles.failed} role="alert">{failed}</p> : null}
      {FIELDS.map((field) => (
        <FormField key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={change} />
      ))}
      <PhotoField error={errors.photo} hasCurrent={Boolean(entry)} onChange={setFile} />
      <button type="submit" style={styles.submit} className="btn-primary" disabled={busy}>
        {busy ? "Saving…" : entry ? "Save changes" : "Add to the archive"}
      </button>
    </form>
  );
}
