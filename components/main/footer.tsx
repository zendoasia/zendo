"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Copyright, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Footer() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark" || currentTheme === "system";

  const headerBg = isDark
    ? "bg-[color:var(--night)]"
    : "bg-[color:var(--white-smoke)]";
  const borderColor = isDark
    ? "border-[color:var(--jet)]"
    : "border-[color:var(--silver)]";

  const glowColor = isDark
    ? "bg-[color:var(--accent2)]"
    : "bg-[color:var(--primary2)]";

  return (
    <div
      className={`top-0 z-50 flex items-center px-4 py-3 backdrop-blur-lg overflow-hidden relative ${headerBg} shadow-lg ${borderColor} rounded-b-2xl font-[family-name:var(--font-geist-sans)]`}
    >
      <div
        className={`absolute bottom-0 w-48 h-48 rounded-full ${glowColor} blur-[100px] opacity-100 pointer-events-none`}
        aria-hidden="true"
      />

      <a href="/" className="z-10 text-left">
        <span className="inline-flex items-center gap-1 text-[color:var(--slate-700)] dark:text-[color:var(--slate-300)]">
          <Copyright className="w-4 h-4" />
          2025 Zendo. All rights reserved.
        </span>
        <br />
        <span className="inline-block text-[color:var(--slate-500)] dark:text-[color:var(--slate-500)] text-sm mt-1">
          Built by Aarush Master.
        </span>
      </a>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="#top"
              className="ml-auto z-10 font-[family-name:var(--font-geist-mono)] px-4 py-2 text-sm rounded-md border border-[color:var(--jet)] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] hover:text-[color:var(--text-light)] transition-colors duration-200"
            >
              <ArrowUp className="w-4 h-4" />
            </a>
          </TooltipTrigger>
          <TooltipContent
            stroke-width="2"
            aria-hidden="true"
            className="border-none fill-[var(--tooltip-color)] font-[family-name:var(--font-geist-sans)] font-medium text-xs "
          >
            Back to Top
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
