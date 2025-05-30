"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import sendToast from "@/components/modules/toast";

export function useHandleThemeChange() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = async (newTheme: string) => {
    if (!mounted) {
      setTimeout(() => {
        sendToast({
          type: "warning",
          message:
            "Theming components are not mounted yet, you may experience some issues. Please refresh.",
        });
      });
    }
    if (theme === newTheme) {
      setTimeout(() => {
        sendToast({
          type: "neutral",
          message: `Already using ${newTheme} theme.`,
        });
      });
      return;
    }

    try {
      setTheme(newTheme);
      setTimeout(() => {
        sendToast({
          type: "success",
          message: `Successfully switched to ${newTheme} theme.`,
        });
      }, 100);
    } catch (error) {
      console.error("Theme switch failed:", error);
      sendToast({
        type: "error",
        message: `Failed to switch theme due to unexpected exception: ${(error as Error).message}`,
      });
    }
  };

  return { handleThemeChange, theme, resolvedTheme, mounted };
}
