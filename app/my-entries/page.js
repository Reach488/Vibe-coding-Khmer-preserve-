"use client";

import useSession from "../../lib/useSession.js";
import useMyEntries from "../../lib/useMyEntries.js";
import SignedInOnly from "../../components/SignedInOnly.js";
import MyEntryRow from "../../components/MyEntryRow.js";
import SiteFooter from "../../components/SiteFooter.js";
import T from "../../components/T.js";
import { colors, fonts, space, type, maxWidth } from "../../lib/theme.js";

// A contributor's own entries, at any status. Lab 10's gate means a new or
// edited entry no longer lands on the public archive right away; this is
// where its owner can see it while it waits.
const s = {
  wrap: { maxWidth: maxWidth.prose, margin: "0 auto", padding: `${space.xl}px ${space.md}px ${space.xl}px` },
  title: { fontFamily: fonts.serif, fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 600, margin: 0, color: colors.ink, lineHeight: 1.15 },
  empty: { fontFamily: fonts.serif, fontSize: type.body, lineHeight: 1.7, color: colors.inkFaint, margin: `${space.lg}px 0` },
  list: { listStyle: "none", margin: `${space.lg}px 0 0`, padding: 0 },
};

function EntryList({ userId }) {
  const { entries, loading, error } = useMyEntries(userId);

  if (loading) {
    return (
      <p style={s.empty} role="status">
        <T en="Loading your entries…" km="កំពុងផ្ទុកធាតុរបស់អ្នក…" />
      </p>
    );
  }
  if (error) {
    return (
      <p style={s.empty} role="status">
        <T en="Your entries could not be reached. Try again in a moment." km="មិនអាចទាក់ទងធាតុរបស់អ្នកបានទេ។ សូមសាកល្បងម្ដងទៀតបន្តិចក្រោយ។" />
      </p>
    );
  }
  if (entries.length === 0) {
    return (
      <p style={s.empty}>
        <T en="You haven’t added anything yet." km="អ្នកមិនទាន់បានបញ្ចូលអ្វីនៅឡើយទេ។" />
      </p>
    );
  }
  return (
    <ul style={s.list}>
      {entries.map((entry) => (
        <MyEntryRow key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

export default function MyEntries() {
  const user = useSession();

  return (
    <main style={s.wrap}>
      <h1 style={s.title}>
        <T en="My entries" km="ធាតុរបស់ខ្ញុំ" />
      </h1>
      <SignedInOnly>{user ? <EntryList userId={user.id} /> : null}</SignedInOnly>
      <SiteFooter />
    </main>
  );
}
