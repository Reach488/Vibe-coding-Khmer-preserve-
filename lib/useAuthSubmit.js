"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getSupabaseClient from "./supabase.js";

// Shared by login and signup: both need the same captcha-token gate before
// calling Supabase, and the same single-use reset after every attempt.
export default function useAuthSubmit(mode) {
  const router = useRouter();
  const captchaRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [failed, setFailed] = useState(false);
  const [needsCaptcha, setNeedsCaptcha] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFailed(false);
    setNeedsCaptcha(false);

    // Caught here, before busy is even set, so a contributor who forgets the
    // widget gets told why instead of watching the button spin and fail.
    if (!captchaToken) {
      setNeedsCaptcha(true);
      return;
    }

    setBusy(true);
    try {
      const supabase = getSupabaseClient();
      const credentials = { email, password, options: { captchaToken } };
      const { error } =
        mode === "login"
          ? await supabase.auth.signInWithPassword(credentials)
          : await supabase.auth.signUp(credentials);

      // Spent either way — Supabase consumes the token on this call whether
      // it succeeds or fails, so the next attempt needs a fresh one.
      captchaRef.current?.reset();
      setCaptchaToken("");

      if (error) {
        setFailed(true);
        setBusy(false);
        return;
      }

      // refresh() re-runs the server components with the new session cookie
      // in place; push() alone could land on a stale render.
      router.push("/");
      router.refresh();
    } catch {
      captchaRef.current?.reset();
      setCaptchaToken("");
      setFailed(true);
      setBusy(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    setCaptchaToken,
    captchaRef,
    failed,
    needsCaptcha,
    busy,
    handleSubmit,
  };
}
