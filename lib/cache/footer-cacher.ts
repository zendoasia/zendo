/**
 * lib/cache/footer-cacher.ts
 * --------------------------
 *
 * Caches the footer links and status uptime on a server
 * component.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use server";

import { cache } from "react";

export const getFooterLinks = cache(async () => {
  const origin = process.env.NEXT_PUBLIC_ORIGIN;
  const protocol = origin?.startsWith("localhost") ? "http" : "https";
  const res = await fetch(`${protocol}://${origin}/api/footer-items`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data.sections;
});

export const getStatusUptime = cache(async () => {
  const origin = process.env.NEXT_PUBLIC_ORIGIN;
  const protocol = origin?.startsWith("localhost") ? "http" : "https";
  const res = await fetch(`${protocol}://${origin}/api/status-uptime`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const { uptime } = await res.json();
  return uptime;
});
