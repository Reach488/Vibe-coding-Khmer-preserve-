"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthField from "./AuthField.js";
import T from "./T.js";
import getSupabaseClient from "../lib/supabase.js";
import authCopy from "../lib/authCopy.js";
import { colors, fonts, radii, space, type, maxWidth } from "../lib/theme.js";

// Both pages render this; only the mode differs. The words — and the reason
// every failure says the same thing — are in lib/authCopy.js.
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFailed(false);
    setBusy(true);

    try {
      const supabase = getSupabaseClient();
      const credentials = { email, password };
      const { error } =
        mode === "login"
          ? await supabase.auth.signInWithPassword(credentials)
          : await supabase.auth.signUp(credentials);

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
