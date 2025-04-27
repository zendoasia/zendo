"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import LogoDark from "@/public/LogoDark.svg";
import LogoWhite from "@/public/LogoWhite.svg";

export default function Projects() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark" || currentTheme === "system";
  return (
    <div className="flex flex-col row-start-2 sm:items-center grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Image
        src={isDark ? LogoWhite : LogoDark}
        alt="Logo"
        width={180}
        height={38}
        priority
      />
      <h1 className="font-[family-name:var(--font-geist-mono)] justify-center">
        Projects
      </h1>
      <p className="text-lg font-[family-name:var(--font-geist-sans)] justify-center">
        Coming soon.
      </p>
    </div>
  );
}
