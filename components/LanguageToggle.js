"use client";

import { useEffect, useState } from "react";
import { colors, fonts, radii } from "../lib/theme.js";
import { DEFAULT_LANG, LANG_EVENT, LANG_KEY, isLang } from "../lib/lang.js";

const styles = {
  group: {
    display: "inline-flex",
    alignItems: "stretch",
    height: 34,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  option: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0 9px",
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },
};

// Writes the choice the same way the no-flash script in app/layout.js does,
// so both paths agree. lang on <html> matters for screen readers and for the
// browser picking Khmer line-breaking rules, so it moves with data-lang.
function applyLang(next) {
  document.documentElement.setAttribute("data-lang", next);
  document.documentElement.lang = next;
  window.dispatchEvent(new Event(LANG_EVENT));
}

export default function LanguageToggle() {
  const [lang, setLang] = useState(DEFAULT_LANG);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-lang");
    setLang(isLang(current) ? current : DEFAULT_LANG);
  }, []);

  const choose = (next) => {
    if (next === lang) return;
    applyLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch (error) {
      // Blocked storage costs persistence, not the switch itself.
    }
    setLang(next);
  };

  return (
    <div style={styles.group} className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => choose("en")}
        style={styles.option}
        className="lang-option"
        aria-pressed={lang === "en"}
        lang="en"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => choose("km")}
        style={{ ...styles.option, fontFamily: fonts.khmer, fontSize: 13 }}
        className="lang-option"
        aria-pressed={lang === "km"}
        lang="km"
      >
        ខ្មែរ
      </button>
    </div>
  );
}
