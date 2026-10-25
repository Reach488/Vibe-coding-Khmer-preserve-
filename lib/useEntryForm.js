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

// A new entry waits for review now (supabase/gate.sql), so there's no
// published page to send its contributor to yet. Shown instead of a redirect.
const SUBMITTED = {
  en: "Thank you — your entry is saved and waiting for review. It will join the archive once a reviewer approves it.",
  km: "អរគុណ — ធាតុរបស់អ្នកបានរក្សាទុក ហើយកំពុងរង់ចាំការត្រួតពិនិត្យ។ វានឹងបញ្ចូលទៅក្នុងបណ្ណសារ នៅពេលអ្នកត្រួតពិនិត្យយល់ព្រម។",
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
  const [submitted, setSubmitted] = useState(false);

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
      if (entry) {
        const slug = await updateEntry(entry.uuid, cleaned, photo);
        router.push(`/browse/${slug}`);
      } else {
        await createEntry(cleaned, photo);
        setBusy(false);
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
      setFailed(entry ? FAILED.edit : FAILED.add);
      setBusy(false);
    }
  };

  return { values, errors, failed, submitted: submitted ? SUBMITTED : null, busy, change, setFile, handleSubmit };
}
