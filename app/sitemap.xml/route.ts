import { getEnvVariable } from "@/lib/retrieveEdgeRouteEnv";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const host = request.headers.get("host");
    const origin = await getEnvVariable("NEXT_PUBLIC_ORIGIN");

    if (!host?.endsWith(`.${origin}`) && host !== origin) {
      const url = `https://${origin}/sitemap.xml`;
      return NextResponse.redirect(url, 301);
    }

    const localUrl = `https://${origin}/_/sitemap.xml`;
    const res = await fetch(localUrl, {
      next: {
        revalidate: 86400, 
      },
    });

    const text = await res.text();

    if (!res.ok) {
      console.log(`Failed to return sitemap.xml. Status: ${res.status}, Response: ${text}`);
      return new NextResponse("Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (text.length > 500_000) {
      console.warn("Sitemap response too large.");
      return new NextResponse("Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (e) {
    console.error(`Failed to return sitemap.xml:`, e instanceof Error ? e.stack || e.message : e);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
