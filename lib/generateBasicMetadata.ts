/**
 * lib/generateBasicMetadata.ts
 * ----------------------------
 *
 * Implements the basic metadata for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import { BasicMetadata } from "@/types";
import type { Metadata } from "next";

const defaultBaseUrl = `https://${process.env.NEXT_PUBLIC_ORIGIN}`;

const defaultMetadata = {
  siteName: "Zendo",
};

export function generateMetadata({
  title,
  description,
  path = "/",
  extra = {},
}: BasicMetadata): Metadata {
  const url = `${defaultBaseUrl}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: defaultMetadata.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
    ...extra,
  };
}
