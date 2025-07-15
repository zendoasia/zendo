/**
 * app/api/status-badge/route.ts
 * ------------------------------
 *
 * Implements the status badge API for the app.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import { NextRequest, NextResponse } from "next/server";
import { getEnvVariable } from "@/lib/retrieveEdgeRouteEnv";
import { DateTime } from "luxon";

export const runtime = "edge";

let lastFetch = 0;
let cachedUptime = "";
type StatusPageState = "operational" | "degraded" | "downtime" | "maintenance";
const friendlyStatus: Record<StatusPageState, string> = {
  operational: "All Systems Operational",
  degraded: "Degraded",
  downtime: "Outage",
  maintenance: "Scheduled Maintenance",
};
const commonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(_req: NextRequest) {
  try {
    const now = DateTime.now().toMillis();
    const diff = now - lastFetch;

    if (diff < 1000 * 60) {
      return NextResponse.json(
        {
          code: 200,
          message: "Uptime fetched from cache.",
          uptime: cachedUptime,
        },
        {
          status: 200,
          headers: {
            ...commonHeaders,
          },
        }
      );
    }

    const url = `https://uptime.betterstack.com/api/v2/status-pages/${await getEnvVariable("NEXT_PRIVATE_BETTERSTACKS_STATUS_PAGE_ID")}`;
    const headers = {
      Authorization: `Bearer ${await getEnvVariable("NEXT_PRIVATE_BETTERSTACKS_GLOBAL_API_TOKEN")}`,
      ...commonHeaders,
    };
    const upstreamRes = await fetch(url, { headers });
    if (!upstreamRes.ok) {
      let errorText = "Unknown error";
      try {
        const resp = await upstreamRes.json();

        if (Array.isArray(resp.errors)) {
          // Case 1: array of error objects
          errorText = resp.errors
            .map((e: unknown) =>
              typeof e === "object" && e && "message" in e
                ? (e as { message?: string }).message
                : JSON.stringify(e)
            )
            .join("\n");
        } else if (typeof resp.errors === "string") {
          // Case 2: errors is a single string
          errorText = resp.errors;
        } else if (typeof resp.error === "string") {
          // Case 3: alternate format
          errorText = resp.error;
        } else {
          errorText = JSON.stringify(resp);
        }
      } catch {
        // Case 4: non-JSON or HTML error
        errorText = await upstreamRes.text();
      }
      return NextResponse.json(
        {
          code: upstreamRes.status,
          message: "Failed to fetch status uptime from better-stacks due to unknown error.",
          statusText: upstreamRes.statusText,
          error: errorText,
        },
        {
          status: upstreamRes.status,
          headers: {
            ...commonHeaders,
          },
        }
      );
    }

    lastFetch = now;
    const body = await upstreamRes.json();

    const status = body.data.attributes.aggregate_state as StatusPageState;
    const cleanedStatus = friendlyStatus[status] ?? "Unknown";
    cachedUptime = cleanedStatus;

    return NextResponse.json(
      {
        code: 200,
        message: "Uptime fetched from better-stacks.",
        uptime: cachedUptime,
      },
      {
        status: 200,
        headers: {
          ...commonHeaders,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: "Failed to fetch status uptime from better-stacks.",
        error: error instanceof Error ? error.toString() : "Unknown error",
      },
      {
        status: 500,
        headers: {
          ...commonHeaders,
        },
      }
    );
  }
}
