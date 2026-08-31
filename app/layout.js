import "./globals.css";
import collection from "../collection.config.js";
import SiteHeader from "../components/SiteHeader.js";
import { colors, fonts } from "../lib/theme.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: colors.bg,
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
