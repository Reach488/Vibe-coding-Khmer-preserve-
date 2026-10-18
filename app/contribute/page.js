import EntryForm from "../../components/EntryForm.js";
import SignedInOnly from "../../components/SignedInOnly.js";
import SiteFooter from "../../components/SiteFooter.js";
import T from "../../components/T.js";
import { colors, fonts, space, type, maxWidth } from "../../lib/theme.js";

export const metadata = {
  title: "Add an entry — Khmer Living Archive",
};

// Server component; only the gate and the form are client code, the same split
// as /login. The form itself is hidden from signed-out visitors by SignedInOnly.
const s = {
  wrap: { maxWidth: maxWidth.prose, margin: "0 auto", padding: `${space.xl}px ${space.md}px ${space.xl}px` },
  title: {
    fontFamily: fonts.serif, fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 600,
    margin: 0, color: colors.ink, lineHeight: 1.15, letterSpacing: "-0.02em",
  },
  lede: { fontFamily: fonts.serif, fontSize: type.body, lineHeight: 1.7, color: colors.inkMuted, margin: `${space.md}px 0 0` },
};

export default function Contribute() {
  return (
    <main style={s.wrap}>
      <h1 style={s.title}>
        <T en="Add an entry" km="បញ្ចូលធាតុថ្មី" />
      </h1>
      <p style={s.lede}>
        <T
          en="Write about a Khmer paste or preserve you know first-hand, in your own words, and say where the knowledge came from."
          km="សរសេរអំពីជ្រក់ ឬអាហារសម្ងួតខ្មែរដែលអ្នកស្គាល់ដោយផ្ទាល់ ជាពាក្យរបស់អ្នកផ្ទាល់ ហើយប្រាប់ថាចំណេះដឹងនេះមកពីណា។"
        />
      </p>
      <SignedInOnly>
        <EntryForm />
      </SignedInOnly>
      <SiteFooter />
    </main>
  );
}
