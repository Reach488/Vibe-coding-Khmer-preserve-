"use client";

import { useEffect, useState } from "react";
import { fetchOwnEntries } from "./archive.js";

// The signed-in visitor's own entries, every status. Mirrors useEntries.js;
// the difference is what it asks for and that it needs a user id to ask.
export default function useMyEntries(userId) {
  const [state, setState] = useState({ entries: [], loading: true, error: null });

  useEffect(() => {
    let active = true;
    if (!userId) {
      setState({ entries: [], loading: false, error: null });
      return undefined;
    }

    setState((s) => ({ ...s, loading: true }));
    fetchOwnEntries(userId)
      .then((entries) => {
        if (active) setState({ entries, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ entries: [], loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [userId]);

  return state;
}
