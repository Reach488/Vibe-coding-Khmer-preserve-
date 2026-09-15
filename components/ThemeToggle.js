"use client";

import { useEffect, useState } from "react";
import { colors, radii } from "../lib/theme.js";

export const THEME_KEY = "kla-theme";

const styles = {
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    padding: 0,
    color: colors.inkMuted,
    backgroundColor: "transparent",
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    cursor: "pointer",
  },
};

// Writes the choice to the document the same way the no-flash script in
// app/layout.js does, so both paths agree on what "applied" means.
function applyTheme(next) {
  document.documentElement.setAttribute("data-theme", next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", next === "dark" ? "#17120E" : "#F7F3EA");
}

export default function ThemeToggle() {
  // Starts null: the server has no idea which theme this visitor resolved to,
  // so the icon is only decided after mount. The button keeps its size either
  // way, so nothing shifts when it fills in.
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "light");

    // Keep following the OS while the visitor has not made an explicit choice.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      let stored = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch (error) {
        stored = null;
      }
      if (stored) return;
      const next = mq.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };

    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (error) {
      // Private browsing or blocked storage: the theme still applies for
      // this page view, it just will not be remembered.
    }
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      style={styles.button}
      className="theme-toggle"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      <span aria-hidden="true" style={{ display: "block", lineHeight: 0 }}>
        {theme === null ? null : isDark ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 9.8A5.8 5.8 0 0 1 6.2 2.5a5.8 5.8 0 1 0 7.3 7.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.1" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M8 1v1.7M8 13.3V15M1 8h1.7M13.3 8H15M3 3l1.2 1.2M11.8 11.8 13 13M13 3l-1.2 1.2M4.2 11.8 3 13" />
      </g>
    </svg>
  );
}
