"use client";

import { useEffect, useState } from "react";
import { fetchEntry } from "./archive.js";

// One entry by slug, for /browse/[id]. Same three states as useEntries, plus
// a fourth the archive-wide hook does not have: the query succeeded and there
// is no such entry. `entry: null` with `loading: false` and no error is that
// case, and it is the one the page turns into a 404.
export default function useEntry(slug) {
  const [state, setState] = useState({
    entry: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState({ entry: null, loading: true, error: null });

    fetchEntry(slug)
      .then((entry) => {
        if (active) setState({ entry, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ entry: null, loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}
