/**
 * lib/cache/header-cacher.ts
 * --------------------------
 *
 * Caches the header nav links on a server component.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use server";

import { cache } from "react";

export type HeaderNavLink = { label: string; path: string };

export const getHeaderNavLinks = cache(async (): Promise<HeaderNavLink[] | null> => {
  try {
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_ORIGIN}/api/quick-links`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const links = json?.data?.links;

    if (!Array.isArray(links)) return null;

    return links.filter(
      (item): item is HeaderNavLink =>
        typeof item === "object" &&
        item !== null &&
        typeof item.label === "string" &&
        typeof item.path === "string"
    );
  } catch {
    return null;
  }
});
