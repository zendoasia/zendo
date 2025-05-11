"use client";

import { motion } from "framer-motion";
import { CircleHelp } from "lucide-react";
import Link from "next/link";
import lonelyGhost from "@/public/assets/lonelyGhost.svg";
import Image from "next/image";
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

export default function NotFound() {
  return (
    <div className="relative isolate font-[weight:var(--default-font-weight)] font-[family-name:var(--font-text)] w-full min-h-screen flex flex-col md:flex-row justify-center items-center gap-[8rem] px-4 py-8.5 text-center md:text-left">
      <motion.div
        className="flex justify-center items-center md:order-1"
        animate={{ y: ["0%", "-10%", "0%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="relative w-full max-w-[400px] bg-transparent">
          <Image
            src={lonelyGhost}
            alt="Lonely Ghost"
            width={400}
            priority
            className="object-contain w-full h-auto"
          />
        </div>
      </motion.div>

      <div className="flex flex-col items-center md:items-start gap-[2rem] max-w-xl">
        <div className="flex items-center gap-[0.3rem]">
          <CircleHelp size="2.5rem" className="text-rose-600" />
          <h1 className="text-xl font-[family-name:var(--font-space-grotesk)] font-extrabold">
            Hey Buddy! Seems like you are lost?
          </h1>
        </div>
        <span className="text-lg">
          Sorry but we are not able to find the page you are looking for. Maybe
          checkout our
          <span className="inline-block text-sm mr-2 ml-2">
            <Link href="/">
              <ContainerTextFlip words={["homepage", "hub", "start"]} />
            </Link>
          </span>
          for finding something truly good.
        </span>

        <div className="hidden md:block">
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="px-4 py-2.5 text-md rounded-[radius:var(--radius)] border border-[color:var(--jet)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] transition-colors duration-300">
                What do you mean?
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm font-[family-name:var(--font-space-grotesk)] leading-relaxed">
              The page you are visiting was either moved or does not exist at
              this location. Please check the URL you are visiting and retry.
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="block md:hidden w-full">
          <Accordion type="single" collapsible>
            <AccordionItem value="info">
              <AccordionTrigger className="px-4 py-2.5 text-md rounded-[radius:var(--radius)] border border-[color:var(--jet)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] transition-colors duration-300">
                What do you mean?
              </AccordionTrigger>
              <AccordionContent className="text-sm font-[family-name:var(--font-space-grotesk)] leading-relaxed px-1 pt-2 pb-4">
                The page you are visiting was either moved or does not exist at
                this location. Please check the URL you are visiting and retry.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
