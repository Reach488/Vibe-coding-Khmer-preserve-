"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import T from "./T.js";

// The entry page's way out. A card on the homepage links with ?from=home, so
// a reader who came from the homepage is sent back there; everyone else —
// arriving from /browse, or from a shared link — goes to the archive.
//
// useSearchParams makes this part of the page wait for the browser, because
// a statically built page has no query string at build time. The entry page
// wraps it in Suspense and holds its space until then.
export default function BackLink({ style }) {
  const fromHome = useSearchParams().get("from") === "home";

  return fromHome ? (
    <Link href="/" style={style} className="text-link">
      <T en="← Back to home" km="← ត្រឡប់ទៅទំព័រដើម" />
    </Link>
  ) : (
    <Link href="/browse" style={style} className="text-link">
      <T en="← Back to the archive" km="← ត្រឡប់ទៅបណ្ណសារ" />
    </Link>
  );
}
