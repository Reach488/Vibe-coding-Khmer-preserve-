"use client";

import { useState } from "react";
import T from "./T.js";
import { colors, fonts, radii, space, type } from "../lib/theme.js";

// Publish and Return for one queue entry, plus the optional note that goes
// with Return. The note is sent in the same review_entry call; publishing
// ignores it (the function clears any note on publish).
const button = {
  padding: "10px 20px", fontFamily: fonts.sans, fontSize: type.small, fontWeight: 600,
  border: `1px solid ${colors.brand}`, borderRadius: radii.sm, cursor: "pointer",
};
const s = {
  label: { display: "block", fontFamily: fonts.sans, fontSize: type.small, color: colors.inkMuted, marginTop: space.sm },
  note: {
    width: "100%", boxSizing: "border-box", marginTop: space.xs, padding: space.xs, minHeight: 72,
    fontFamily: fonts.sans, fontSize: type.small, lineHeight: 1.6, color: colors.ink,
    backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.sm,
  },
  actions: { display: "flex", gap: space.xs, flexWrap: "wrap", marginTop: space.sm },
  publish: { ...button, color: colors.onBrand, backgroundColor: colors.brand },
  ret: { ...button, color: colors.brand, backgroundColor: "transparent" },
  failed: { fontFamily: fonts.sans, fontSize: type.small, color: colors.brand, margin: `${space.xs}px 0 0` },
};

export default function ReviewActions({ entry, busy, failed, onDecide }) {
  const [note, setNote] = useState("");
  const noteId = `note-${entry.uuid}`;

  return (
    <>
      <label htmlFor={noteId} style={s.label}>
        <T en="Note for the contributor (sent with Return)" km="កំណត់ចំណាំសម្រាប់អ្នកចូលរួម (ផ្ញើជាមួយការបញ្ជូនត្រឡប់)" />
      </label>
      <textarea id={noteId} style={s.note} value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} />
      <div style={s.actions}>
        <button type="button" style={s.publish} className="btn-primary" disabled={busy} onClick={() => onDecide(entry, "published")}>
          <T en="Publish" km="ផ្សាយ" />
        </button>
        <button type="button" style={s.ret} className="signout-button" disabled={busy} onClick={() => onDecide(entry, "returned", note)}>
          <T en="Return" km="បញ្ជូនត្រឡប់ទៅវិញ" />
        </button>
      </div>
      {failed ? (
        <p style={s.failed} role="alert">
          <T
            en="That didn’t go through. Someone may have already reviewed this entry. Refresh to see the current queue."
            km="សកម្មភាពនេះមិនបានសម្រេចទេ។ ប្រហែលជាមាននរណាម្នាក់បានត្រួតពិនិត្យធាតុនេះរួចហើយ។ សូមផ្ទុកទំព័រឡើងវិញដើម្បីមើលបញ្ជីបច្ចុប្បន្ន។"
          />
        </p>
      ) : null}
    </>
  );
}
