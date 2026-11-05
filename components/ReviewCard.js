import Link from "next/link";
import T from "./T.js";
import { colors, fonts, radii, space, type } from "../lib/theme.js";

// One pending entry in the review queue: what a reviewer needs to decide,
// then Publish and Return. The decision itself is ReviewQueue's job.
const button = {
  padding: "10px 20px", fontFamily: fonts.sans, fontSize: type.small, fontWeight: 600,
  border: `1px solid ${colors.brand}`, borderRadius: radii.sm, cursor: "pointer",
};
const s = {
  card: { padding: `${space.md}px 0`, borderBottom: `1px solid ${colors.borderSoft}` },
  photo: { width: "100%", maxWidth: 320, height: "auto", display: "block", backgroundColor: colors.surfaceMuted },
  title: { fontFamily: fonts.serif, fontSize: type.h2, color: colors.ink, margin: `${space.sm}px 0 0` },
  khmer: { fontFamily: fonts.khmer, color: colors.inkMuted, marginLeft: space.xs },
  meta: { fontFamily: fonts.mono, fontSize: type.meta, color: colors.inkFaint, margin: `${space.xs}px 0 0` },
  text: { fontFamily: fonts.serif, fontSize: type.body, lineHeight: 1.7, color: colors.ink, margin: `${space.sm}px 0 0`, whiteSpace: "pre-line" },
  credit: { fontFamily: fonts.sans, fontSize: type.small, color: colors.inkMuted, margin: `${space.xs}px 0 0` },
  actions: { display: "flex", gap: space.xs, flexWrap: "wrap", marginTop: space.sm },
  publish: { ...button, color: colors.onBrand, backgroundColor: colors.brand },
  ret: { ...button, color: colors.brand, backgroundColor: "transparent" },
  failed: { fontFamily: fonts.sans, fontSize: type.small, color: colors.brand, margin: `${space.xs}px 0 0` },
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
      <div style={s.actions}>
        <button type="button" style={s.publish} className="btn-primary" disabled={busy} onClick={() => onDecide(entry, "published")}>
          <T en="Publish" km="ផ្សាយ" />
        </button>
        <button type="button" style={s.ret} className="signout-button" disabled={busy} onClick={() => onDecide(entry, "returned")}>
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
    </li>
  );
}
