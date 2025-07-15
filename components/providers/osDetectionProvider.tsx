/**
 * providers/osDetectionProvider.tsx
 * ---------------------------------
 *
 * Implements OS Detection Provider for the app. This is used to detect the OS of the user and store it in the zustand store.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { useEffect } from "react";
import { useMenuStore } from "@/store/menuStore";
import { detectOS, stripOS } from "@/lib/utils";

export function OSDetectionProvider({ children }: { children: React.ReactNode }) {
  const setStrippedOS = useMenuStore((state) => state.setStrippedOS);

  useEffect(() => {
    const os = detectOS();
    const stripped = stripOS(os);
    setStrippedOS(stripped || "");
  }, [setStrippedOS]);

  return <>{children}</>;
}
