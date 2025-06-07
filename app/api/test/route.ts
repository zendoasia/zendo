import { type NextRequest, NextResponse } from "next/server";
import { getEnvTest } from "@/lib/test";
export const runtime = "edge";

export async function GET() {
  const env = getEnvTest();
  return NextResponse.json(
    { resp: env },
    { status: 200 }
  );
}
