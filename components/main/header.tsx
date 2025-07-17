/**
 * components/main/header.tsx
 * --------------------------
 *
 * Implements the main header for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ModeToggle } from "@/components/modules/modes";
import { Menu, X, Search, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { RxDividerVertical } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LogoBlack from "@/public/assets/LogoBlack.svg";
import LogoWhite from "@/public/assets/LogoWhite.svg";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMenuStore } from "@/store/menuStore";
import { useComponentLifecycle } from "@/hooks/useComponentLifecycle";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import SearchSkeleton from "@/components/skeletons/searchSkeleton";
import type { HeaderNavLink } from "@/lib/cache/header-cacher";
import HeaderNavLinks from "@/components/modules/headerNavLinks";
import { SiGithub } from "@icons-pack/react-simple-icons";

// Lazy load components only when needed
const MobileMenu = dynamic(() => import("@/components/modules/mobileMenu"), {
  ssr: false,
});

const SearchBar = dynamic(() => import("@/components/modules/search"), {
  ssr: false,
  loading: () => <SearchSkeleton />,
});

export default function Header({
  links,
  githubStars,
}: {
  links: HeaderNavLink[] | null;
  githubStars: string;
}) {
  const { setOpen, setOpenS, open, openS, strippedOS } = useMenuStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const shouldRenderMobileMenu = useComponentLifecycle(open);
  const shouldRenderSearchBar = useComponentLifecycle(openS);
  const handleOpenMenu = useCallback(() => setOpen(true), [setOpen]);
  const handleOpenSearch = useCallback(() => setOpenS(true), [setOpenS]);
  const handleBrandingImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleSkipNavigation = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const main = document.getElementById("main");
    if (main) {
      main.scrollIntoView({ behavior: "smooth" });
      main.focus();
    } else {
      console.error("Failed to find the main element on the page.");
    }
  }, []);

  // Memoize keyboard shortcut display (same as mobile menu)
  const keyboardShortcut = useMemo(() => {
    const srText =
      strippedOS === "mac"
        ? "Command key plus K"
        : strippedOS === "windows"
          ? "Control key plus K"
          : strippedOS === "phone"
            ? "Press to search"
            : "Please Refresh the Page";

    const displayText =
      strippedOS === "mac" ? (
        <>{"\u2318"} K</>
      ) : strippedOS === "windows" ? (
        <>CTRL K</>
      ) : strippedOS === "phone" ? (
        <>PRESS</>
      ) : (
        <>REFRESH</>
      );

    return { srText, displayText };
  }, [strippedOS]);

  const GITHUB_URL =
    process.env.NEXT_PUBLIC_GITHUB_SOURCE_CODE || "https://github.com/zendoasia/zendo";

  return (
    <>
      <header
        aria-label="Primary Header"
        className={cn(
          "sticky top-0 left-0 right-0 z-50 flex items-center border-0 border-b-[0.1rem] border-black dark:border-muted gap-y-2 backdrop-blur-md app-font min-h-0",
          "fixed br:w-full",
          "will-change-transform transform-gpu backface-hidden"
        )}
        style={{ height: "60px", minHeight: "60px", maxHeight: "60px" }}
      >
        <div className={cn("py-2.5 px-2.5 w-full flex items-center")}>
          <button
            onClick={handleSkipNavigation}
            className={cn(
              "sr-only",
              "focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50",
              "!p-1 rounded bg-primary shadow-lg transition button-scaler text-white dark:!text-black"
            )}
            tabIndex={0}
          >
            Skip to main content
          </button>

          <Button
            variant="ghost"
            asChild
            className={cn("flex items-center transition-colors bg-transparent duration-400")}
          >
            <Link key="logo-link" href="/" className="relative w-[140px] aspect-[140/30]">
              {!imageLoaded && <Skeleton className="absolute inset-0 w-full h-full rounded-full" />}

              <Image
                src={LogoBlack}
                alt="Zendo Logo Black"
                fill
                loading="lazy"
                onLoad={handleBrandingImageLoad}
                className={cn(
                  "absolute inset-0 object-contain transition-opacity duration-400",
                  "opacity-100",
                  "block dark:hidden"
                )}
              />
              <Image
                src={LogoWhite}
                alt="Zendo Logo White"
                fill
                loading="lazy"
                onLoad={handleBrandingImageLoad}
                className={cn(
                  "absolute inset-0 object-contain transition-opacity duration-400",
                  "opacity-100",
                  "hidden dark:block"
                )}
              />
            </Link>
          </Button>

          <RxDividerVertical
            className={cn(
              "accessibility-detail-color",
              "ml-3 hidden br:flex",
              "scale-y-210" // slightly scale vertically
            )}
            size="1.2rem"
          />

          <nav aria-label="Primary Navigation" className={cn("hidden br:flex items-center ")}>
            <HeaderNavLinks links={links} />
            <Button size="sm" variant="link" asChild>
              <Link
                href={GITHUB_URL}
                target="_blank"
                className="inline-flex items-center gap-1 hover:cursor-pointer text-sm"
              >
                <SiGithub size={16} />
                <span className="text-muted-foreground">{githubStars}</span>
                <ArrowUpRight
                  className="accessibility-detail-color relative -mt-3"
                  style={{ verticalAlign: "middle" }}
                />
              </Link>
            </Button>
          </nav>
          <div className={cn("flex-grow")} />
          <section
            aria-label="Secondary Navigation"
            className={cn(
              "hidden br:flex items-center app-gap br:ml-auto w-full br:w-auto justify-center br:justify-end"
            )}
          >
            <Button
              size="sm"
              onClick={handleOpenSearch}
              className={cn(
                "group inline-flex items-center justify-center button-scaler hover:cursor-pointer"
              )}
            >
              <Search size="1.2rem" />
              <span className={cn("flex items-center gap-3")}>
                <span className={cn("text-sm")}>Search</span>
                <kbd
                  className={cn(
                    "px-1.5 rounded bg-white dark:bg-black border border-border text-[10px] font-medium accessibility-detail-color backdrop-blur-md !text-xs app-font-mono"
                  )}
                >
                  <span className="text-black dark:text-white">
                    <span className="sr-only">{keyboardShortcut.srText}</span>
                    {keyboardShortcut.displayText}
                  </span>
                </kbd>
              </span>
            </Button>

            <ModeToggle />
          </section>

          <section className={cn("flex flex-col justify-center items-center ml-auto br:hidden")}>
            <Button
              aria-label="Mobile Menu Button"
              key="mobile-menu"
              onClick={handleOpenMenu}
              size="icon"
              className={cn(
                "flex justify-center items-center app-gap hover:cursor-pointer button-scaler br:hidden"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 1 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    <X size="1.2rem" aria-label="Close Mobile Menu" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed"
                    initial={{ rotate: -90, opacity: 1 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    <Menu size="1.2rem" aria-label="Open Mobile Menu" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </section>
        </div>
      </header>

      {shouldRenderMobileMenu && <MobileMenu githubStars={githubStars} />}
      {shouldRenderSearchBar && <SearchBar />}
    </>
  );
}
