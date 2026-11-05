import getServerSupabase from "../../lib/supabaseServer.js";
import ReviewQueue from "../../components/ReviewQueue.js";
import SiteFooter from "../../components/SiteFooter.js";
import T from "../../components/T.js";
import { colors, fonts, space, type, maxWidth } from "../../lib/theme.js";

// The review queue. The reviewer check runs here, on the server, before any
// entry is loaded: someone who isn't a reviewer gets one sentence and nothing
// else. That check is politeness. The lock is in the database: review_entry
// refuses anyone not on the reviewers list, whatever this page shows.
const s = {
  wrap: { maxWidth: maxWidth.prose, margin: "0 auto", padding: `${space.xl}px ${space.md}px ${space.xl}px` },
  title: { fontFamily: fonts.serif, fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 600, margin: 0, color: colors.ink, lineHeight: 1.15 },
  note: { fontFamily: fonts.serif, fontSize: type.body, lineHeight: 1.7, color: colors.inkFaint, margin: `${space.lg}px 0` },
};

// Anything but a plain true (an error, no session, Supabase not configured)
// means "not a reviewer".
async function checkReviewer() {
  try {
    const supabase = await getServerSupabase();
    const { data } = await supabase.rpc("is_reviewer");
    return data === true;
  } catch {
    return false;
  }
}

export default async function Review() {
  const reviewer = await checkReviewer();

  return (
    <main style={s.wrap}>
      <h1 style={s.title}>
        <T en="Review queue" km="បញ្ជីរង់ចាំការត្រួតពិនិត្យ" />
      </h1>
      {reviewer ? (
        <ReviewQueue />
      ) : (
        <p style={s.note}>
          <T en="This page is for the archive’s reviewers." km="ទំព័រនេះសម្រាប់តែអ្នកត្រួតពិនិត្យបណ្ណសារប៉ុណ្ណោះ។" />
        </p>
      )}
      <SiteFooter />
    </main>
  );
}
