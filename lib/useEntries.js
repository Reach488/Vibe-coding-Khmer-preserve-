"use client";

import { useEffect, useState } from "react";
import { fetchEntries } from "./archive.js";

// The archive, as a hook. Mirrors useSession.js: resolve once on mount, drop
// the result if the component unmounted first.
//
// Three states, and every caller has to handle all three. Sprint 1 could
// assume the collection was simply there, because it was a file the bundler
// had already inlined. A network is not a file: it can be slow, it can fail,
// and a free Supabase project can be asleep when the first visitor of the week
// arrives. `entries` is always an array so nothing downstream has to guard
// before mapping over it.
export default function useEntries() {
  const [state, setState] = useState({
    entries: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    fetchEntries()
      .then((entries) => {
        if (active) setState({ entries, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ entries: [], loading: false, error });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
