"use client";

import { useEffect, useState } from "react";
import getSupabaseClient from "./supabase.js";

// Tracks the signed-in visitor from the one shared Supabase client — mirrors
// useLang.js: resolve once on mount, then follow live changes.
//
// Returns undefined until the first check resolves (so callers can render
// nothing rather than flash the wrong state before the session cookie has
// been read), then either the Supabase user object or null.
export default function useSession() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    try {
      const supabase = getSupabaseClient();

      supabase.auth.getSession().then(({ data }) => {
        if (active) setUser(data.session?.user ?? null);
      });

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) setUser(session?.user ?? null);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch {
      // Supabase not configured: treat the visitor as logged out rather
      // than crash the header.
      if (active) setUser(null);
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return user;
}
