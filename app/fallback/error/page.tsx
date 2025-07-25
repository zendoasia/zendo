/**
 * app/fallback/error/page.tsx
 * ----------------------------
 *
 * Implements the fallback error page for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import React from "react";
import ErrorPage from "@/components/pages/fallback.error";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Error | Zendo",
  description: "An error occurred. Please see details below.",
};

function sanitizeError(err: string | null): string | null {
  if (!err) return null;
  // Limit length and remove newlines/control chars
  let safe = err.slice(0, 256).replace(/[\r\n\0\x08\x09\x1b]/g, " ");
  // Strip HTML tags (repeatedly apply until no matches remain)
  let previous;
  do {
    previous = safe;
    safe = safe.replace(/<[^>]*>/g, "");
  } while (safe !== previous);
  // Only allow printable ASCII
  safe = safe.replace(/[^\x20-\x7E]/g, "");
  return safe.trim() || null;
}

export default async function ErrorPageWrapper() {
  let error: string | null = null;
  try {
    // headers() may return a Promise in edge runtime, so await it
    const h = await headers();
    const errHeader = h.get("x-zendo-error");
    if (errHeader) {
      error = sanitizeError(decodeURIComponent(errHeader));
    }
  } catch {}
  return <ErrorPage error={error} />;
}
