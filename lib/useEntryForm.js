"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FIELDS, clean, validate } from "./entryRules.js";
import checkPhoto from "./photo.js";
import { createEntry, updateEntry } from "./archive.js";

// The state and the submit sequence behind components/EntryForm.js, for adding
// an entry (no argument) or editing one (pass it).
//
// The sentences the contributor sees are fixed here; the real error goes to the
// console and never to the screen.
const FAILED = {
  add: {
    en: "Your entry couldn’t be saved. Check your connection and try again.",
    km: "មិនអាចរក្សាទុកធាតុរបស់អ្នកបានទេ។ សូមពិនិត្យការភ្ជាប់អ៊ីនធឺណិត ហើយសាកល្បងម្ដងទៀត។",
  },
  edit: { en: "That change wasn’t saved.", km: "ការផ្លាស់ប្ដូរនោះមិនបានរក្សាទុកទេ។" },
};

const initialValues = (entry) =>
  Object.fromEntries(
    FIELDS.map((f) => {
      const value = entry?.[f.name] ?? "";
      return [f.name, f.tags ? value.join?.(", ") ?? "" : value];
    })
  );

export default function useEntryForm(entry) {
  const router = useRouter();
  const [values, setValues] = useState(() => initialValues(entry));
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [failed, setFailed] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  // Trim, check every rule, check the photo by its bytes, and only then send
  // anything. A problem stops the sequence before the network is touched.
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

  return { values, errors, failed, busy, change, setFile, handleSubmit };
}
