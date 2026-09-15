"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LANG, LANG_EVENT, isLang } from "./lang.js";

// For client components that need a language-dependent *attribute* —
// placeholder, aria-label, title — which CSS cannot swap the way <T> does.
//
// Returns the server default on the first render so markup matches, then
// settles to the real value after mount.
export default function useLang() {
  const [lang, setLang] = useState(DEFAULT_LANG);

  useEffect(() => {
    const read = () => {
      const next = document.documentElement.getAttribute("data-lang");
      setLang(isLang(next) ? next : DEFAULT_LANG);
    };

    read();
    window.addEventListener(LANG_EVENT, read);
    return () => window.removeEventListener(LANG_EVENT, read);
  }, []);

  return lang;
}
