"use client";

import useEntries from "../../lib/useEntries.js";
import ArchiveNotice from "../../components/ArchiveNotice.js";
import BrowseExplorer from "../../components/BrowseExplorer.js";
import Reveal from "../../components/Reveal.js";
import SiteFooter from "../../components/SiteFooter.js";
import T from "../../components/T.js";
import { colors, fonts, space, maxWidth } from "../../lib/theme.js";

// This page is the search. It used to open with a mono kicker reading "Browse
// the Archive", then the collection name again — the third time a visitor met
// it, after the header brand and the homepage title — then three lines
// explaining what search does, and only then the field itself. All that is
// above the results now is a heading and the field.
//
// The archive it searches comes from Supabase rather than from a file, so the
// field only appears once there is something to search. Showing an empty
// search box over a loading archive would let someone type a query that
// silently matches nothing.
// Same bootstrap the homepage uses: puts the reveal's hidden state on the
// document while it is still parsing, so the footer does not show and then
// hide itself once the page hydrates.
const revealBootstrap =
  "(function(){try{document.documentElement.classList.add('js-reveal')}catch(e){}})();";

const styles = {
  wrap: { maxWidth: maxWidth.page, margin: "0 auto", padding: `${space.lg}px ${space.md}px ${space.xl}px` },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: 600,
    margin: 0,
    color: colors.ink,
    lineHeight: 1.2,
  },
};

export default function BrowsePage() {
  const { entries, loading, error } = useEntries();

  const notice = error
    ? "error"
    : loading
      ? "loading"
      : entries.length === 0
        ? "empty"
        : null;

  return (
    <main style={styles.wrap}>
      <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      <Reveal />

      <h1 style={{ ...styles.title, "--i": 0 }} className="page-enter">
        <T en="The archive" km="បណ្ណសារ" />
      </h1>

      {notice ? (
        <ArchiveNotice state={notice} />
      ) : (
        <BrowseExplorer entries={entries} />
      )}

      <div data-reveal>
        <SiteFooter />
      </div>
    </main>
  );
}
