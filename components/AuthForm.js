"use client";

import AuthField from "./AuthField.js";
import Captcha from "./Captcha.js";
import T from "./T.js";
import authCopy from "../lib/authCopy.js";
import useAuthSubmit from "../lib/useAuthSubmit.js";
import { colors, fonts, radii, space, type, maxWidth } from "../lib/theme.js";

// Both pages render this; only the mode differs. The words — and the reason
// every failure says the same thing — are in lib/authCopy.js. The submit
// flow (captcha gate, Supabase call, token reset) lives in
// lib/useAuthSubmit.js so this file stays about the form itself.
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
  const {
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
  } = useAuthSubmit(mode);

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
        minLength={8}
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
