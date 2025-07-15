/**
 * components/pages/fallback.error.tsx
 * -----------------------------------
 *
 * Implements the fallback error page for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { useState, useEffect } from "react";
import ArticleWrapper from "@/components/articleWrapper";
import { FallbackErrorPageProps } from "@/types";

export default function ErrorPage({ error }: FallbackErrorPageProps) {
  const [clientError, setClientError] = useState<string | null>(error ?? null);

  useEffect(() => {
    // If no error from server, try to get from client (query string fallback)
    if (!error) {
      let err = null;
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          if (params.has("err")) err = params.get("err");
        }
      } catch {}
      setClientError(err);
    }
  }, [error]);

  return (
    <ArticleWrapper>
      <main className="flex flex-col items-center justify-center flex-1 bg-gradient-to-br text-black dark:text-white py-16">
        <div className="max-w-lg w-full bg-black/70 rounded-xl shadow-2xl p-8 border border-indigo-700">
          <h1 className="text-4xl font-bold mb-4 text-indigo-300">Something went wrong</h1>
          <p className="mb-4 text-lg text-gray-200">
            Sorry, an unexpected error occurred. If this keeps happening, please contact support.
          </p>
          {clientError && (
            <pre className="bg-gray-900 text-red-400 rounded p-4 overflow-x-auto text-sm border border-red-700">
              {clientError}
            </pre>
          )}
        </div>
      </main>
    </ArticleWrapper>
  );
}
