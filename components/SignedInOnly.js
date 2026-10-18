"use client";

import Link from "next/link";
import useSession from "../lib/useSession.js";
import T from "./T.js";
import { colors, fonts, space, type } from "../lib/theme.js";

// Shows its children to a signed-in visitor and a login link to everyone else.
// This is manners: the form is hidden, but the insert policy is what actually
// refuses a signed-out request.
const styles = {
  note: { fontFamily: fonts.serif, fontSize: type.body, lineHeight: 1.7, color: colors.inkMuted, margin: `${space.lg}px 0 0` },
  link: { color: colors.brand, fontWeight: 600 },
};

export default function SignedInOnly({ children }) {
  const user = useSession();

  if (user === undefined) return null;
  if (user === null) {
    return (
      <p style={styles.note}>
        <T en="Adding and editing entries needs an account." km="ការបញ្ចូល និងកែសម្រួលធាតុ ត្រូវការគណនី។" />
        {" "}
        <Link href="/login" style={styles.link} className="text-link">
          <T en="Log in" km="ចូលគណនី" />
        </Link>
        {" "}
        <T en="or" km="ឬ" />
        {" "}
        <Link href="/signup" style={styles.link} className="text-link">
          <T en="create one" km="បង្កើតគណនី" />
        </Link>
        .
      </p>
    );
  }
  return children;
}
