import T from "./T.js";
import { colors, fonts, space, type, maxWidth } from "../lib/theme.js";

// What stands in for the collection when there is no collection to show.
//
// Three states, one line each. No skeleton cards and no spinner: the site has
// neither anywhere else, and a grid of pulsing grey boxes would be a louder
// change to an editorial archive than a sentence that says what is happening.
//
// The lines are deliberately quiet — inkFaint, reading measure, the same
// register as the search count above them.
const MESSAGES = {
  loading: {
    en: "Loading the archive…",
    km: "កំពុងផ្ទុកបណ្ណសារ…",
  },
  empty: {
    en: "The archive has no entries yet.",
    km: "បណ្ណសារមិនទាន់មានធាតុនៅឡើយទេ។",
  },
  error: {
    en: "The archive could not be reached. Refresh the page, or try again in a moment.",
    km: "មិនអាចទាក់ទងបណ្ណសារបានទេ។ សូមផ្ទុកទំព័រឡើងវិញ ឬសាកល្បងម្ដងទៀតបន្តិចក្រោយ។",
  },
};

const style = {
  fontFamily: fonts.serif,
  fontSize: type.body,
  lineHeight: 1.7,
  color: colors.inkFaint,
  margin: `${space.md}px 0`,
  maxWidth: maxWidth.prose,
};

export default function ArchiveNotice({ state }) {
  const message = MESSAGES[state];
  if (!message) return null;

  // aria-live so a screen reader is told the archive arrived, rather than
  // being left on a page that silently changed underneath it.
  return (
    <p style={style} role="status" aria-live="polite">
      <T en={message.en} km={message.km} />
    </p>
  );
}
