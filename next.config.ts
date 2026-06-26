import type { NextConfig } from "next";

// Content-Security-Policy for the marketing site (not applied to /studio — see below).
// next/font self-hosts fonts at build time, so no Google Fonts domains needed at runtime.
// All Sanity images are proxied through /_next/image (same-origin), so cdn.sanity.io is
// included in img-src only as a safety net for any direct references.
const MARKETING_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // Next.js hydration requires both
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

// Applied to every route — safe for Studio too.
const BASE_HEADERS = [
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  // HSTS — Vercel enforces HTTPS, so this is safe to set here too.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const CSP_HEADER = { key: 'Content-Security-Policy', value: MARKETING_CSP }

// Marketing routes that get CSP. Studio is intentionally excluded — it's a complex SPA
// with its own script/worker requirements that conflict with a strict CSP.
const MARKETING_ROUTES = [
  '/',
  '/services',
  '/services/(.*)',
  '/service/(.*)',
  '/portfolio',
  '/portfolio/(.*)',
  '/about',
  '/career',
  '/career/(.*)',
  '/contact',
  '/sitemap.xml',
  '/robots.txt',
  '/opengraph-image',
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      // Base security headers on all routes (including Studio)
      {
        source: '/(.*)',
        headers: BASE_HEADERS,
      },
      // CSP only on marketing routes (Studio excluded)
      ...MARKETING_ROUTES.map((source) => ({ source, headers: [CSP_HEADER] })),
    ]
  },
};

export default nextConfig;
