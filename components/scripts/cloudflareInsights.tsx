/**
 * components/scripts/cloudflareInsights.tsx
 * -----------------------------------------
 *
 * Handles Cloudflare Insights. This is used to track user behavior on the site.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import Script from "next/script";

const CLOUD_FLARE_ANALYTICS_ID = process.env.NEXT_PUBLIC_CF_INSIGHTS_ID;

export default function CloudflareAnalytics() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={`{"token": "${CLOUD_FLARE_ANALYTICS_ID}"}`}
      defer
    />
  );
}
