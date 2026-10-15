"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AuthField from "./AuthField.js";
import Captcha from "./Captcha.js";
import T from "./T.js";
import getSupabaseClient from "../lib/supabase.js";
import authCopy from "../lib/authCopy.js";
import { colors, fonts, radii, space, type, maxWidth } from "../lib/theme.js";

// Both pages render this; only the mode differs. The words — and the reason
// every failure says the same thing — are in lib/authCopy.js.
const captchaCopy = {
  en: "Please complete the verification above.",
  km: "សូមបញ្ចប់ការផ្ទៀងផ្ទាត់ខាងលើ។",
};

const styles = {
  form: { maxWidth: maxWidth.field, marginTop: space.lg },
  // A rule in lac red, not a tinted panel. The archive states things; it does
  // not put them in coloured boxes.
  error: {
    fontFamily: fonts.sans,
    fontSize: type.small,
    lineHeight: 1.5,
    color: colors.brand,
    borderLeft: `2px solid ${colors.brand}`,
    padding: `${space.xs}px 0 ${space.xs}px ${space.sm}px`,
    margin: `0 0 ${space.md}px`,
  },
  captcha: { margin: `${space.sm}px 0 ${space.md}px` },
  submit: {
    width: "100%",
    padding: "13px 22px",
    fontFamily: fonts.sans,
    fontSize: type.small,
    fontWeight: 600,
    color: colors.onBrand,
    backgroundColor: colors.brand,
    border: `1px solid ${colors.brand}`,
    borderRadius: radii.sm,
    cursor: "pointer",
  },
};

export default function AuthForm({ mode }) {
  const t = authCopy[mode];
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

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {failed ? (
        <p style={styles.error} role="alert">
          <T en={t.error.en} km={t.error.km} />
        </p>
      ) : null}
      {needsCaptcha ? (
        <p style={styles.error} role="alert">
          <T en={captchaCopy.en} km={captchaCopy.km} />
        </p>
      ) : null}

      <AuthField
        id="email"
        inputType="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        labelEn="Email"
        labelKm="អ៊ីមែល"
      />

      <AuthField
        id="password"
        inputType="password"
        autoComplete={t.autoComplete}
        value={password}
        onChange={setPassword}
        labelEn="Password"
        labelKm="ពាក្យសម្ងាត់"
        minLength={6}
      />

      <div style={styles.captcha}>
        <Captcha ref={captchaRef} onToken={setCaptchaToken} />
      </div>

      <button
        type="submit"
        style={styles.submit}
        className="btn-primary"
        disabled={busy}
      >
        <T
          en={busy ? t.busy.en : t.submit.en}
          km={busy ? t.busy.km : t.submit.km}
        />
      </button>
    </form>
  );
}
