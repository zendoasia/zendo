import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const allowedOrigins = [`${process.env.NEXT_ORIGIN}`];
    const origin = req.headers.get("origin") ?? "";
    const referer = req.headers.get("referer") ?? "";

    const isValidOrigin = allowedOrigins.some(domain =>
      origin.startsWith(domain) || referer.startsWith(domain)
    );

    if (!isValidOrigin) {
      return NextResponse.json({ error: "Invalid origin found. The request must be from the origin server." }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

    const rateRes = await fetch(`${process.env.RATE_LIMITER_ENDPOINT}?ip=${ip}`);
    const { allowed } = await rateRes.json();

    if (!allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token missing." }, { status: 400 });
    }

    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY!,
          response: token,
        }),
      }
    );

    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      return NextResponse.json({ error: "Invalid CAPTCHA code." }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`Failed to verify turnstile, unexpected exception: ${err}`)
    return NextResponse.json({ error: "Unexpected server error occurred." }, { status: 500 });
  }
}
