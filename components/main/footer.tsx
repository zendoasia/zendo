"use client";

import { Copyright, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Link from "next/link";

const footerLinks = [
  {
    title: "Products",
    links: ["JetBrains IDEs", ".NET & Visual Studio", "Team Tools", "Plugins"],
  },
  {
    title: "Solutions",
    links: ["C++ Tools", "Data Tools", "DevOps", "Game Development"],
  },
  {
    title: "Initiatives",
    links: ["Kotlin", "JetBrains Mono", "JetBrains Research"],
  },
  {
    title: "Community",
    links: ["Academic Licensing", "User Groups", "Content Creators"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Support", "Early Access", "Blog"],
  },
];

export default function Footer() {
  return (
    <div className="w-full relative rounded-[var(--radius)] p-[1px] z-50 ">
      <GlowingEffect
        spread={30}
        glow={true}
        disabled={false}
        proximity={100}
        inactiveZone={0.01}
      />

      <footer className="relative z-10 w-full px-4 py-6 rounded-[var(--radius)] bg-[color:var(--white-smoke)] dark:bg-[color:var(--night)] font-[family-name:var(--font-text)] border border-[color:var(--jet)] border-dashed">

        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full dark:bg-[color:var(--accent2)] bg-[color:var(--primary2)] blur-[100px] opacity-50 pointer-events-none" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10 z-10 relative">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-2 ">
              <h3 className="text-md font-semibold text-[color:var(--slate-600)] dark:text-[color:var(--slate-300)] font-[family-name:var(--font-text-mono)]">
                {section.title}
              </h3>
              {section.links.map((link, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-sm text-[color:var(--slate-600)] dark:text-[color:var(--slate-400)] hover:underline"
                >
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 z-10 relative border-t pt-6 border-[color:var(--jet)]">
          <div className="text-center sm:text-left">
            <Link
              href="/ownership"
              className="inline-flex items-center gap-1 text-[color:var(--slate-700)] dark:text-[color:var(--slate-300)]"
            >
              <Copyright size="1.2rem" />
              2025 Zendo. All rights reserved.
            </Link>
            <div className="text-sm text-[color:var(--slate-500)] dark:text-[color:var(--slate-500)]">
              Built by Aarush Master.
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#top"
                  className="p-2 rounded-md border border-[color:var(--jet)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] hover:text-[color:var(--text-light)] transition-colors duration-300"
                >
                  <ArrowUp size="1.2rem" />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="text-sm">Back to Top</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </footer>
    </div>
  );
}
