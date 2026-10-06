"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSession from "../lib/useSession.js";
import useIsAdmin from "../lib/useIsAdmin.js";
import { deleteEntry } from "../lib/archive.js";
import { colors, fonts, radii, space, type } from "../lib/theme.js";

// Edit and Delete, for the entry's owner and for admins. Hiding them is
// manners; the delete policy is the lock, and deleteEntry fails if it changed
// no row.
const button = {
  padding: "6px 12px", fontFamily: fonts.sans, fontSize: type.small, color: colors.ink,
  backgroundColor: "transparent", border: `1px solid ${colors.border}`, borderRadius: radii.sm,
  cursor: "pointer", textDecoration: "none",
};
const styles = {
  row: { display: "flex", alignItems: "center", gap: space.xs, flexWrap: "wrap", margin: `${space.sm}px 0 0` },
  failed: { fontFamily: fonts.sans, fontSize: type.small, color: colors.brand },
};

export default function OwnerActions({ entry }) {
  const user = useSession();
  const router = useRouter();
  const isAdmin = useIsAdmin(user);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!user || (user.id !== entry.owner && !isAdmin)) return null;

  const handleDelete = async () => {
    if (!window.confirm(`Delete “${entry.title}”? This cannot be undone.`)) return;
    setFailed(false);
    setBusy(true);
    try {
      await deleteEntry(entry.uuid);
      router.push("/browse");
    } catch (error) {
      console.error(error);
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <div style={styles.row}>
      <Link href={`/browse/${entry.id}/edit`} style={button} className="nav-link">Edit</Link>
      <button type="button" onClick={handleDelete} disabled={busy} style={button}>
        {busy ? "Deleting…" : "Delete"}
      </button>
      {failed ? <span style={styles.failed} role="alert">That change wasn’t saved.</span> : null}
    </div>
  );
}
