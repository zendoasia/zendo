"use client";

import { Copyright, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="top-0 z-50 flex flex-col sm:flex-row items-center sm:items-center px-4 py-2 backdrop-blur-md overflow-hidden relative bg-[color:var(--white-smoke)] -lg dark:bg-[color:var(--night)] border-l border-r border-t border-dashed border-[color:var(--jet)] rounded-t-3xl font-[family-name:var(--font-text)]">
      <div
        className={`absolute bottom-0 w-48 h-48 rounded-full dark:bg-[color:var(--accent2)] bg-[color:var(--primary2)] blur-[100px] opacity-100 pointer-events-none`}
        aria-hidden="true"
      />

      <Link
        href="/ownership"
        className="z-10 text-left sm:mr-12 sm:relative sm:flex-shrink-0"
      >
        <span className="inline-flex items-center gap-1 text-[color:var(--slate-700)] dark:text-[color:var(--slate-300)]">
          <Copyright size="1.2rem" />
          2025 Zendo. All rights reserved.
        </span>
        <br />
        <span className="inline-block text-[color:var(--slate-500)] dark:text-[color:var(--slate-500)] text-sm mt-1">
          Built by Aarush Master.
        </span>
      </Link>

      <div className="flex flex-wrap sm:flex-nowrap gap-20 sm:gap-8 sm:grow sm:justify-center mt-4 w-full sm:max-w-[60%] sm:relative">
        <span className="flex flex-col gap-2 min-w-[20%] sm:min-w-[auto]">
          <h3 className="text-md font-semibold text-[color:var(--slate-500)] dark:text-[color:var(--slate-300)]">
            Resources
          </h3>
          <Link
            href="#"
            className="text-sm text-[color:var(--slate-600)] dark:text-[color:var(--slate-400)]"
          >
            Documentation
          </Link>
          <Link
            href="#"
            className="text-sm text-[color:var(--slate-600)] dark:text-[color:var(--slate-400)]"
          >
            Support
          </Link>
        </span>
        <span className="flex flex-col gap-2 min-w-[20%] sm:min-w-[auto]">
          <h3 className="text-md font-semibold text-[color:var(--slate-500)] dark:text-[color:var(--slate-300)]">
            Company
          </h3>
          <Link
            href="#"
            className="text-sm text-[color:var(--slate-600)] dark:text-[color:var(--slate-400)]"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm text-[color:var(--slate-600)] dark:text-[color:var(--slate-400)]"
          >
            Careers
          </Link>
        </span>{" "}
        <span className="flex flex-col gap-2 min-w-[20%] sm:min-w-[auto]">
          <h3 className="text-md font-semibold text-[color:var(--slate-500)] dark:text-[color:var(--slate-300)]">
            Company
          </h3>
          <Link
            href="#"
            className="text-sm text-[color:var(--slate-600)] dark:text-[color:var(--slate-400)]"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm text-[color:var(--slate-600)] dark:text-[color:var(--slate-400)]"
          >
            Careers
          </Link>
        </span>{" "}
        <span className="flex flex-col gap-2 min-w-[20%] sm:min-w-[auto]">
          <h3 className="text-md font-semibold text-[color:var(--slate-500)] dark:text-[color:var(--slate-300)]">
            Company
          </h3>
          <Link
            href="#"
            className="text-sm text-[color:var(--slate-600)] dark:text-[color:var(--slate-400)]"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm text-[color:var(--slate-600)] dark:text-[color:var(--slate-400)]"
          >
            Careers
          </Link>
        </span>
        {/* More spans can be added here as needed */}
      </div>

      <div className="ml-auto sm:relative sm:top-0 sm:right-0 sm:mr-12">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#top"
                className="sm:px-4 sm:py-2 text-sm sm:rounded-md sm:border sm:border-[color:var(--jet)] sm:hover:bg-[color:var(--primary-hover)] sm:focus:bg-[color:var(--primary-hover)] sm:hover:text-[color:var(--text-light)] sm:transition-colors sm:duration-300"
              >
                <ArrowUp size="1.2rem" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="text-sm">Back to Top</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </footer>
  );
}
