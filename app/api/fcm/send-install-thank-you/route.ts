import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const WORKER_URL = "https://zendo-backend.riyansarma76.workers.dev/send-notification";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const responseText = await res.text();

  return new NextResponse(responseText, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
