import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isAncientBrowser = (userAgent: string): boolean => {
  if (/MSIE \d|Trident.*rv:/.test(userAgent)) return true;
  const chrome = userAgent.match(/Chrome\/(\d+)/);
  if (chrome && parseInt(chrome[1], 10) < 49) return true;
  const firefox = userAgent.match(/Firefox\/(\d+)/);
  if (firefox && parseInt(firefox[1], 10) < 52) return true;
  const safari = userAgent.match(/Version\/(\d+).+Safari/);
  if (safari && parseInt(safari[1], 10) < 10 && !userAgent.includes("Chrome"))
    return true;
  const edge = userAgent.match(/Edge\/(\d+)/);
  if (edge && parseInt(edge[1], 10) < 15) return true;
  return false;
};

const isAncientHardware = (userAgent: string): boolean => {
  // Heuristic: match old device models
  if (/Windows Phone|Nokia/.test(userAgent)) return true; // Old Windows phones
  return false;
};

const isBot = (userAgent: string): boolean => {
  return /bot|crawl|spider|slurp|bing|duckduckgo|baidu|yandex/i.test(userAgent);
};

export function middleware(request: NextRequest) {
  try {
    if (!request.nextUrl.pathname.startsWith("/fallback")) {
      const userAgent = request.headers.get("user-agent") || "";
      // Basic header validation to prevent header injection
      if (userAgent.length > 512 || /[\r\n]/.test(userAgent)) {
        return NextResponse.redirect("/fallback/unsupported");
      }
      if (
        userAgent &&
        !isBot(userAgent) &&
        (isAncientBrowser(userAgent) || isAncientHardware(userAgent))
      ) {
        return NextResponse.redirect("/fallback/unsupported");
      }
    }
  } catch (err) {
    // Fallback in case of unexpected errors (attack or bug)
    if (!request.nextUrl.pathname.startsWith("/fallback")) {
      // Pass error message in header (truncated for safety)
      const errorMsg = (err instanceof Error ? err.message : String(err)).slice(0, 256);
      const response = NextResponse.redirect("/fallback/error");
      response.headers.set("x-zendo-error", encodeURIComponent(errorMsg));
      return response;
    }
  }
}
