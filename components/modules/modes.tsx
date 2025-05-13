"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import sendToast from "@/components/modules/toast";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted first to avoid hydration issues.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleThemeChange = async (newTheme: string) => {
    if (!mounted) {
      setTimeout(() => {
        sendToast(
          "warning",
          "Theming components are not mounted yet, you may experience some issues. Please refresh."
        );
      });
    }
    if (theme === newTheme) {
      setTimeout(() => {
        sendToast("neutral", `Already using ${newTheme} theme.`);
      });
      return;
    }

    try {
      setTheme(newTheme);
      setTimeout(() => {
        sendToast("success", `Successfully switched to ${newTheme} theme.`);
      }, 100);
    } catch (error) {
      console.error("Theme switch failed:", error);
      sendToast(
        "error",
        `Failed to switch theme due to unexpected exception: ${
          (error as Error).message
        }`
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("nav-btn")}
        >
          <span className={cn("text-black dark:text-white")}>
            {theme === "system" ? (
              <Monitor size="1.2rem" />
            ) : resolvedTheme === "light" ? (
              <Sun size="1.2rem" />
            ) : (
              <Moon size="1.2rem" />
            )}
            <span className={cn("sr-only")}>Toggle theme</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label="Theme Options">
        {["light", "dark", "system"].map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => handleThemeChange(t)}
            className={cn("flex justify-between")}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {theme === t && (
              <Check
                size="1.2rem"
                aria-hidden={true}
                className={cn("text-green-600 dark:text-green-500")}
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
