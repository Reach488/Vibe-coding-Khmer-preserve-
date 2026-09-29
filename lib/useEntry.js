"use client";

import { useEffect, useState } from "react";
import { cachedEntry, fetchEntry } from "./archive.js";

// One entry by slug, for /browse/[id]. Same three states as useEntries, plus
// a fourth the archive-wide hook does not have: the query succeeded and there
// is no such entry. `entry: null` with `loading: false` and no error is that
// case, and it is the one the page turns into a 404.
//
// If the browse page already read this entry, start from that copy so the
// page and its photo appear on the click, then re-read in the background in
// case it changed. A failed re-read keeps the copy on screen rather than
// swapping a good page for an error.
function fromCache(slug) {
  const entry = cachedEntry(slug);
  return entry
    ? { entry, loading: false, error: null }
    : { entry: null, loading: true, error: null };
}

export default function useEntry(slug) {
  const [state, setState] = useState(() => fromCache(slug));

  useEffect(() => {
    let active = true;
    const cached = cachedEntry(slug);
    setState(fromCache(slug));

    fetchEntry(slug)
      .then((entry) => {
        if (active) setState({ entry, loading: false, error: null });
      })
      .catch((error) => {
        if (active && !cached) setState({ entry: null, loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}
