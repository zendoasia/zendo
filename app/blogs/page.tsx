"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { SparklesHero } from "@/components/ui/sparkles";

export default function Blogs() {
  return (
    <ArticleWrapper>
      <div className="flex flex-col items-center justify-center">
        <SparklesHero words="Blogs" textClassName="text-3xl md:text-7xl lg:text-9xl" />
        <br />
        <br />
        <h3 className="mt-6 app-font-space">Coming soon.</h3>
        <h4 className="app-font-space">Use /xyz to go to a random page.</h4>
      </div>
    </ArticleWrapper>
  );
}
