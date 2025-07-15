/**
 * app/not-found.tsx
 * -----------------
 *
 * Implements the not found page as a server component to generate metadata
 * for the app.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import React from "react";
import NotFoundPage from "@/components/main/notFound";
import type { Metadata } from "next";
import lonelyGhost from "@/public/assets/lonelyGhost.svg";
import { generateMetadata } from "@/lib/generateBasicMetadata";

export const metadata: Metadata = generateMetadata({
  title: "Not Found - Zendo",
  description: "Could not find the exact page you were looking for. What about some coffee?",
  extra: {
    robots: {
      index: false,
      follow: false,
    },
  },
});

export default function notFound() {
  return (
    <>
      <head>
        <link
          rel="preload"
          href={lonelyGhost.src}
          as="image"
          type="image/svg+xml"
          fetchPriority="high"
        />
      </head>
      <NotFoundPage />
    </>
  );
}
