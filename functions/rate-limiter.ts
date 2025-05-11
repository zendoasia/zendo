import { RateLimiterState, RateLimiterEnv } from "../types";

export class RateLimiter {
  state: RateLimiterState;
  env: RateLimiterEnv;

  constructor(state: RateLimiterState, env: RateLimiterEnv) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    const ip = url.searchParams.get("ip") || "unknown";

    const now = Date.now();
    const MAX = 5;
    const WINDOW = 60 * 1000;

    let data = await this.state.storage.get<{ count: number; start: number }>(ip);

    if (!data) {
      data = { count: 1, start: now };
    } else if (now - data.start > WINDOW) {
      data = { count: 1, start: now };
    } else {
      data.count++;
    }

    await this.state.storage.put(ip, data);

    if (data.count > MAX) {
      return new Response(JSON.stringify({ allowed: false }), { status: 429 });
    }

    return new Response(JSON.stringify({ allowed: true }), { status: 200 });
  }
}
