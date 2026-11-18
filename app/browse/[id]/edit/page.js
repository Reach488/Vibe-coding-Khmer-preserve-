"use client";

import { notFound, useParams } from "next/navigation";
import EntryForm from "../../../../components/EntryForm.js";
import ArchiveNotice from "../../../../components/ArchiveNotice.js";
import SignedInOnly from "../../../../components/SignedInOnly.js";
import SiteFooter from "../../../../components/SiteFooter.js";
import T from "../../../../components/T.js";
import useEntry from "../../../../lib/useEntry.js";
import useSession from "../../../../lib/useSession.js";
import useIsAdmin from "../../../../lib/useIsAdmin.js";
import useIsReviewer from "../../../../lib/useIsReviewer.js";
import { colors, fonts, space, type, maxWidth } from "../../../../lib/theme.js";

// The same form as /contribute, pre-filled. The owner check below only decides
// what to draw; the update policy is what refuses a stranger's save.
const s = {
  wrap: { maxWidth: maxWidth.prose, margin: "0 auto", padding: `${space.xl}px ${space.md}px ${space.xl}px` },
  title: {
    fontFamily: fonts.serif, fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 600,
    margin: 0, color: colors.ink, lineHeight: 1.15, letterSpacing: "-0.02em",
  },
  note: { fontFamily: fonts.serif, fontSize: type.body, lineHeight: 1.7, color: colors.inkMuted, margin: `${space.lg}px 0 0` },
};

// Saving an edit sets the entry back to pending unless the editor is a
// reviewer (lib/archive.js, enforced by supabase/gate.sql). Say so before the
// save, so a published entry leaving the public archive is no surprise.
const RESEND = {
  published: {
    en: "Saving sends this entry back for review. It leaves the public archive until a reviewer approves it again.",
    km: "ការរក្សាទុកនឹងបញ្ជូនធាតុនេះទៅត្រួតពិនិត្យម្ដងទៀត។ វានឹងចេញពីបណ្ណសារសាធារណៈ រហូតដល់អ្នកត្រួតពិនិត្យយល់ព្រមម្ដងទៀត។",
  },
  other: {
    en: "Saving sends this entry to the review queue.",
    km: "ការរក្សាទុកនឹងបញ្ជូនធាតុនេះទៅបញ្ជីរង់ចាំការត្រួតពិនិត្យ។",
  },
};

function Editor({ id }) {
  const user = useSession();
  const isAdmin = useIsAdmin(user);
  const isReviewer = useIsReviewer(user);
  const { entry, loading, error } = useEntry(id);

  if (!loading && !error && !entry) notFound();
  if (!entry) return <ArchiveNotice state={error ? "error" : "loading"} />;
  if (user?.id !== entry.owner && !isAdmin) {
    return (
      <p style={s.note}>
        <T en="Only the person who added this entry can edit it." km="មានតែអ្នកដែលបានបញ្ចូលធាតុនេះទេ ដែលអាចកែសម្រួលវាបាន។" />
      </p>
    );
  }
  const resend = entry.status === "published" ? RESEND.published : RESEND.other;
  return (
    <>
      {isReviewer ? null : (
        <p style={s.note}>
          <T en={resend.en} km={resend.km} />
        </p>
      )}
      <EntryForm key={entry.uuid} entry={entry} />
    </>
  );
}

export default function EditEntry() {
  const { id } = useParams();

  return (
    <main style={s.wrap}>
      <h1 style={s.title}>
        <T en="Edit entry" km="កែសម្រួលធាតុ" />
      </h1>
      <SignedInOnly>
        <Editor id={id} />
      </SignedInOnly>
      <SiteFooter />
    </main>
  );
}
