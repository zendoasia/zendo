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
import { FooterLink } from "@/types";

export default function Footer() {
  const footerLinks: FooterLink[] = [
    {
      title: {
        name: "Projects",
        path: "/projects",
        items: [
          { title: "Pixelite", path: "/projects/pixelite" },
          { title: "SkinCraft", path: "/projects/skincraft" },
        ],
      },
    },
    {
      title: {
        name: "Contact",
        path: "/contact",
        items: [
          { title: "Submit a Security Issue", path: "/security/report" },
          { title: "Blogs", path: "/blogs" },
        ],
      },
    },
  ];

  return (
    <div className="w-full relative rounded-[var(--radius)] p-[1px] z-50 ">
      <GlowingEffect
        spread={30}
        glow={true}
        disabled={false}
        proximity={100}
        inactiveZone={0.01}
      />

      <footer className="relative z-[60] w-full px-4 py-2.5 rounded-[var(--radius)] app-font border border-[color:var(--jet)]">
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full dark:bg-[color:var(--accent2)] bg-[color:var(--primary2)] blur-[100px] opacity-50 pointer-events-none" />

        <div key="section-keys" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-8 mb-10 z-[40] relative">
          {footerLinks.map((section) => (
            // Add key prop here
            <div key={section.title.name} className="flex flex-col gap-2">
              <h3>
                <Link
                  key={section.title.name}
                  href={section.title.path}
                  className="text-lg text-pretty hover:underline font-semibold app-font-space"
                >
                  {section.title.name}
                </Link>
              </h3>
              {section.title.items.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-base text-[color:var(--slate-600)] dark:text-[color:var(--slate-300)] hover:underline"
                >
                  {link.title}
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
