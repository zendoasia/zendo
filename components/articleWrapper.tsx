/**
 * components/articleWrapper.tsx
 * -----------------------------
 *
 * Implements Article Wrapper for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import { ArticleWrapperProps } from "@/types";
import { cn } from "@/lib/utils";

export default function ArticleWrapper({
  children,
  className = "",
  style = null,
}: ArticleWrapperProps) {
  return (
    <div
      className={cn(
        "max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col",
        "min-h-screen",
        "justify-center min-h-screen app-font flex flex-col",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
