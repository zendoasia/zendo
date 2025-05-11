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
