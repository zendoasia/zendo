/**
 * lib/utils.ts
 * ------------
 *
 * Implements the utils for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NavigatorUAData } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type OS = "MacOS" | "Windows" | "Linux" | "iOS" | "Android" | "Other";

export function detectOS(): OS {
  if (typeof navigator === "undefined") return "Other";

  const uaData = (navigator as unknown as { userAgentData?: NavigatorUAData }).userAgentData;
  if (uaData?.platform) {
    const platform = uaData.platform;
    if (platform.startsWith("Win")) return "Windows";
    if (platform.startsWith("Mac")) return "MacOS";
    if (platform === "Linux") return "Linux";
    if (platform === "Android") return "Android";
    if (/iPhone|iPad|iPod/.test(platform)) return "iOS";
    return "Other";
  }

  const ua = navigator.userAgent;

  if (/Windows/i.test(ua)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(ua)) return "MacOS";
  if (/Linux/i.test(ua)) return "Linux";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";

  return "Other";
}

export function stripOS(os: OS): string | null {
  if (!os) return null;
  switch (os) {
    case "MacOS":
      return "mac";
    case "Windows":
    case "Linux":
      return "windows";
    case "Android":
    case "iOS":
      return "phone";
    default:
      return null;
  }
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isMacOS(): boolean {
  if (typeof window === "undefined") return false;
  return /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);
}

export function isSafari(): boolean {
  if (typeof window === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}
