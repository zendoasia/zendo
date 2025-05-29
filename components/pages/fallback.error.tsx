"use client";

import { useState, useEffect } from "react";
import ArticleWrapper from "@/components/articleWrapper";
import { cn } from "@/lib/utils"; 

function getErrorMessage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const error = decodeURIComponent(
      window?.performance
        ?.getEntriesByType("navigation")[0]
        ?.toJSON?.()
        ?.serverTiming?.find?.(
          (t: { name: string; description?: string }) =>
            t.name === "x-zendo-error"
        )?.description ||
        (window as unknown as { xZendoError?: string }).xZendoError ||
        ""
    );
    if (error) return error;
    const headers =
      (window as unknown as { headers?: Record<string, string> }).headers || {};
    if (headers["x-zendo-error"])
      return decodeURIComponent(headers["x-zendo-error"]);
  } catch {
    // ignore
  }
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.has("err")) return params.get("err");
  }
  return null;
}

export default function ErrorPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let err = null;
    try {
      err = getErrorMessage();
    } catch {}
    setError(err);
  }, []);

  return (
    <ArticleWrapper
      className={cn(
        "max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col",
        "min-h-screen"
      )}
    >
      <main className="flex flex-col items-center justify-center flex-1 bg-gradient-to-br text-black dark:text-white py-16">
        <div className="max-w-lg w-full bg-black/70 rounded-xl shadow-2xl p-8 border border-indigo-700">
          <h1 className="text-4xl font-bold mb-4 text-indigo-300">
            Something went wrong
          </h1>
          <p className="mb-4 text-lg text-gray-200">
            Sorry, an unexpected error occurred. If this keeps happening, please
            contact support.
          </p>
          {error && (
            <pre className="bg-gray-900 text-red-400 rounded p-4 overflow-x-auto text-sm border border-red-700">
              {error}
            </pre>
          )}
        </div>
      </main>
    </ArticleWrapper>
  );
}
