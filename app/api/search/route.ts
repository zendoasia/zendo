/**
 * app/api/search/route.ts
 * ---------------
 *
 * Implements the search API for the app.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

export const runtime = "edge";

import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CDN}/website/search.json`);
    const json = await res.json();
    return NextResponse.json(
      {
        code: 200,
        data: json,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=0, s-maxage=86400, must-revalidate",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
