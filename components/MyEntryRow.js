import Link from "next/link";
import T from "./T.js";
import { STATUS_LABELS } from "../lib/entryStatus.js";
import { colors, fonts, radii, space, type } from "../lib/theme.js";

// One row in /my-entries: the title, its status in plain words, a link, and
// on a returned entry the reviewer's note saying what to change.
// The entry's own page is reachable at any status — row-level security
// already lets the owner see it (supabase/gate.sql); this just links there.
const styles = {
  row: {
    display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap",
    gap: space.md, padding: `${space.sm}px 0`, borderBottom: `1px solid ${colors.borderSoft}`,
  },
  // A returned entry's reason, on its own line under the title and status.
  note: {
    flexBasis: "100%", margin: 0, fontFamily: fonts.sans, fontSize: type.small,
    lineHeight: 1.6, color: colors.inkMuted, whiteSpace: "pre-line",
  },
  title: { fontFamily: fonts.serif, fontSize: type.body, color: colors.ink, textDecoration: "none" },
  status: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase",
    color: colors.inkFaint, borderRadius: radii.sm, whiteSpace: "nowrap",
  },
};

export default function MyEntryRow({ entry }) {
  const label = STATUS_LABELS[entry.status] ?? STATUS_LABELS.pending;

  return (
    <li style={styles.row}>
      <Link href={`/browse/${entry.id}`} style={styles.title} className="text-link">
        {entry.title}
      </Link>
      <span style={styles.status}>
        <T en={label.en} km={label.km} />
      </span>
      {entry.status === "returned" && entry.reviewNote ? (
        <p style={styles.note}>
          <T en="Reviewer’s note:" km="កំណត់ចំណាំពីអ្នកត្រួតពិនិត្យ៖" /> {entry.reviewNote}
        </p>
      ) : null}
    </li>
  );
}
