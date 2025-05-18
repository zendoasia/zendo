"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function SecurityReport() {
  return (
    <ArticleWrapper className={cn("flex flex-col items-center")}>
      <Spotlight />     
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24">
        <h1 className="py-20 !text-3xl !br:text-5xl font-semibold app-font-space">
          Security Issue
        </h1>
      </div>
    </ArticleWrapper>
  );
}
