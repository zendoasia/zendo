import React from "react";
import UnsupportedPage from "@/components/pages/unsupported.fallback";

export const metadata = {
  title: "Unsupported Browser or Device | Zendo",
  description: "Your browser or device is not supported.",
};

export default function UnsupportedPageWrapper() {
  return <UnsupportedPage />;
}
