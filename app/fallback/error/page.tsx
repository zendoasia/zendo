import React from "react";
import ErrorPage from "@/components/pages/fallback.error";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error | Zendo",
  description: "An error occurred. Please see details below.",
};

export default function ErrorPageWrapper() {
  return <ErrorPage />;
}
