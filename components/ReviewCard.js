import Link from "next/link";
import T from "./T.js";
import ReviewActions from "./ReviewActions.js";
import { colors, fonts, space, type } from "../lib/theme.js";

// One pending entry in the review queue: what a reviewer needs to decide,
// then the buttons (ReviewActions). The decision itself is ReviewQueue's job.
const s = {
  card: { padding: `${space.md}px 0`, borderBottom: `1px solid ${colors.borderSoft}` },
  photo: { width: "100%", maxWidth: 320, height: "auto", display: "block", backgroundColor: colors.surfaceMuted },
  title: { fontFamily: fonts.serif, fontSize: type.h2, color: colors.ink, margin: `${space.sm}px 0 0` },
  khmer: { fontFamily: fonts.khmer, color: colors.inkMuted, marginLeft: space.xs },
  meta: { fontFamily: fonts.mono, fontSize: type.meta, color: colors.inkFaint, margin: `${space.xs}px 0 0` },
  text: { fontFamily: fonts.serif, fontSize: type.body, lineHeight: 1.7, color: colors.ink, margin: `${space.sm}px 0 0`, whiteSpace: "pre-line" },
  credit: { fontFamily: fonts.sans, fontSize: type.small, color: colors.inkMuted, margin: `${space.xs}px 0 0` },
};

function submitted(iso) {
  const day = new Date(iso);
  return {
    en: day.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    km: day.toLocaleDateString("km-KH", { day: "numeric", month: "long", year: "numeric" }),
  };
}

export default function ReviewCard({ entry, busy, failed, onDecide }) {
  const date = submitted(entry.submittedAt);

  return (
    <li style={s.card}>
      <img src={entry.photo} alt={entry.title} width={320} height={240} style={s.photo} />
      <h2 style={s.title}>
        {entry.title}
        <span lang="km" style={s.khmer}>{entry.khmerTerm}</span>
      </h2>
      <p style={s.meta}>
        {entry.category} · <T en={`Submitted ${date.en}`} km={`បានដាក់ស្នើ ${date.km}`} />
      </p>
      <p style={s.text}>{entry.description}</p>
      <p style={s.credit}>
        <T en="Source:" km="ប្រភព៖" /> {entry.sourceCredit || <T en="none given" km="មិនបានផ្ដល់" />}
      </p>
      <p style={s.credit}>
        <Link href={`/browse/${entry.id}`} className="text-link">
          <T en="Open the full entry" km="បើកធាតុពេញលេញ" />
        </Link>
      </p>
      <ReviewActions entry={entry} busy={busy} failed={failed} onDecide={onDecide} />
    </li>
  );
}
