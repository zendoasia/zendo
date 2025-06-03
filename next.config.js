/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  deploymentId: process.env.DEPLOYMENT_ID,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self';",
            ].join(" "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/fallback/unsupported",
        destination: "/fallback/unsupported.html",
      },
      {
        source: "/offline",
        destination: "/fallback/offline.html",
      },
    ];
  },
};

module.exports = nextConfig;
