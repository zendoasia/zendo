import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const cfRay = req.headers.get("cf-ray");

  const isOriginValid =
    origin === process.env.NEXT_PUBLIC_ORIGIN &&
    referer.startsWith(process.env.NEXT_PUBLIC_ORIGIN);

  if (!isOriginValid || !cfRay) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const secret = new TextEncoder().encode(process.env.NEXT_PRIVATE_JWT_SECRET!);

  const token = await new SignJWT({ from: process.env.NEXT_PRIVATE_JWT_PAYLOAD_MESSAGE })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1m")
    .sign(secret);

  return NextResponse.json({ code: 200, jwtToken: token }, { status: 200 });
}
