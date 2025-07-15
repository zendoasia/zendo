/**
 * hooks/useThemeChanger.ts
 * ------------------------
 *
 * Implements Theme Changer Hook for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useHandleThemeChange() {
  const oldTheme = useRef<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = async (newTheme: string) => {
    if (!mounted) {
      toast.warning(
        "Theming components are not mounted yet, you may experience some issues. Please refresh.",
        {
          closeButton: true,
          dismissible: true,
          action: {
            label: "Refresh",
            onClick: () => {
              window.location.reload();
            },
            key: "Refresh the page",
          },
        }
      );
    }
    if (theme === newTheme) {
      toast.info("Already using " + newTheme + " theme.", {
        description: "Try switching to a different theme instead.",
        descriptionClassName: "!text-muted-foreground",
        closeButton: true,
        dismissible: true,
      });
      return;
    }

    try {
      oldTheme.current = theme as string;
      setTheme(newTheme);
      toast.success("Successfully switched to " + newTheme + " theme.", {
        closeButton: true,
        dismissible: true,
        description: "The theme has been switched to the new one.",
        descriptionClassName: "!text-muted-foreground",
        action: {
          label: "Revert",
          onClick: () => {
            setTheme(oldTheme.current as string);
            toast.success("Successfully reverted to " + oldTheme.current + " theme.", {
              closeButton: true,
              dismissible: true,
              description: "The theme has been reverted to the previous one.",
              descriptionClassName: "!text-muted-foreground",
            });
          },
          key: "Revert the theme",
        },
      });
    } catch (error) {
      console.error("Theme switch failed:", error);
      toast.error(
        "Failed to switch theme due to unexpected exception: " + (error as Error).message,
        {
          description: "You can retry the theme change by clicking the retry button.",
          descriptionClassName: "!text-muted-foreground",
          closeButton: true,
          dismissible: true,
          action: {
            label: "Retry",
            onClick: () => {
              setTheme(newTheme);
            },
            key: "Retry the theme change",
          },
        }
      );
    }
  };

  return { handleThemeChange, theme, resolvedTheme, mounted };
}
