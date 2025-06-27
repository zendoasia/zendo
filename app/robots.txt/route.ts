export const runtime = "edge";

export async function GET(request: Request) {
  const host = request.headers.get("host");

  if (host?.includes(".pages.dev")) {
    return new Response("User-agent: *\nDisallow: /", {
      status: 200,
      headers: { "Content-Type": "text/plain", "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  const baseUrl = `https://${host}`;
  const res = await fetch(`${baseUrl}/_/robots.txt`, {
    cache: "no-cache"
  });

  if (!res.ok) {
    return new Response("Failed to load robots.txt", { status: 500 });
  }

  const text = await res.text();
  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
