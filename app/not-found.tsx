"Dummy file to add Metadata to the 404 page while preserving the 404 page's client functionality.";

import React from "react";
import NotFound from "@/components/main/notFound";
import type { Metadata } from "next";
import Head from "next/head";
import lonelyGhost from "@/public/assets/lonelyGhost.svg";

export const metadata: Metadata = {
  title: "404 - Zendo",
  description: "The page you were looking for was not found here.",
};

export default function NotFoundSrv() {
  return (
    <>
      <Head>
        <link rel="preload" href={lonelyGhost.src} as="image" type="image/svg+xml" />
      </Head>
      <NotFound />
    </>
  );
}
