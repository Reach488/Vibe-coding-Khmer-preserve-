import "./globals.css";
import collection from "../collection.config.js";
import SiteHeader from "../components/SiteHeader.js";

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
          backgroundColor: "#FBF5EC",
          color: "#2A1F17",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Khmer', sans-serif",
          minHeight: "100vh",
        }}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
