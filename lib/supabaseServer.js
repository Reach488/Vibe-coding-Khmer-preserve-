// The server-side Supabase client, for server components such as /review.
//
// It reads the same session cookie the browser client (lib/supabase.js)
// writes, so a question asked here is asked as the signed-in visitor, and
// row-level security answers it the same way it would in the browser.
//
// Same two public values as the browser client, from .env.local and Vercel.
// No secret key is used here or anywhere else in the app.
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export default async function getServerSupabase() {
  if (!url || !publishableKey) {
    throw new Error("Supabase is not configured: see lib/supabase.js.");
  }

  const store = await cookies();
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => store.getAll(),
      // A server component may not write cookies; Next.js throws if it tries.
      // That only happens when an expired session is refreshed, and the
      // browser client refreshes and saves it on the next page load anyway.
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Read-only here; see above.
        }
      },
    },
  });
}
