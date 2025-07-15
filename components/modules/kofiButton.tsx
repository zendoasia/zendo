/**
 * components/modules/kofiButton.tsx
 * ---------------------------------
 *
 * A button that links to the Ko-fi page of the user. This is used to support the development of the project.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import Link from "next/link";
import type { KoFiButtonProps } from "@/types";

export default function KoFiButton({ username, className = "" }: KoFiButtonProps) {
  return (
    <Link
      href={`https://kofi.com/${username}`}
      target="_blank"
      className={`group inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#ff5f5f] hover:bg-[#e55555] text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${className}`}
    >
      <span className="flex items-center justify-center w-full gap-2">
        <svg
          className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.033 11.316c.049 4.049 3.896 4.618 3.896 4.618s8.474-.274 11.51-.274c10.775 0 10.775-7.965 8.467-11.865zm-6.069 7.31h-3.275V11.2h-1.385v5.059H9.875V11.2H8.49v5.059H5.215V9.938h9.597v6.32zm2.45-3.368c-.369 1.619-1.943 2.729-3.519 2.729-1.577 0-3.15-1.11-3.519-2.729-.369-1.619.754-2.998 2.518-2.998s2.887 1.379 2.52 2.998z" />
        </svg>
        <span>Support on kofi</span>
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </span>
    </Link>
  );
}
