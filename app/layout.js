import { Fraunces, Kantumruy_Pro, Courier_Prime } from "next/font/google";
import "./globals.css";
import collection from "../collection.config.js";
import SiteHeader from "../components/SiteHeader.js";
import { colors, fonts } from "../lib/theme.js";

// Three faces, one job each.
//
// Fraunces — warm old-style serif with organic curves that sit naturally
// beside Khmer's loops. Optical sizing (opsz) means the same family handles
// a 44px entry title and 17px body copy correctly.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--font-serif",
  display: "swap",
});

// Kantumruy Pro — Khmer face by Sovichet Tep, the one Cambodian Living Arts
// uses. Its Latin set derives from Work Sans, so loading the khmer *and*
// latin subsets lets one family set both scripts at matching weight.
const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  variable: "--font-sans",
  display: "swap",
});

// Courier Prime — a properly drawn typewriter mono for kickers and labels,
// replacing the 'Courier New' system fallback.
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

// Runs before the browser paints anything, so a visitor on the dark theme
// never sees a flash of the cream page first. It resolves the stored choice,
// falling back to the OS preference, and writes the attribute the token
// blocks in globals.css key off. Because this always sets a concrete value,
// each palette only has to be written once in CSS.
const noFlashTheme = `(function(){try{var s=localStorage.getItem('kla-theme');var t=(s==='dark'||s==='light')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // The script above sets data-theme before React hydrates, so the server
      // markup and the live document differ by design.
      suppressHydrationWarning
      className={`${fraunces.variable} ${kantumruyPro.variable} ${courierPrime.variable}`}
    >
      <head>
        <meta name="theme-color" content="#F7F3EA" />
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </head>
      <body
        style={{
          margin: 0,
          color: colors.ink,
          fontFamily: fonts.sans,
          minHeight: "100vh",
        }}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
