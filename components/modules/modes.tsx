"use client";

import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useHandleThemeChange } from "@/hooks/useThemeChanger";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { handleThemeChange, theme, resolvedTheme, mounted } = useHandleThemeChange();

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className={cn("nav-btn")}>
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
