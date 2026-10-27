// Security headers on every route.
//
// frame-ancestors 'none' stops another site loading the archive in a hidden
// frame and tricking a signed-in owner into clicking Edit or Delete. The CSP
// lists only the origins the app really talks to: itself, this project's
// Supabase (data, auth and photos) and hCaptcha (login and signup). An image
// from anywhere else will not load, even if a row ever pointed at one.
//
// 'unsafe-inline' is needed for scripts: the no-flash theme script in
// app/layout.js and the reveal bootstrap are inline and carry no nonce.
// `next dev` also needs 'unsafe-eval'; production does not get it.
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const hcaptcha = "https://hcaptcha.com https://*.hcaptcha.com";
const devEval = process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devEval} ${hcaptcha}`,
  `style-src 'self' 'unsafe-inline' ${hcaptcha}`,
  `img-src 'self' data: ${supabase}`,
  `connect-src 'self' ${supabase} ${hcaptcha}`,
  `frame-src ${hcaptcha}`,
  "font-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
