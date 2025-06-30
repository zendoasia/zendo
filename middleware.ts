import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getEnvVariable } from "@/lib/retrieveEdgeRouteEnv";

const isAncientBrowser = (userAgent: string): boolean => {
  if (/MSIE \d|Trident.*rv:/.test(userAgent)) return true;
  const chrome = userAgent.match(/Chrome\/(\d+)/);
  if (chrome && parseInt(chrome[1], 10) < 49) return true;
  const firefox = userAgent.match(/Firefox\/(\d+)/);
  if (firefox && parseInt(firefox[1], 10) < 52) return true;
  const safari = userAgent.match(/Version\/(\d+).+Safari/);
  if (safari && parseInt(safari[1], 10) < 10 && !userAgent.includes("Chrome")) return true;
  const edge = userAgent.match(/Edge\/(\d+)/);
  if (edge && parseInt(edge[1], 10) < 15) return true;
  return false;
};

const isBot = (userAgent: string): boolean => {
  return /bot|crawl|spider|slurp|bing|baidu|yandex/i.test(userAgent);
};

export async function middleware(request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent") || "";
    const host = request.headers.get("host");
    const origin = await getEnvVariable("NEXT_PUBLIC_ORIGIN");

    if (request.nextUrl.pathname === "/robots.txt") return NextResponse.next();

    const isLocalhost =
      host?.startsWith("localhost") || host?.startsWith("127.") || host === "[::1]";

    if (origin && host && host !== origin && !host.endsWith(`.${origin}`) && !isLocalhost) {
      const url = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${origin}`);
      return NextResponse.redirect(url.toString(), 301);
    }

    if (!request.nextUrl.pathname.startsWith("/fallback")) {
      if (userAgent.length > 512 || /[\r\n]/.test(userAgent)) {
        return NextResponse.redirect(`${request.nextUrl.origin}/fallback/unsupported`);
      }
      if (!isBot(userAgent) && isAncientBrowser(userAgent)) {
        return NextResponse.redirect(`${request.nextUrl.origin}/fallback/unsupported`);
      }
    }
  } catch (err) {
    if (!request.nextUrl.pathname.startsWith("/fallback")) {
      const errorMsg = (err instanceof Error ? err.message : String(err)).slice(0, 256);
      const response = NextResponse.redirect(`${request.nextUrl.origin}/fallback/error`);
      response.headers.set("x-zendo-error", encodeURIComponent(errorMsg));
      return response;
    }
  }
}
