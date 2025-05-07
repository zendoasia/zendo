"use client";

import { useEffect, useState, useMemo } from "react";
import { ModeToggle } from "@/components/modules/modes";
import { FocusTrap } from "focus-trap-react";
import { AlignJustify, X, House, Search, Settings } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LogoDark from "@/public/assets/LogoDark.svg";
import Logo from "@/public/assets/Logo.svg";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { detectOS } from "@/lib/utils";

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

  const router = useRouter();
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
      <header
        data-no-aria-hidden
        className="sticky top-0 z-50 flex flex-wrap items-center px-4 py-3 gap-y-2 backdrop-blur-md border-l border-r border-b border-dashed dark:border-[color:var(--jet)] border-[color:var(--silver2)] bg-opacity-10 rounded-b-[radius:var(--radius)] font-[family-name:var(--font-text)]"
      >
        <Link href="/" className="flex items-center">
          <div className="relative w-[140px] aspect-[140/30]">
            <Image
              src={isDark ? LogoDark : Logo}
              alt="Zendo Logo"
              fill
              priority
              quality={100}
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
            className="ml-6 group inline-flex items-center justify-center gap-3 rounded-[radius:var(--radius)] border border-[color:var(--jet)] bg-transparent px-4 py-2 transition-colors duration-300 text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] hover:text-[color:var(--text-light)] focus:text-[color:var(--text-light)]"
          >
            <Search
              size="1.2rem"
              className="transition-colors duration-300 group-hover:text-[color:var(--text-light)]"
            />
            <span className="flex items-center gap-2">
              <span className="font-[weight:var(--default-font-weight)] text-sm">
                Search...
              </span>
              <kbd className="text-xs font-[weight:var(--default-font-weight)] hidden md:inline-block font-[family-name:var(--font-code)] border border-[color:var(--jet)] px-2 py-0.5 rounded text-muted-foreground">
                {strippedOS === "mac" ? (
                  <span>&#x2318; K</span>
                ) : strippedOS === "windows" ? (
                  <span>CTRL K</span>
                ) : strippedOS === "phone" ? (
                  <span>PRESS</span>
                ) : !strippedOS ? (
                  <span>REFRESH</span>
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
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 top-15 bg-[color:var(--background)] dark:bg-[color:var(--background)] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] overflow-y-auto max-h-[calc(100vh-3.5rem)] p-6 font-[family-name:var(--font-text)] z-50"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{
              type: "tween",
              duration: 1,
              ease: "easeInOut",
            }}
          >
            <FocusTrap>
              <div>
                <div className="flex flex-col gap-6">
                  <div className="flex-1 overflow-y-auto">
                    <div className="mt-6 space-y-6">
                      <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Settings
                          size="2rem"
                          className="text-[color:var(--success)]"
                        />
                        Settings
                      </h1>

                      <hr className="border-[color:var(--jet)] opacity-40" />

                      <section>
                        <h3 className="text-lg uppercase tracking-wider text-muted-foreground font-[weight:var(--default-font-weight)]">
                          Links
                        </h3>
                        <div className="flex flex-col space-y-2 mt-2">
                          {["About", "Portfolio", "Projects", "Contact"].map(
                            (label) => (
                              <button
                                key={label}
                                onClick={() => {
                                  setOpen(false);
                                  setTimeout(
                                    () =>
                                      router.push(`/${label.toLowerCase()}`),
                                    500
                                  );
                                }}
                                className="text-left text-sm font-[weight:var(--default-font-weight)] hover:bg-[color:var(--primary-hover)] px-2 py-1 rounded-[radius:var(--radius)] transition-colors"
                              >
                                {label}
                              </button>
                            )
                          )}
                        </div>
                      </section>

                      <hr className="border-[color:var(--jet)] opacity-40" />

                      <div className="flex justify-center gap-4 flex-wrap">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="group">
                                <ModeToggle />
                                <TooltipContent className="text-sm">
                                  Toggle Theme
                                </TooltipContent>
                              </div>
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setOpen(false);
                                  setTimeout(() => router.push("/"), 500);
                                }}
                                className="hover:bg-[color:var(--primary-hover)] border border-[color:var(--jet)] px-4 py-2 rounded-[radius:var(--radius)] transition-colors"
                              >
                                <House size="1.2rem" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-sm">
                              Go Back Home
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="flex justify-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="group flex items-center gap-3 border border-[color:var(--jet)] px-4 py-2 rounded-[radius:var(--radius)] transition-colors
                        hover:bg-[color:var(--primary-hover)] hover:text-[color:var(--text-light)]"
                              >
                                <Search
                                  size="1.2rem"
                                  className="group-hover:text-[color:var(--text-light)] transition-colors"
                                />
                                <span className="font-[weight:var(--default-font-weight)] text-sm flex items-center gap-2">
                                  Find
                                  <kbd>
                                    {strippedOS === "mac" ? (
                                      <span>&#x2318; K</span>
                                    ) : strippedOS === "windows" ? (
                                      <span>CTRL K</span>
                                    ) : strippedOS === "phone" ? (
                                      <span>PRESS</span>
                                    ) : !strippedOS ? (
                                      <span>REFRESH</span>
                                    ) : null}
                                  </kbd>
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-sm">
                              Search
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FocusTrap>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
