"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CircleHelp } from "lucide-react";
import Link from "next/link";
import lonelyGhost from "@/public/assets/lonelyGhost.svg";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative isolate w-full min-h-screen flex flex-col min-[864px]:flex-row justify-center items-center gap-[8rem] px-4 py-8.5 text-center min-[864px]:text-left"
      )}
    >
      <motion.div
        className={cn("flex justify-center items-center min-[864px]:order-1")}
        animate={{ y: ["0%", "-10%", "0%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className={cn("relative w-full max-w-[400px]")}>
          {!imageLoaded && (
            <Skeleton className={cn("w-full aspect-[1/1] rounded-xl")} />
          )}
          <Image
            src={lonelyGhost}
            alt="Lonely Ghost"
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            className={cn(
              `object-contain w-full h-auto min-h-[150px] transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`
            )}
          />
        </div>
      </motion.div>

      <div
        className={cn(
          "flex flex-col items-center min-[864px]:items-start gap-[2rem] max-w-xl"
        )}
      >
        <div className="flex items-center gap-[0.3rem]">
          <CircleHelp size="2.5rem" className="text-rose-600" />
          <h1 className="text-xl font-[family-name:var(--font-space-grotesk)] font-extrabold">
            Hey Buddy! Seems like you are lost?
          </h1>
        </div>
        <section>
          <span className="text-lg">
            Sorry but we are not able to find the page you are looking for.
            Maybe checkout our
            <span className="inline-block text-sm mr-2 ml-2">
              <Link href="/">
                <ContainerTextFlip
                  words={["homepage", "hub", "start"]}
                  aria-label="Home Page"
                />
              </Link>
            </span>
            for finding something truly awesome.
          </span>
        </section>

        <section className="hidden min-[864px]:block">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button className="px-4 py-2.5 text-md border border-[color:var(--jet)] transition-colors duration-400">
                What do you mean?
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm font-[family-name:var(--font-space-grotesk)] leading-relaxed">
              The page you are visiting was either moved or does not exist at
              this location. Please check the URL you are visiting and retry.
            </HoverCardContent>
          </HoverCard>
        </section>

        <section className="block min-[864px]:hidden w-full">
          <Accordion type="single" collapsible>
            <AccordionItem value="info">
              <AccordionTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-md rounded-[radius:var(--radius)] border border-[color:var(--jet)] transition-colors duration-400 [&>svg]:text-[var(--primary2)] [&>svg]:w-[1.2rem] [&>svg]:h-[1.2rem]">
                What do you mean?
              </AccordionTrigger>
              <AccordionContent className="text-sm font-[family-name:var(--font-space-grotesk)] leading-relaxed px-1 pt-2 pb-4">
                The page you are visiting was either moved or does not exist at
                this location. Please check the URL you are visiting and retry.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}
