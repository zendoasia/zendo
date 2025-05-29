"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { cn } from "@/lib/utils";
import { SparklesHero } from "@/components/ui/sparkles";

export default function Blogs() {
  return (
    <ArticleWrapper
      className={cn(
        "max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col",
        "min-h-screen"
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <SparklesHero
          words="Blogs"
          textClassName="text-3xl md:text-7xl lg:text-9xl"
        />
        <br />
        <br />
        <h3 className="mt-6 app-font-space">Coming soon.</h3>
        <h4 className="app-font-space">Use /xyz to go to a random page.</h4>
      </div>
    </ArticleWrapper>
  );
}
