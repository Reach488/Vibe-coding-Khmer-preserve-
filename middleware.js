// Refreshes the Supabase session before /review renders on the server.
//
// A server component can read cookies but not write them. If the login had
// expired, app/review/page.js would refresh it and then be unable to save the
// new token; the browser would later reuse the old one, and Supabase treats
// a reused refresh token as stolen and signs the person out. Here, before
// the page runs, the refreshed cookies can be written to both the request
// (so the page sees them) and the response (so the browser keeps them).
//
// Limited to /review: it is the only page that asks Supabase anything on
// the server. Every other page does that in the browser.
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  let response = NextResponse.next({ request });
  if (!url || !publishableKey) return response;

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() checks the token with Supabase and refreshes it if needed.
  await supabase.auth.getUser();
  return response;
}

export const config = { matcher: ["/review"] };
