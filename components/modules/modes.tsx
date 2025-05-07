"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, MonitorCogIcon, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import sendToast from "@/components/modules/toast";

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
      sendToast(
        "warning",
        "Theme changer component is not yet mounted, you may experience some issues."
      );
    }
    if (theme === newTheme) {
      sendToast("neutral", `Already using ${newTheme} theme.`);
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
          variant="outline"
          size="icon"
          className="z-[100] px-4 py-2.5 rounded-[radius:var(--radius)] border border-[color:var(--jet)] hover:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300"
        >
          {theme === "system" ? (
            <MonitorCogIcon size="1.2rem" />
          ) : resolvedTheme === "light" ? (
            <Sun size="1.2rem" />
          ) : (
            <Moon size="1.2rem" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {["light", "dark", "system"].map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => handleThemeChange(t)}
            className="flex justify-between"
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {theme === t && <Check size="1.2rem" className="text-[var(--success)]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
