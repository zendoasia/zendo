"use server";

import { EdgeRequestEnv } from "@/types";

export async function getEdgeEnvironmentVariables(): Promise<EdgeRequestEnv> {
  const JWT_SHARED_SECRET = process.env.NEXT_PRIVATE_JWT_SHARED_SECRET;
  const WORKER_URL = process.env.NEXT_PRIVATE_WORKER_URL;

  return {
    JWT_SHARED_SECRET: JWT_SHARED_SECRET,
    WORKER_URL: WORKER_URL,
  };
}
