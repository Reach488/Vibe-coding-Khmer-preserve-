"use client";

import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard.js";
import T from "./T.js";
import { fetchPendingEntries, reviewEntry } from "../lib/archive.js";
import { colors, fonts, space, type } from "../lib/theme.js";

// The list on /review. Only rendered after the page's server check said this
// visitor is a reviewer. An entry leaves the list only when review_entry
// answered true; anything else leaves it where it is, marked as failed.
const s = {
  note: { fontFamily: fonts.serif, fontSize: type.body, lineHeight: 1.7, color: colors.inkFaint, margin: `${space.lg}px 0` },
  list: { listStyle: "none", margin: `${space.lg}px 0 0`, padding: 0 },
};

export default function ReviewQueue() {
  const [state, setState] = useState({ entries: [], loading: true, error: null });
  const [busyId, setBusyId] = useState(null);
  const [failedId, setFailedId] = useState(null);

  useEffect(() => {
    let active = true;
    fetchPendingEntries()
      .then((entries) => active && setState({ entries, loading: false, error: null }))
      .catch((error) => active && setState({ entries: [], loading: false, error }));
    return () => {
      active = false;
    };
  }, []);

  const decide = async (entry, decision, note) => {
    setBusyId(entry.uuid);
    setFailedId(null);
    const done = await reviewEntry(entry, decision, note);
    if (done) {
      setState((s) => ({ ...s, entries: s.entries.filter((e) => e.uuid !== entry.uuid) }));
    } else {
      setFailedId(entry.uuid);
    }
    setBusyId(null);
  };

  if (state.loading) {
    return (
      <p style={s.note} role="status">
        <T en="Loading the queue…" km="កំពុងផ្ទុកបញ្ជីរង់ចាំ…" />
      </p>
    );
  }
  if (state.error) {
    return (
      <p style={s.note} role="status">
        <T en="The queue could not be reached. Try again in a moment." km="មិនអាចទាក់ទងបញ្ជីរង់ចាំបានទេ។ សូមសាកល្បងម្ដងទៀតបន្តិចក្រោយ។" />
      </p>
    );
  }
  if (state.entries.length === 0) {
    return (
      <p style={s.note}>
        <T en="Nothing is waiting for review." km="មិនមានអ្វីរង់ចាំការត្រួតពិនិត្យទេ។" />
      </p>
    );
  }
  return (
    <ul style={s.list}>
      {state.entries.map((entry) => (
        <ReviewCard
          key={entry.uuid}
          entry={entry}
          busy={busyId === entry.uuid}
          failed={failedId === entry.uuid}
          onDecide={decide}
        />
      ))}
    </ul>
  );
}
