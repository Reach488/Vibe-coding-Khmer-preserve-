"use client";

import { useEffect, useState } from "react";
import getSupabaseClient from "./supabase.js";

// Whether the given signed-in user is an admin, read from the admins table.
// Row-level security lets a user see only their own row, so a row coming back
// is the whole answer. This only decides which buttons to draw; the entry
// policies in supabase/admin.sql are what actually let an admin write.
//
// False until proven otherwise, so a failed or slow lookup never shows an
// admin control to someone who is not one.
export default function useIsAdmin(user) {
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    let active = true;
    setIsAdmin(false);
    if (!userId) return undefined;

    getSupabaseClient()
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setIsAdmin(Boolean(data));
      });

    return () => {
      active = false;
    };
  }, [userId]);

  return isAdmin;
}
