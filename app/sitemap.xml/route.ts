export const runtime = "edge";

export async function GET(request: Request) {
  const host = request.headers.get("host");

  if (host?.includes(".pages.dev")) {
    return Response.redirect("https://zendo.asia/sitemap.xml", 301);
  }

  try {
    const url = new URL(request.url);
    const localUrl = `${url.origin}/_/sitemap.xml`;

    const res = await fetch(localUrl, {
    cache: "no-cache"
  });

    if (!res.ok) {
      return new Response("Failed to load sitemap.xml", { status: 500 });
    }

    const xml = await res.text();
    return new Response(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("Sitemap fetch error:", err);
    return new Response("Internal Error", { status: 500 });
  }
}
