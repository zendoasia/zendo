import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const cfRay = req.headers.get("cf-ray");

  if (!cfRay) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const secret = new TextEncoder().encode(process.env.NEXT_PRIVATE_JWT_SECRET!);

  const token = await new SignJWT({ from: process.env.NEXT_PRIVATE_JWT_PAYLOAD_MESSAGE })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1m")
    .sign(secret);

  return NextResponse.json({ code: 200, jwtToken: token, expiresIn: "60" }, { status: 200 });
}
