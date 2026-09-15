// The Cambodian flag beside the wordmark, drawn locally rather than set as
// the 🇰🇭 emoji.
//
// The emoji is a font glyph, not an image: Windows ships no flag font and
// renders it as the letters "KH", macOS, Android and each browser draw
// their own, and its size follows whatever font-size it inherits. A mark
// that is part of the identity cannot look like a different thing on every
// machine, so it is an SVG here — no dependency, no network request, and
// it inlines with the header.
//
// Proportions are the flag's own: 3:2, blue and red in quarters and a
// half, with a white Angkor Wat centred in the red band. The temple is cut
// down to the three towers and the two terraces, because at 18px wide any
// finer detail collapses into grey. Colours are literal hex, not theme
// tokens — a flag does not change colour with the page theme.
//
// aria-hidden: the link this sits inside already reads "KHMER LIVING
// ARCHIVE", so naming the flag as well would announce the country twice
// for one link. It is decoration on a labelled control, which is exactly
// the case for an empty accessible name.
export default function KhmerFlag() {
  return (
    <svg
      className="khmer-flag"
      viewBox="0 0 36 24"
      width="18"
      height="12"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="36" height="24" fill="#032ea1" />
      <rect y="6" width="36" height="12" fill="#d01f2e" />
      <g fill="#ffffff">
        <path d="M18 6.9C18.9 9.1 19.7 11.2 20 13.4H16C16.3 11.2 17.1 9.1 18 6.9Z" />
        <path d="M13 9.1C13.75 10.8 14.35 12.1 14.6 13.4H11.4C11.65 12.1 12.25 10.8 13 9.1Z" />
        <path d="M23 9.1C23.75 10.8 24.35 12.1 24.6 13.4H21.4C21.65 12.1 22.25 10.8 23 9.1Z" />
        <rect x="10.2" y="13.4" width="15.6" height="1.6" />
        <rect x="8.6" y="15.6" width="18.8" height="1.4" />
      </g>
    </svg>
  );
}
