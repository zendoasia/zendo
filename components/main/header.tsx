"use client";

import { useEffect, useState, useMemo } from "react";
import { ModeToggle } from "@/components/modules/modes";
import { AlignJustify, X, Search } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LogoDark from "@/public/assets/LogoDark.svg";
import Logo from "@/public/assets/Logo.svg";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { detectOS } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const LazyMobileMenu = dynamic(
  () => import("@/components/modules/mobileMenu"),
  {
    loading: () => (
      <div className="fixed inset-0 w-full h-full bg-[color:var(--background)] dark:bg-[color:var(--background)] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function Header() {
  const os = useMemo(() => detectOS(), []);
  const strippedOS = useMemo(() => {
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
  }, [os]);

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenS(false);
    };

    if (openS) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [openS]);

  useEffect(() => {
    const elements = document.body.querySelectorAll("main, footer, header");

    if (open) {
      elements.forEach((el) => {
        if (!el.hasAttribute("data-no-aria-hidden")) {
          el.setAttribute("aria-hidden", "true");
        } else {
          el.setAttribute("aria-hidden", "false");
        }
      });
    } else {
      elements.forEach((el) => {
        el.removeAttribute("aria-hidden");
      });
    }

    return () => {
      elements.forEach((el) => {
        el.removeAttribute("aria-hidden");
      });
    };
  }, [open]);

  useEffect(() => {
    const downS = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        //  Support both MacOS Command Key, and Standard Ctrl Key.
        e.preventDefault();
        setOpenS((openS) => !openS);
      }
    };

    document.addEventListener("keydown", downS);
    return () => document.removeEventListener("keydown", downS);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark" || currentTheme === "system";

  return (
    <>
      <header className="sticky top-0 z-50 flex flex-wrap items-center px-4 py-3 gap-y-2 backdrop-blur-md border-l border-r border-b border-dashed dark:border-[color:var(--jet)] border-[color:var(--silver2)] bg-opacity-10 rounded-b-[radius:var(--radius)] font-[family-name:var(--font-text)]">
        <Link href="/" className="flex items-center">
          <div className="relative w-[140px] aspect-[140/30]">
            <Image
              src={isDark ? LogoDark : Logo}
              alt="Zendo Logo"
              fill
              priority
              loading="eager"
              className="object-contain"
            />
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-[0.5rem] ml-6">
          {["About", "Portfolio", "Projects", "Contact"].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="px-4 py-2 text-md rounded-[radius:var(--radius)] border border-[color:var(--jet)] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] hover:text-[color:var(--text-light)] transition-colors duration-300 font-[weight:var(--default-font-weight)]"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex-grow" />

        <div className="hidden md:flex items-center gap-[0.5rem] md:ml-auto w-full md:w-auto justify-center md:justify-end">
          <Button
            onClick={() => setOpenS(true)}
            className="ml-6 group inline-flex items-center justify-center gap-3 rounded-[radius:var(--radius)] border border-[color:var(--jet)] bg-transparent px-4 py-2.5 transition-colors duration-300 hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)]"
          >
            <Search size="1.2rem" className="dark:text-white text-black" />
            <span className="flex items-center gap-2">
              <span className="font-[weight:var(--default-font-weight)] text-sm dark:text-white text-black">
                Search...
              </span>
              <kbd className="text-xs font-[weight:var(--default-font-weight)] md:inline-block font-[family-name:var(--font-code)] border border-[color:var(--jet)] px-2 py-0.5 rounded-sm text-muted-foreground">
                <span className="sr-only">
                  {strippedOS === "mac"
                    ? "Command key plus K"
                    : strippedOS === "windows"
                    ? "Control key plus K"
                    : strippedOS === "phone"
                    ? "Press to search"
                    : "Press to refresh"}
                </span>
                {strippedOS === "mac" ? (
                  <>{"\u2318"} K</>
                ) : strippedOS === "windows" ? (
                  <>CTRL K</>
                ) : strippedOS === "phone" ? (
                  <>PRESS</>
                ) : !strippedOS ? (
                  <>REFRESH</>
                ) : null}
              </kbd>
            </span>
          </Button>

          <Link
            href="https://github.com/aarush0101/zendo"
            target="_blank"
            className="hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 px-2 py-2 rounded-[radius:var(--radius)] border border-[color:var(--jet)] overflow-hidden"
          >
            <div className="flex items-center justify-center">
              <SiGithub size="1.2rem" />
            </div>
          </Link>

          <ModeToggle />
        </div>

        <Button
          data-no-aria-hidden
          onClick={() => {
            setOpen(!open);
          }}
          variant="secondary"
          size="icon"
          className="block md:hidden hover:bg-[color:var(--primary-hover)] border border-[color:var(--jet)] px-2 py-2 rounded-[radius:var(--radius)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 1 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <X size="1.2rem" />
              </motion.div>
            ) : (
              <motion.div
                key="closed"
                initial={{ rotate: -90, opacity: 1 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <AlignJustify size="1.2rem" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </header>
      <AnimatePresence mode="wait">
        {open && (
          <LazyMobileMenu
            setOpen={setOpen}
            setOpenS={setOpenS}
            strippedOS={strippedOS}
          />
        )}
      </AnimatePresence>
    </>
  );
}
