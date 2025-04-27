"use client";

import lonelyGhostDark from "@/public/lonelyGhostDark.svg";
import lonelyGhostWhite from "@/public/lonelyGhostWhite.svg";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldQuestion } from "lucide-react";

export default function NotFound() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark" || currentTheme === "system";

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 py-8 text-center">
      <motion.div
        className="flex justify-center items-center mb-8"
        animate={{ y: ["0%", "-10%", "0%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Image
          src={isDark ? lonelyGhostWhite : lonelyGhostDark}
          alt="Lonely Ghost"
          priority={false}
          width={0}
          height={0}
          className="w-[60vw] md:w-[30vw] aspect-[3/4] max-w-[80%] rounded-full object-contain"
          loading="lazy"
        />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <ShieldQuestion className="w-10 h-10 text-[color:var(--danger)]" />
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          Hey! Seems like you are lost?
        </h1>
      </div>

      <p className="text-lg mt-6">
        Sorry visitor, but we believe the page you are currently looking for
        does not exist or has been moved.
      </p>

      <a
        href="/"
        className="mt-8 font-[family-name:var(--font-geist-mono)] px-6 py-3 text-lg rounded-lg text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] hover:text-[color:var(--text-light)] transition-colors duration-200 border border-[color:var(--jet)] shadow-lg"
      >
        Go back home
      </a>
    </div>
  );
}
