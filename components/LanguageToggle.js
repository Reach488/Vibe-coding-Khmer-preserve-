"use client";

import { useEffect, useState } from "react";
import { colors, fonts, lineHeights, radii } from "../lib/theme.js";
import { DEFAULT_LANG, LANG_EVENT, LANG_KEY, isLang } from "../lib/lang.js";

// A segmented control in the flag's own order: deep Cambodian blue on the
// outside — the frame and the divider between the two halves — and
// Cambodian red filling whichever segment is current. The colours are the
// accent, never the message. The chosen language is also filled and set
// heavier than the other one, so the selection still reads on a greyscale
// screen and to a reader who cannot separate the red from the blue.
//
// Anything a stylesheet rule has to override is declared in
// app/globals.css, not here. An inline style beats a rule, so a property
// set in this file is fixed — it cannot vary by viewport and it cannot vary
// by state. That covers the segment widths and padding, which a media query
// narrows on a phone, and the background, which the active segment fills:
// `background-color: transparent` set inline here silently won over the
// aria-pressed fill, leaving cream text on the cream surface in the light
// theme and no visible selection at all.
const styles = {
  group: {
    display: "inline-flex",
    alignItems: "stretch",
    height: 34,
    border: `1px solid ${colors.flagBlue}`,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  option: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 0.5,
    border: "none",
    cursor: "pointer",
  },
};

// Khmer is not Latin at a different size: ខ្មែរ stacks a subscript under
// the base consonant, so it needs its own face, a larger size, a looser
// line box and more room either side than "EN" does. The divider is drawn
// on this half because the shared `option` style sets border: none.
const khmerOption = {
  ...styles.option,
  fontFamily: fonts.khmer,
  fontSize: 14,
  letterSpacing: 0,
  lineHeight: lineHeights.khmer,
  borderLeft: `1px solid ${colors.flagBlue}`,
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

  // Weight is set here rather than in the stylesheet because the rest of
  // each button's type is inline, and an inline font-size beside a
  // stylesheet font-weight is the kind of split that goes wrong later.
  const weight = (value) => (lang === value ? 700 : 500);

  return (
    <div style={styles.group} className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => choose("en")}
        style={{ ...styles.option, fontWeight: weight("en") }}
        className="lang-option"
        aria-pressed={lang === "en"}
        lang="en"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => choose("km")}
        style={{ ...khmerOption, fontWeight: weight("km") }}
        className="lang-option lang-option-km"
        aria-pressed={lang === "km"}
        lang="km"
      >
        ខ្មែរ
      </button>
    </div>
  );
}
