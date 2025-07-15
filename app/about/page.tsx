/**
 * app/about/page.tsx
 * ------------------
 *
 * Implements the about page for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */
"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { SparklesHero } from "@/components/ui/sparkles";

export default function About() {
  return (
    <ArticleWrapper>
      <span className="flex flex-col items-center justify-center">
        <SparklesHero words="About" textClassName="text-3xl md:text-7xl lg:text-9xl" />
      </span>
    </ArticleWrapper>
  );
}
