import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error | Zendo",
  description: "An error occurred. Please see details below.",
};

function getErrorMessage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    // Get error from custom header if present
    const error = decodeURIComponent(
      window?.performance?.getEntriesByType("navigation")[0]?.toJSON?.()?.serverTiming?.find?.((t: { name: string; description?: string }) => t.name === "x-zendo-error")?.description ||
      (window as unknown as { xZendoError?: string }).xZendoError ||
      ""
    );
    if (error) return error;
    // Fallback: try to get from response headers
    const headers = (window as unknown as { headers?: Record<string, string> }).headers || {};
    if (headers["x-zendo-error"]) return decodeURIComponent(headers["x-zendo-error"]);
  } catch {
    // ignore
  }
  // Try to get from search params
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.has("err")) return params.get("err");
  }
  return null;
}

export default function ErrorPage() {
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Try to get error from header
    let err = null;
    try {
      // Try to get from navigation timing (if available)
      err = getErrorMessage();
    } catch {}
    setError(err);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-sky-900 to-black text-white px-4">
      <div className="max-w-lg w-full bg-black/70 rounded-xl shadow-2xl p-8 border border-indigo-700">
        <h1 className="text-4xl font-bold mb-4 text-indigo-300">Something went wrong</h1>
        <p className="mb-4 text-lg text-gray-200">
          Sorry, an unexpected error occurred. If this keeps happening, please contact support.
        </p>
        {error && (
          <pre className="bg-gray-900 text-red-400 rounded p-4 overflow-x-auto text-sm border border-red-700">
            {error}
          </pre>
        )}
      </div>
    </main>
  );
}
