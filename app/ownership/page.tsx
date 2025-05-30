"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { SparklesHero } from "@/components/ui/sparkles";

export default function Ownership() {
  return (
    <ArticleWrapper>
      <span className="flex flex-col items-center justify-center">
        <SparklesHero words="Ownership" textClassName="text-3xl md:text-7xl lg:text-9xl" />
      </span>
    </ArticleWrapper>
  );
}
