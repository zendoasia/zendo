import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  deploymentId: process.env.DEPLOYMENT_ID,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx", "json"],
  trailingSlash: false,
  redirects: async () => {
    return [
      {
        source: "/manifest.json",
        destination: "/manifest.webmanifest",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
