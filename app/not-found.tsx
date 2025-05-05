"Dummy file to add Metadata to the 404 page while preserving the 404 page's client functionality.";

import React from "react";
import NotFound from "@/components/main/notFound";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Zendo",
};

export default function NotFoundSrv() {
  return <NotFound />;
}
