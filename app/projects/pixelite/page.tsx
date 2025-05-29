"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { cn } from "@/lib/utils";
import { SparklesHero } from "@/components/ui/sparkles";

export default function Pixelite() {
  return (
    <ArticleWrapper
      className={cn(
        "max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col",
        "min-h-screen"
      )}
    >
      <span className="flex flex-col items-center justify-center">
        <SparklesHero
          words="Pixelite"
          textClassName="text-3xl md:text-7xl lg:text-9xl"
        />
      </span>
    </ArticleWrapper>
  );
}
