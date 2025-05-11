
import { RateLimitCheckProps } from "../../types";
import { PagesFunction } from '@cloudflare/workers-types';

export const onRequestGet: PagesFunction = async ({ request, env }: RateLimitCheckProps) => {
  const url = new URL(request.url);
  const ip = url.searchParams.get("ip") ?? "unknown";

  const id = env.RATE_LIMITER.idFromName(ip);
  const stub = env.RATE_LIMITER.get(id);

  const res = await stub.fetch(`https://dummy/rate-limit?ip=${ip}`);
  return res;
};
