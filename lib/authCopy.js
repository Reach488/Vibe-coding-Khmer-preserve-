// The two auth forms differ only in their words, so the words live here and
// the component stays one shape.
//
// Every failure path in AuthForm prints the message below and nothing else.
// The login message says "Invalid email or password" whether the address has
// an account or not, so a stranger cannot use the form to learn which
// addresses are registered. Signup is vague for the same reason: Supabase
// answers "User already registered" to a duplicate, and repeating that would
// confirm the address. The underlying error is never logged either — a
// console is still somewhere a message can be read.
const authCopy = {
  login: {
    autoComplete: "current-password",
    submit: { en: "Log in", km: "ចូលគណនី" },
    busy: { en: "Logging in…", km: "កំពុងចូល…" },
    error: {
      en: "Invalid email or password",
      km: "អ៊ីមែល ឬពាក្យសម្ងាត់ មិនត្រឹមត្រូវ",
    },
  },
  signup: {
    autoComplete: "new-password",
    submit: { en: "Create account", km: "បង្កើតគណនី" },
    busy: { en: "Creating account…", km: "កំពុងបង្កើតគណនី…" },
    error: {
      en: "Could not create an account with those details",
      km: "មិនអាចបង្កើតគណនីដោយព័ត៌មាននេះបានទេ",
    },
  },
};

export default authCopy;
