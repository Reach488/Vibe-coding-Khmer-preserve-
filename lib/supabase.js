// The browser-side Supabase client.
//
// createBrowserClient comes from @supabase/ssr rather than supabase-js
// directly because it stores the session in cookies instead of localStorage.
// Nothing reads that on the server yet, but a session in a cookie is the one
// a server component could read later; a session in localStorage never is.
//
// Both values are NEXT_PUBLIC_ on purpose: they are compiled into the browser
// bundle and are meant to be public. The anon key is not a secret — it only
// ever grants what row-level security allows. The keys themselves live in
// .env.local and in the Vercel environment variables, never in this file.
import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// One client per browser tab. Calling createBrowserClient on every render
// would hand out a new auth listener each time.
let client = null;

export default function getSupabaseClient() {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and in Vercel."
    );
  }

  if (!client) client = createBrowserClient(url, anonKey);
  return client;
}
