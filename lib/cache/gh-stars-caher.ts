/**
 * lib/cache/gh-stars-caher.ts
 * ---------------------------
 *
 * Caches the GitHub stars on a server component.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use server";

import { cache } from "react";

const GITHUB_URL = `https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_REPO_URL}`;

function formatStars(stars: number) {
  if (stars >= 1_000_000) return `${(stars / 1_000_000).toFixed(1)}M`;
  if (stars >= 1_000) return `${(stars / 1_000).toFixed(1)}k`;
  return stars.toString();
}

export default cache(async function GitHubStars() {
  try {
    const res = await fetch(GITHUB_URL, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PRIVATE_GITHUB_ORG_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const stars = Number(formatStars(json?.stargazers_count || 0));

    return stars;
  } catch {
    return 0;
  }
});
