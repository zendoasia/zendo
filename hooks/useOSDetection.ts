/**
 * hooks/useOSDetection.ts
 * -----------------------
 *
 * Implements OS Detection Hook for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { useEffect } from "react";
import { useMenuStore } from "@/store/menuStore";

export function useOSDetection() {
  const setStrippedOS = useMenuStore((state) => state.setStrippedOS);

  useEffect(() => {
    const detectOS = () => {
      if (typeof window === "undefined") return "unknown";

      const userAgent = window.navigator.userAgent.toLowerCase();
      const platform = window.navigator.platform?.toLowerCase() || "";

      // Check for mobile devices first
      if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
        return "phone";
      }

      // Check for desktop operating systems
      if (/mac|darwin/i.test(platform) || /mac os x/i.test(userAgent)) {
        return "mac";
      }

      if (/win/i.test(platform) || /windows/i.test(userAgent)) {
        return "windows";
      }

      if (/linux/i.test(platform) || /x11/i.test(userAgent)) {
        return "linux";
      }

      return "unknown";
    };

    const os = detectOS();
    setStrippedOS(os);
  }, [setStrippedOS]);
}
