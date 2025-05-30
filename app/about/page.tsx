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
