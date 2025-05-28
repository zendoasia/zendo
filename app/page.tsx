"use client";

import ArticleWrapper from "@/components/articleWrapper";
import { cn } from "@/lib/utils";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
// import { LampContainer } from "@/components/ui/lamp";

export default function Home() {
  return (
    <ArticleWrapper
      className={cn(
        "max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col",
        "min-h-screen justify-start"
      )}
      style={{ paddingTop: "20vh" }}
    >
      {/* <LampContainer>
        <h1 className="text-[32px] br:text-[48px] font-semibold text-center">
          Zendo - The home for{" "}
          <span className="inline-block text-md mr-4 ml-4">
            <ContainerTextFlip
              words={["Pixelite", "Portfolio"]}
              aria-label="Projects I've worked on"
            />
          </span>
        </h1>
      </LampContainer> */}
      {/* Temporary */}
      <h1 className="text-[32px] br:text-[48px] font-semibold text-center">
        Zendo - The home for{" "}
        <span className="inline-block text-md mr-4 ml-4">
          <ContainerTextFlip
            words={["Pixelite", "Portfolio"]}
            aria-label="Projects I've worked on"
          />
        </span>
      </h1>
    </ArticleWrapper>
  );
}
