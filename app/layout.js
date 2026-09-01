import { Noto_Serif_Khmer } from "next/font/google";
import "./globals.css";
import collection from "../collection.config.js";
import SiteHeader from "../components/SiteHeader.js";
import { colors, fonts } from "../lib/theme.js";

const notoSerifKhmer = Noto_Serif_Khmer({
  subsets: ["khmer"],
  weight: ["400", "600", "700"],
  variable: "--font-khmer",
  display: "swap",
});

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={notoSerifKhmer.variable}>
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
