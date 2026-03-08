import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking — disallows <iframe> embedding of this site
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME-type sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Stop sending Referer on cross-origin requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for 1 year (HSTS)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Disable browser features not needed
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
  // Enable XSS auditor in older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Content Security Policy — controls which resources can be loaded
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Google Analytics + Vercel Analytics
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
      // Styles: self + inline (required by Tailwind)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + all configured remote image hostnames
      "img-src 'self' data: blob: https://*.gramedia.com https://*.gramedia.id https://*.siplahgramedia.id https://*.amazonaws.com https://encrypted-tbn0.gstatic.com https://res.cloudinary.com https://www.googletagmanager.com",
      // Connections: self + GA + Vercel
      "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-analytics.com https://va.vercel-scripts.com",
      // Map tiles: OpenStreetMap for Leaflet
      "frame-src 'none'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.gramedia.com' },
      { protocol: 'https', hostname: 'cdn.gramedia.com' },
      { protocol: 'https', hostname: '**.gramedia.com' },
      { protocol: 'https', hostname: '**.gramedia.id' },
      { protocol: 'https', hostname: 'siplahgramedia.id' },
      { protocol: 'https', hostname: '**.siplahgramedia.id' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
