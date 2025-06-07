import { type NextRequest, NextResponse } from "next/server";
import { getEdgeEnvironmentVariables } from "@/lib/retrieveEdgeRouteEnv";
import { SignJWT } from "jose";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST") {
      return NextResponse.json(
        {
          code: 405,
          message: "This server does not accept any non-POST requests.",
        },
        { status: 405 }
      );
    }

    const env = await getEdgeEnvironmentVariables();

    if (!env.JWT_SHARED_SECRET) {
      return NextResponse.json(
        {
          code: 500,
          message: "Could not find the shared JWT secret to continue this request.",
        },
        { status: 500 }
      );
    }
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30s")
      .sign(new TextEncoder().encode(env.JWT_SHARED_SECRET));

    if (!env.WORKER_URL) {
      return NextResponse.json(
        {
          code: 500,
          message: "Could not find the backend server to send this request to.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(env.WORKER_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      return NextResponse.json(
        {
          code: 200,
          message: "Successfully sent the notifications to client.",
        },
        { status: 200 }
      );
    } else {
      const resp = await response.json();
      return NextResponse.json({
        code: resp.code,
        message: resp.message,
      });
    }
  } catch (error) {
    console.error("Error sending FCM message:", error);

    return NextResponse.json(
      {
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
