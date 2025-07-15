/**
 * providers/keyboardShortcutProvider.tsx
 * -------------------------------------
 *
 * Implements Keyboard Shortcuts Provider for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { useEffect, useCallback } from "react";
import { useMenuStore } from "@/store/menuStore";

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const { setOpen, setOpenS, open, openS } = useMenuStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openS) {
          setOpenS(false);
          return;
        }
        if (open) {
          setOpen(false);
          return;
        }
      }

      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) setOpen(false);
        setOpenS(true);
        return;
      }

      if (e.key.toLowerCase() === "m" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (openS) setOpenS(false);
        setOpen(!open);
        return;
      }

      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const activeElement = document.activeElement;
        const isTyping =
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA" ||
          activeElement?.getAttribute("contenteditable") === "true";

        if (!isTyping) {
          e.preventDefault();
          if (open) setOpen(false);
          setOpenS(true);
          return;
        }
      }
    },
    [setOpen, setOpenS, open, openS]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [handleKeyDown]);

  return <>{children}</>;
}
