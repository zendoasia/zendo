/**
 * app/kofi/page.tsx
 * ------------------
 *
 * Adds metadata to the koFi page while preserving the page's client functionality.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import React from "react";
import KoFiPage from "@/components/pages/kofi.page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support me - Zendo",
  description:
    "Support my work and help me create more of these by making a small donation on my KoFi",
};

export default function KoFiSrv() {
  return (
    <>
      <KoFiPage />
    </>
  );
}
