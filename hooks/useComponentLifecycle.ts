/**
 * hooks/useComponentLifecycle.ts
 * ------------------------------
 *
 * Implements Component Lifecycle Hook for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { useEffect, useState, useRef } from "react";

export function useComponentLifecycle(isOpen: boolean, animationDuration = 350) {
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && !shouldRender) {
      // Component is opening - mount immediately
      setShouldRender(true);
    } else if (!isOpen && shouldRender) {
      // Component is closing - keep mounted for animation, then unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
      }, animationDuration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, shouldRender, animationDuration]);

  return shouldRender;
}
