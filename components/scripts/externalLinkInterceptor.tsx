/**
 * components/scripts/externalLinkInterceptor.tsx
 * ----------------------------------------------
 *
 * Intercepts external links and prompts the user to proceed.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

import { useEffect, useRef, useState } from "react";
import { Info, Check, X, OctagonAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function openExternalLinkManually({
  href,
  target = "_self",
  rel = "",
}: {
  href: string;
  target?: string;
  rel?: string;
}) {
  window.dispatchEvent(
    new CustomEvent("open-external-link", {
      detail: { href, target, rel },
    })
  );
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return isMobile;
}

export default function ExternalLinkInterceptor() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [linkHref, setLinkHref] = useState<string | null>(null);
  const linkElementRef = useRef<HTMLAnchorElement | null>(null);
  const isMobile = useIsMobile();
  const lastClickedUrlRef = useRef<string | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      const path = event.composedPath() as HTMLElement[];
      const anchor = path.find((el) => el instanceof HTMLAnchorElement) as
        | HTMLAnchorElement
        | undefined;

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      if (
        !href ||
        href.startsWith("/") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.hasAttribute("data-no-prompt")
      ) {
        return;
      }

      const linkOrigin = new URL(href, window.location.href).origin;
      if (linkOrigin === window.location.origin) return;

      event.preventDefault();
      event.stopPropagation();

      if (href === lastClickedUrlRef.current) {
        timeoutIdRef.current = setTimeout(() => {
          lastClickedUrlRef.current = null;
          setShowPrompt(true);
          setLinkHref(href);
          linkElementRef.current = anchor;
        }, 250);
      } else {
        lastClickedUrlRef.current = href;
        setShowPrompt(true);
        setLinkHref(href);
        linkElementRef.current = anchor;
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const proceed = () => {
    try {
      if (linkElementRef.current && linkHref) {
        const target = linkElementRef.current.getAttribute("target") || "_self";
        let rel = linkElementRef.current.getAttribute("rel") || "";

        if (target === "_blank" && !rel.includes("noopener")) {
          rel += " noopener noreferrer";
        }

        window.open(linkHref, target, rel);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Failed to open external link:", error);
    }
  };

  useEffect(() => {
    const handleCustomOpen = (e: CustomEvent<{ href: string; target?: string; rel?: string }>) => {
      const { href, target = "_self", rel = "" } = e.detail;

      const a = document.createElement("a");
      a.href = href;
      a.target = target;
      a.rel = rel;

      linkElementRef.current = a;
      setLinkHref(href);
      setShowPrompt(true);
    };

    window.addEventListener("open-external-link", handleCustomOpen as EventListener);
    return () =>
      window.removeEventListener("open-external-link", handleCustomOpen as EventListener);
  }, []);

  const stat = () => {
    if (linkHref?.startsWith("https://")) {
      return (
        <span className={cn("flex items-center gap-[1rem] text-black dark:text-white")}>
          <Check size={"1.2rem"} className={cn("text-[color:var(--success)] flex-shrink-0")} />
          <span className={cn("text-xs sm:text-sm flex flex-row items-center gap-2.5")}>
            HTTPS <ArrowRight size="1.2rem" className={cn("flex-shrink-0")} />
            <span
              className={cn("app-font-code break-all max-w-full overflow-hidden text-ellipsis")}
            >
              {linkHref}
            </span>
          </span>
        </span>
      );
    } else if (linkHref?.startsWith("http://")) {
      return (
        <span className={cn("flex items-center gap-[1rem] text-black  dark:text-white")}>
          <X size={"1.2rem"} className={cn("text-[color:var(--danger)] flex-shrink-0")} />
          <span className={cn("text-xs flex flex-row items-center gap-2.5")}>
            HTTP <ArrowRight size="1.2rem" className={cn("flex-shrink-0")} />
            <span
              className={cn("app-font-code break-all max-w-full overflow-hidden text-ellipsis")}
            >
              {linkHref}
            </span>
          </span>
        </span>
      );
    } else {
      return (
        <span className={cn("flex items-center gap-[1rem] text-black dark:text-white")}>
          <Info size={"1.2rem"} className={cn("text-[color:var(--warning)] flex-shrink-0")} />
          <span className={cn("text-xs flex flex-row items-center gap-2.5")}>
            Unknown <ArrowRight size="1.2rem" className={cn("flex-shrink-0")} />
            <span
              className={cn("app-font-code break-all max-w-full overflow-hidden text-ellipsis")}
            >
              {linkHref}
            </span>
          </span>
        </span>
      );
    }
  };

  return isMobile ? (
    <Drawer
      open={showPrompt}
      onOpenChange={setShowPrompt}
      aria-labelledby="external-link-alert"
      aria-describedby="external-link-description"
    >
      <DrawerContent
        className={cn(
          "flex flex-col items-center justify-center rounded px-4 pt-4 pb-6 transition-transform app-font"
        )}
      >
        <DrawerHeader className={cn("space-y-1")}>
          <DrawerTitle className={cn("flex items-center gap-[0.5rem] text-base")}>
            <OctagonAlert
              size="1.2rem"
              className={cn("text-destructive")}
              id="external-link-alert"
            />
            You&#39;re leaving our site
          </DrawerTitle>
          <DrawerDescription className={cn("text-md")} id="external-link-description">
            You&#39;re about to visit an external website not affiliated with us. Proceed only if
            you trust it.
          </DrawerDescription>
        </DrawerHeader>
        <div
          className={cn(
            "bg-muted rounded-lg px-4 py-2 text-foreground text-sm flex items-center gap-2 mt-2 w-full break-words"
          )}
        >
          {stat()}
        </div>

        <DrawerFooter className={cn("pt-4 flex flex-col sm:flex-row gap-1")}>
          <DrawerClose asChild>
            <Button size="sm" variant="secondary" className={cn("w-full sm:w-auto")}>
              Cancel
            </Button>
          </DrawerClose>
          <Button size="sm" onClick={proceed} className={cn("w-full sm:w-auto")}>
            Proceed
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <AlertDialog
      open={showPrompt}
      onOpenChange={setShowPrompt}
      aria-labelledby="external-link-alert"
      aria-describedby="external-link-description"
    >
      <AlertDialogContent
        className={cn(
          "rounded-[radius:var(--radius)] space-y-4 transition-transform font-[family-name:var(--font-text)]"
        )}
        aria-describedby="external-link-description"
      >
        <AlertDialogHeader id="external-link-alert">
          <AlertDialogTitle
            className={cn(
              "flex items-center gap-[0.5rem] text-lg font-[weight:var(--default-font-weight)] text-foreground"
            )}
          >
            <OctagonAlert size="1.2rem" className={cn("text-destructive")} />
            You&#39;re leaving our site
          </AlertDialogTitle>
          <AlertDialogDescription className={cn("text-md")} id="external-link-description">
            You&#39;re about to visit an external website. This link is not affiliated with or
            controlled by us. Continue only if you trust the source.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div
          className={cn(
            "bg-muted rounded-lg px-4 py-2 text-foreground text-sm flex items-center gap-2 mt-2 w-full break-words"
          )}
        >
          {stat()}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={proceed}>Proceed</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
