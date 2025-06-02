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
