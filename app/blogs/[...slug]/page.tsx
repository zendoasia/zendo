/**
 * app/blogs/[...slug]/page.tsx
 * ----------------------------
 *
 * Implements the blog page for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { cn } from "@/lib/utils";
import { SparklesHero } from "@/components/ui/sparkles";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export const runtime = "edge";

function formatSlug(slug: string[]) {
  return slug.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export default function BlogPageSlug({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = React.use(params);
  const formattedSlug = formatSlug(slug);
  const router = useRouter();

  return (
    <ArticleWrapper>
      <div className="flex flex-col items-center justify-center gap-6 mt-12">
        <SparklesHero words={formattedSlug} textClassName="text-3xl md:text-7xl lg:text-9xl" />
        <br />
        <br />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                key="twitter-button"
                data-no-prompt
                size="icon"
                onClick={() => {
                  setTimeout(() => {
                    router.push("/blogs");
                  }, 650);
                }}
              >
                <span className="sr-only">Go To Blogs</span>
                <ArrowUp size="2rem" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className={cn("text-base")}>Go to Blogs</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </ArticleWrapper>
  );
}
