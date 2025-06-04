import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { TurnstileResponse } from "@/types";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      code: 403,
      error: "Coming soon...",
    },
    { status: 403 }
  );

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid or missing JSON body in request.",
        },
        { status: 400 }
      );
    }

    const { jwtToken, token } = body as { jwtToken?: string; token?: string };

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

    if (typeof jwtToken !== "string") {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid JWT token format.",
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
    } catch (err) {
      console.error("JWT verification failed:", err);
      return NextResponse.json({ code: 403, message: "Invalid origin token." }, { status: 403 });
    }

    if (!token) {
      return NextResponse.json(
        {
          code: 400,
          message:
            "Token is missing from body. Please include the token received from Cloudflare Turnstile.",
        },
        { status: 400 }
      );
    }

    if (typeof token !== "string") {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid Turnstile token format.",
        },
        { status: 400 }
      );
    }

    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    });

    if (!turnstileRes.ok) {
      const errorText = await turnstileRes.text();
      console.error("Turnstile server error response:", errorText);
      return NextResponse.json(
        {
          code: 502,
          message: "Failed to contact Turnstile verification server.",
        },
        { status: 502 }
      );
    }

    let turnstileData: TurnstileResponse;
    try {
      turnstileData = await turnstileRes.json();
    } catch (err) {
      console.error(
        `Failed to parse turnstile response json due to error ${err}, finding out reason...`
      );
      const raw = await turnstileRes.text();
      console.error("Failed to parse Turnstile response JSON:", raw);
      return NextResponse.json(
        {
          code: 502,
          message: "Invalid JSON received from Turnstile server.",
        },
        { status: 502 }
      );
    }

    if (!turnstileData.success) {
      return NextResponse.json(
        {
          code: 403,
          message: "Invalid CAPTCHA code found. Please verify the code you are sending.",
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
      { code: 500, message: "Unexpected server-side error occurred." },
      { status: 500 }
    );
  }
}
