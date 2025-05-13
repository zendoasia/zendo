"use client";

import { useEffect, useState, useMemo } from "react";
import { ModeToggle } from "@/components/modules/modes";
import { Menu, X, Search } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LogoDark from "@/public/assets/LogoDark.svg";
import Logo from "@/public/assets/Logo.svg";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { detectOS, stripOS } from "@/lib/utils";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const LazyMobileMenu = dynamic(
  () => import("@/components/modules/mobileMenu"),
  {
    loading: () => null,
    ssr: false,
  }
);

const LazySearchBar = dynamic(() => import("@/components/modules/search"), {
  loading: () => null,
  ssr: false,
});

export default function Header() {
  const os = useMemo(() => detectOS(), []);
  const strippedOS = useMemo(() => {
    return stripOS(os);
  }, [os]);

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openS) {
          setOpenS(false);
          return;
        }
        if (open) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openS]);

  useEffect(() => {
    const downS = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) {
          setOpen(false);
        } else {
          setOpenS((prev) => !prev);
        }
      }
    };

    document.addEventListener("keydown", downS);
    return () => document.removeEventListener("keydown", downS);
  }, [open, openS]);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark" || currentTheme === "system";

  return (
    <>
      <header
        aria-label="Primary Header"
        className={cn(
          "sticky top-0 z-50 flex flex-wrap items-center border-0 border-b-[0.1rem] px-4 py-2.5 gap-y-2 backdrop-blur-md app-font"
        )}
      >
        <Button
          aria-label="Skip Navigation"
          variant="ghost"
          asChild
          className={cn(
            "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 nav-btn px-4 py-2.5 rounded-[var(--radius)]"
          )}
        >
          <Link
            aria-label="Skip to main content"
            href="#main"
            onClick={(e) => {
              e.preventDefault();
              const main = document.getElementById("main");
              if (main) {
                main.scrollIntoView({ behavior: "smooth" });
                main.focus();
              }
            }}
            className={cn("w-full h-full flex items-center justify-center")}
          >
            Skip Navigation
          </Link>
        </Button>

        <Button
          variant="ghost"
          asChild
          className={cn(
            "flex items-center transition-colors bg-transparent duration-400"
          )}
        >
          <Link
            key="logo-link"
            href="/"
            className={cn("relative w-[140px] aspect-[140/30]")}
          >
            {!imageLoaded && (
              <Skeleton
                key="logo-skeleton"
                className={cn("absolute inset-0 w-full h-full rounded-full")}
              />
            )}

            <Image
              key="logo-image"
              src={isDark ? LogoDark : Logo}
              alt="Zendo Logo SVG"
              fill
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={cn(
                "object-contain transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </Link>
        </Button>

        <nav
          aria-label="Primary Navigation and Inter-Links"
          className={cn(
            "hidden min-[864px]:flex items-center gap-[0.5rem] ml-7"
          )}
        >
          {["About", "Portfolio", "Projects", "Contact"].map((label) => (
            <Button
              key={label}
              variant="ghost"
              className={cn("nav-btn")}
              asChild
            >
              <Link href={`/${label.toLowerCase()}`}>{label}</Link>
            </Button>
          ))}
        </nav>

        <div className={cn("flex-grow")} />

        <aside
          aria-label="Secondary Navigation - Search and themes"
          className={cn(
            "hidden min-[864px]:flex items-center app-gap min-[866px]:ml-auto w-full min-[864px]:w-auto justify-center min-[866px]:justify-end"
          )}
        >
          <Button
            variant="ghost"
            onClick={() => setOpenS(true)}
            className={cn(
              "ml-6 group inline-flex items-center justify-center gap-3 nav-btn"
            )}
          >
            <Search
              size="1.2rem"
              className={cn("dark:text-white text-black")}
            />
            <span className={cn("flex items-center gap-5")}>
              <span className={cn("text-sm dark:text-white text-black")}>
                Search
              </span>
              <kbd
                aria-label="Search Bar Shortcut"
                className={cn(
                  "text-xs min-[864px]:inline-block app-font-code border app-border px-2 py-0.5 rounded-[var(--radius)] text-muted-foreground"
                )}
              >
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

          <Button
            variant="ghost"
            className={cn("nav-btn")}
            asChild
            key="github-repository"
          >
            <Link href="https://github.com/aarush0101/zendo" target="_blank">
              <span className="flex items-center justify-center">
                <span className="sr-only">GitHub Repository</span>
                <SiGithub size="1.2rem" />
              </span>
            </Link>
          </Button>

          <ModeToggle />
        </aside>

        <span
          className={cn("flex flex-col justify-center items-center ml-2 mr-2")}
        >
          <Button
            aria-label="Mobile Menu Button"
            key="mobile-menu"
            onClick={() => {
              setOpen(!open);
            }}
            variant="ghost"
            size="icon"
            className={cn(
              "flex justify-center items-center p-2 gap-[0.5rem] nav-btn min-[864px]:hidden"
            )}
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
                  <X size="1.2rem" aria-label="Close Mobile Menu Icon" />
                </motion.div>
              ) : (
                <motion.div
                  key="closed"
                  initial={{ rotate: -90, opacity: 1 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Menu size="1.2rem" aria-label="Open Mobile Menu Icon" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </span>
      </header>

      {open && (
        <LazyMobileMenu
          setOpenAction={setOpen}
          setOpenSAction={setOpenS}
          strippedOS={strippedOS}
        />
      )}

      {openS && <LazySearchBar setOpenSAction={setOpenS} />}
    </>
  );
}
