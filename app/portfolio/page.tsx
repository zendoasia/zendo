"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { SparklesHero } from "@/components/ui/sparkles";

export default function Portfolio() {
  return (
    <ArticleWrapper>
      <span className="flex flex-col items-center justify-center">
        <SparklesHero words="Portfolio" textClassName="text-3xl md:text-7xl lg:text-9xl" />
      </span>
    </ArticleWrapper>
  );
}
