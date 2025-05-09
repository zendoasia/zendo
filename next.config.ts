import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  deploymentId: process.env.DEPLOYMENT_ID,
  devIndicators: false,
};

export default nextConfig;
