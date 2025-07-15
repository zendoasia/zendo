/**
 * app/security/report/page.tsx
 * ----------------------------
 *
 * Implements the security report page for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { Spotlight } from "@/components/ui/spotlight-new";
import { cn } from "@/lib/utils";
import { SparklesHero } from "@/components/ui/sparkles";

export default function SecurityReport() {
  return (
    <ArticleWrapper
      className={cn("max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col", "min-h-screen")}
    >
      <Spotlight />

      <span className="flex flex-col items-center justify-center">
        <SparklesHero words="Security Report" textClassName="text-3xl md:text-7xl lg:text-9xl" />
      </span>
    </ArticleWrapper>
  );
}
