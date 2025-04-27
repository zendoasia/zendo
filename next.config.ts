import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
	deploymentId: process.env.DEPLOYMENT_ID,
	pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx', 'json'],
	trailingSlash: false,
};

export default nextConfig;
