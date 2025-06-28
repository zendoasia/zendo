import { getEnvVariable } from "@/lib/retrieveEdgeRouteEnv";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const host = request.headers.get("host");
    const origin = await getEnvVariable("NEXT_PUBLIC_ORIGIN");

    if (host !== origin) {
      return new NextResponse("User-agent: *\nDisallow: /", {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }

    const localUrl = `https://${origin}/_/robots.txt`;
    const res = await fetch(localUrl, {
      next: {
        revalidate: 86400, 
      },
    });

    const text = await res.text();

    if (!res.ok) {
      console.error(`robots.txt fetch failed: Status ${res.status}, Body: ${text}`);
      return new NextResponse("Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (text.length > 100_000) {
      console.warn("robots.txt unexpectedly large.");
      return new NextResponse("Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "X-Robots-Tag": "index, follow",
      },
    });
  } catch (e) {
    console.error("robots.txt route failed:", e instanceof Error ? e.stack || e.message : e);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
