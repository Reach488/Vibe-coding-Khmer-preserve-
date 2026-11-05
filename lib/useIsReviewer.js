"use client";

import { useEffect, useState } from "react";
import getSupabaseClient from "./supabase.js";

// Whether the given signed-in user is on the reviewers list, asked through
// is_reviewer() (supabase/gate.sql). Mirrors useIsAdmin.js. This only decides
// whether the header shows a Review link; /review checks again on the server,
// and review_entry checks again in the database, which is the real lock.
//
// False until proven otherwise, so a failed or slow lookup never shows the
// link to someone who is not a reviewer.
export default function useIsReviewer(user) {
  const [isReviewer, setIsReviewer] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    let active = true;
    setIsReviewer(false);
    if (!userId) return undefined;

    getSupabaseClient()
      .rpc("is_reviewer")
      .then(({ data }) => {
        if (active) setIsReviewer(data === true);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  return isReviewer;
}
