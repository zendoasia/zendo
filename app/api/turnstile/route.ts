import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { jwtToken, token } = await req.json();

    if (!jwtToken) {
      return NextResponse.json(
        {
          code: 400,
          message:
            "No JWT token found in the body. Please include the JWT token for verification of origin.",
        },
        { status: 400 }
      );
    }

    try {
      const secret = new TextEncoder().encode(process.env.NEXT_PRIVATE_JWT_SECRET!);
      const { payload } = await jwtVerify(jwtToken, secret);

      if (payload.from !== process.env.NEXT_PRIVATE_JWT_PAYLOAD_MESSAGE) {
        return NextResponse.json(
          {
            code: 422,
            message: "Bad payload.",
          },
          { status: 422 }
        );
      }
    } catch {
      return NextResponse.json(
        { code: 403, message: "Invalid origin token." },
        { status: 403 }
      );
    }

    const ip =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for") ??
      "127.0.0.1";

    const rateRes = await fetch(
      `${process.env.NEXT_PUBLIC_ORIGIN}/security/rate-check?ip=${ip}`
    );
    const { allowed } = await rateRes.json();

    if (!allowed) {
      return NextResponse.json(
        {
          code: 429,
          message:
            "Rate limit exceeded. Too many requests in a short span of time.",
        },
        { status: 429 }
      );
    }

    if (!token) {
      return NextResponse.json(
        {
          code: 400,
          message:
            "Token is missing from body. Please include the token received from cloudflare turnstile to verify the interaction.",
        },
        { status: 400 }
      );
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
      return NextResponse.json(
        {
          code: 403,
          message:
            "Invalid CAPTCHA code found. Please verify the code you are sending.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      code: 200,
      message: "Successfully verified captcha code. You may continue further.",
    });
  } catch (err) {
    console.error(`Failed to verify turnstile, unexpected exception: ${err}`);
    return NextResponse.json(
      { code: 500, message: "Unexpected server side error occurred." },
      { status: 500 }
    );
  }
}
