"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function useNormalizeTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const validThemes = ["light", "dark", "system"];
    const aliasMap: Record<string, string> = {
      white: "light",
      night: "dark",
    };

    const normalize = (value: string | null): string => {
      if (!value) return "dark";
      value = value.toLowerCase();
      return aliasMap[value] || (validThemes.includes(value) ? value : "dark");
    };

    const applyNormalizedTheme = (value: string | null) => {
      const normalized = normalize(value);
      localStorage.setItem("theme", normalized);

      const html = document.documentElement;
      html.classList.remove("light", "dark");
      html.classList.add(normalized);

      setTheme(normalized);
    };

    applyNormalizedTheme(localStorage.getItem("theme"));

    let previous = localStorage.getItem("theme");
    const interval = setInterval(() => {
      const current = localStorage.getItem("theme");
      if (current !== previous) {
        previous = current;
        applyNormalizedTheme(current);
      }
    }, 500);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        applyNormalizedTheme(e.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [setTheme]);
}
