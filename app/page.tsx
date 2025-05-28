"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { cn } from "@/lib/utils";
import { SparklesHero } from "@/components/ui/sparkles";

export default function Home() {
  return (
    <ArticleWrapper
      className={cn(
        "max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col",
        "min-h-screen justify-start"
      )}
      style={{ paddingTop: "20vh" }}
    >
    <span className="w-full min-h-screen flex items-center justify-center">
      <SparklesHero words="Zendo" />
    </span>
    </ArticleWrapper>
  );
}
