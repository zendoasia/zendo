/**
 * hooks/useForceUnlockScroll.ts
 * -----------------------------
 *
 * Forces the scroll to be unlocked.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { useEffect } from "react";

export function useForceUnlockScroll(open: boolean) {
  useEffect(() => {
    const el = document.body;

    const forceUnlock = () => {
      if (el?.dataset?.scrollLocked && open) {
        el.style.pointerEvents = "auto";
        el.style.overflow = "";
        delete el.dataset.scrollLocked;
      }
    };

    forceUnlock();

    const observer = new MutationObserver(forceUnlock);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["style", "data-scroll-locked"],
    });

    return () => observer.disconnect();
  }, [open]);
}
