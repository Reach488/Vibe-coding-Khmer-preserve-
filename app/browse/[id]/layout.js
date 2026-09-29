// Why this file exists: clicking a card used to freeze for up to a second and a
// half before anything happened.
//
// The entry page is a client component that fetches its own entry, so the
// server has nothing entry-specific to render. But a [id] route with no
// generateStaticParams is dynamic by default, so every click waited on a
// Vercel function to render an empty shell, and Link could not prefetch it.
//
// force-static renders that shell once per slug and serves it from cache.
// Link can then prefetch it while the card is on screen, and a click only
// waits on the Supabase query. The page itself cannot say this: segment config
// is ignored in a "use client" file, so it lives in this server layout.
export const dynamic = "force-static";

export default function EntryLayout({ children }) {
  return children;
}
