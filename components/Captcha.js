"use client";

import Script from "next/script";
import { forwardRef, useImperativeHandle, useRef } from "react";
import T from "./T.js";
import { colors, fonts, type } from "../lib/theme.js";

// hCaptcha, own file so AuthForm stays about the form. No npm package: a
// <script> tag and the window.hcaptcha global it leaves behind are enough,
// and @hcaptcha/react-hcaptcha would be a dependency AGENTS.md forbids.
const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

const styles = {
  missing: { fontFamily: fonts.sans, fontSize: type.small, color: colors.brand },
};

// A token is single-use: Supabase spends it on the next auth call whether
// that call succeeds or fails, so AuthForm resets this widget after every
// attempt via the ref rather than once after a success.
const Captcha = forwardRef(function Captcha({ onToken }, ref) {
  const elementRef = useRef(null);
  const widgetId = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetId.current !== null) window.hcaptcha?.reset(widgetId.current);
    },
  }));

  if (!siteKey) {
    return (
      <p style={styles.missing}>
        <T
          en="Captcha is not configured (NEXT_PUBLIC_HCAPTCHA_SITE_KEY)."
          km="មិនទាន់កំណត់ Captcha (NEXT_PUBLIC_HCAPTCHA_SITE_KEY)។"
        />
      </p>
    );
  }

  const render = () => {
    if (widgetId.current !== null || !elementRef.current || !window.hcaptcha) return;
    widgetId.current = window.hcaptcha.render(elementRef.current, {
      sitekey: siteKey,
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
  };

  return (
    <>
      <Script src="https://js.hcaptcha.com/1/api.js" strategy="afterInteractive" onReady={render} />
      <div ref={elementRef} />
    </>
  );
});

export default Captcha;
