/**
 * components/modules/mobileMenu.tsx
 * ---------------------------------
 *
 * Implements the mobile menu for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modules/modes";
import Link from "next/link";
import { Home, Search, SquareMenu, ArrowUpRight, LoaderCircle } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useMenuStore } from "@/store/menuStore";
import { createPortal } from "react-dom";
import React, { useCallback, useMemo } from "react";
import { use as usePromise } from "react"; // React 19+ use() API
import { Suspense } from "react";
import type { NavSections } from "@/types";

let navLinksPromise: Promise<NavSections | { error: true }> | null = null;

function getNavLinksPromise(): Promise<NavSections | { error: true }> {
  if (!navLinksPromise) {
    navLinksPromise = fetch("/api/quick-links", {
      // Set cache to revalidate after 24 hours (86400 seconds)
      next: { revalidate: 86400 },
    })
      .then<NavSections | { error: true }>(async (res) => {
        if (!res.ok) return { error: true };
        const data = await res.json().then((json) => json.data);
        if (!data || typeof data !== "object") return { error: true };

        const sections: NavSections = {};

        for (const [section, items] of Object.entries(data)) {
          if (!Array.isArray(items)) continue;
          sections[section] = items
            .map((item: { label?: unknown; path?: unknown }) =>
              typeof item.label === "string" && typeof item.path === "string"
                ? { label: item.label, path: item.path }
                : null
            )
            .filter(Boolean) as { label: string; path: string }[];
        }

        return sections;
      })
      .catch(() => ({ error: true }));
  }
  return navLinksPromise ?? Promise.resolve({ error: true });
}

function useNavLinks(): NavSections | { error: true } {
  return usePromise(getNavLinksPromise());
}

function MobileMenuNavLinksContent({ onNavigate }: { onNavigate: (_path: string) => void }) {
  const navItems = useNavLinks();
  const hasLinks =
    Object.keys(navItems).length > 0 &&
    Object.values(navItems).some((links) => Array.isArray(links) && links.length > 0);
  if (typeof window !== "undefined" && !hasLinks) {
    return (
      <div className="text-destructive text-center p-4 text-balance leading-relaxed">
        Could not fetch quick links. Please try again later or contact support.
      </div>
    );
  }
  if (!hasLinks) {
    // On the server or first render, let Suspense fallback handle loading
    return null;
  }
  return (
    <Accordion type="multiple" defaultValue={Object.keys(navItems)}>
      {Object.entries(navItems).map(([sectionKey, sectionLinks]) => (
        <AccordionItem key={sectionKey} value={sectionKey}>
          <AccordionTrigger
            className={cn(
              "app-font-mono !text-xs text-muted-foreground tracking-widest font-bold flex items-center gap-2 overflow-hidden"
            )}
          >
            <span className="relative inline-block">
              <span className="text-balance leading-relaxed text-black dark:text-white">
                {sectionKey.toUpperCase()}
              </span>
              <span
                className="block h-0.5 bg-muted-foreground/40 mt-1 rounded mx-auto"
                style={{ width: "min(6rem, 100%)" }}
                aria-hidden="true"
              />
            </span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col app-gap">
            {Array.isArray(sectionLinks) &&
              sectionLinks.map(({ label, path }) => (
                <Button
                  key={label}
                  size="lg"
                  className="justify-start text-base text-balance leading-relaxed flex-row button-scaler hover:cursor-pointer"
                  asChild
                >
                  <Link href={path} onClick={() => onNavigate(path)} scroll>
                    {label}
                  </Link>
                </Button>
              ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function MobileMenuNavLinks({ onNavigate }: { onNavigate: (_path: string) => void }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full p-4">
          <LoaderCircle className="animate-spin text-muted-foreground" size={24} />
        </div>
      }
    >
      <MobileMenuNavLinksContent onNavigate={onNavigate} />
    </Suspense>
  );
}

const MobileMenu = React.memo(function MobileMenu() {
  const { open, setOpen, setOpenS, strippedOS } = useMenuStore();
  const router = useRouter();

  const handleNavigate = useCallback(
    (path: string) => {
      setOpen(false);
      // Fix: Reset navLinksPromise on navigation to allow refetch if needed
      navLinksPromise = null;
      setTimeout(() => router.push(path), 250);
    },
    [setOpen, router]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
    },
    [setOpen]
  );

  const handleHomeClick = useCallback(() => {
    setOpen(false);
    navLinksPromise = null;
    setTimeout(() => router.push("/"), 250);
  }, [setOpen, router]);

  const handleSearchClick = useCallback(() => setOpenS(true), [setOpenS]);

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

  return createPortal(
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        aria-label="Mobile Menu"
        side="left"
        className={cn(
          "z-50 border-r border-b border-t border-black dark:border-muted rounded-r-xl p-0 app-font flex flex-col h-full",
          "w-[85%] max-w-xs sm:w-[60%] md:w-[50%]",
          "transition-all duration-200 ease-in-out transform-gpu will-change-transform backface-hidden"
        )}
      >
        <div className="flex flex-col px-[1.2rem] pt-4 pb-1">
          <div className="flex items-center gap-1">
            <SquareMenu size="1.25rem" className="text-emerald-700 dark:text-emerald-500" />
            <SheetTitle
              className={cn(
                "font-medium text-base",
                "sm:text-lg sm:font-semibold",
                "md:text-xl md:font-bold"
              )}
            >
              Quick Access
            </SheetTitle>
          </div>
          <p className="text-md text-unimportant mt-1">Important Links And Tools</p>
        </div>

        <Separator className="my-2 bg-muted-foreground/40 dark:bg-muted-foreground/40" />

        <nav
          className="flex-1 overflow-y-auto px-[1.2rem] scroll-smooth no-scrollbar mt-0"
          aria-label="Primary Navigation"
        >
          <MobileMenuNavLinks onNavigate={handleNavigate} />
        </nav>

        <Separator className="my-2 bg-muted-foreground/40 dark:bg-muted-foreground/40" />

        <section className="px-[0.7rem] pt-[1.5rem] py-[0.7rem] flex flex-col gap-4 mt-auto pb-[1.5rem]">
          <Button
            size="sm"
            onClick={handleSearchClick}
            className="group items-center inline-flex justify-start button-scaler hover:cursor-pointer overflow-hidden"
          >
            <Search size="1.2rem" />
            <span className="text-sm">Search</span>
            <kbd className="px-1.5 py-[2px] rounded border border-border text-[10px] font-medium font-mono !text-xs app-font-mono ml-auto bg-white dark:bg-black accessibility-detail-color backdrop-blur-md">
              <span className="text-black dark:text-white">
                <span className="sr-only">{keyboardShortcut.srText}</span>
                {keyboardShortcut.displayText}
              </span>
            </kbd>
          </Button>

          <Button size="sm" className="hover:cursor-pointer button-scaler overflow-hidden" asChild>
            <Link target="_blank" href={process.env.NEXT_PUBLIC_GITHUB_SOURCE_CODE as string}>
              <span className="inline-flex items-center gap-1 relative">
                <SiGithub size="1.2rem" className="accessibility-detail-color" />
                <span className="relative">
                  GitHub
                  <span
                    className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-current rounded"
                    style={{ opacity: 0.6 }}
                  />
                </span>
                <ArrowUpRight
                  className="accessibility-detail-color relative -mt-3"
                  style={{ verticalAlign: "middle" }}
                />
              </span>
            </Link>
          </Button>

          <div className="flex justify-between">
            <ModeToggle />
            <Button
              key="home-page"
              data-no-prompt
              size="sm"
              onClick={handleHomeClick}
              className="hover:cursor-pointer button-scaler overflow-hidden"
            >
              <div className="flex items-center justify-center">
                <span className="sr-only">Home page</span>
                <Home size="1.2rem" />
              </div>
            </Button>
          </div>
        </section>
      </SheetContent>
    </Sheet>,
    document.getElementById("portal-root") || document.body
  );
});

export default MobileMenu;
