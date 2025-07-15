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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://uptime.betterstack.com https://status.zendo.asia https://backend.zendo.asia https://cdn.zendo.asia https://www.googletagmanager.com https://cloudflareinsights.com https://www.google-analytics.com https://firebase.googleapis.com https://www.gstatic.com/ https://fonts.gstatic.com/ https://fonts.googleapis.com https://www.googleapis.com https://static.cloudflareinsights.com;",
              "frame-src 'self' 'unsafe-inline' 'unsafe-eval' https://uptime.betterstack.com https://status.zendo.asia;",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self';",
            ].join(" "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
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
    ];
  },
};

module.exports = nextConfig;
