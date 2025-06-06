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
