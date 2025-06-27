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
