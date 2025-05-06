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

export function openExternalLinkManually(href: string) {
  window.dispatchEvent(
    new CustomEvent("open-external-link", { detail: { href } })
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
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

      linkElementRef.current = anchor;
      setLinkHref(href);
      setShowPrompt(true);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const proceed = () => {
    if (linkElementRef.current && linkHref) {
      const target = linkElementRef.current.getAttribute("target") || "_self";
      const rel = linkElementRef.current.getAttribute("rel") || "";

      window.open(linkHref, target, rel);
      setShowPrompt(false);
    }
  };

  useEffect(() => {
    const handleCustomOpen = (e: CustomEvent<{ href: string }>) => {
      setLinkHref(e.detail.href);
      setShowPrompt(true);
    };

    window.addEventListener(
      "open-external-link",
      handleCustomOpen as EventListener
    );

    return () =>
      window.removeEventListener(
        "open-external-link",
        handleCustomOpen as EventListener
      );
  }, []);

  if (!mounted) return null; // Prevents hydration error

  const stat = () => {
    if (linkHref?.includes("https://")) {
      return (
        <span className="flex items-center gap-[1rem] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)]">
          <Check size="1.2rem" className="text-[color:var(--success)]" />
          <span className="text-xs sm:text-sm flex flex-row items-center gap-2.5">
            HTTPS <ArrowRight size="1.2rem" />
            <span className="font-[family-name:var(--font-code)] break-all max-w-full overflow-hidden text-ellipsis">
              {linkHref}
            </span>
          </span>
        </span>
      );
    } else if (linkHref?.includes("http://")) {
      return (
        <span className="flex items-center gap-[1rem] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)]">
          <X size="1.2rem" className="text-[color:var(--danger)]" />
          <span className="text-xs sm:text-sm flex flex-row items-center gap-2.5">
            HTTP <ArrowRight size="1.2rem" />
            <span className="font-[family-name:var(--font-code)] break-all max-w-full overflow-hidden text-ellipsis">
              {linkHref}
            </span>
          </span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-[1rem] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)]">
          <Info size="1.2rem" className="text-[color:var(--warning)]" />
          <span className="text-xs sm:text-sm flex flex-row items-center gap-2.5">
            Unknown <ArrowRight size="1.2rem" />
            <span className="font-[family-name:var(--font-code)] break-all max-w-full overflow-hidden text-ellipsis">
              {linkHref}
            </span>
          </span>
        </span>
      );
    }
  };

  // ————————————————————————————————————————
  // 🖥️ DESKTOP: AlertDialog
  // 📱 MOBILE: Drawer(a drawer is a better for UX)
  // ————————————————————————————————————————

  return isMobile ? (
    <Drawer open={showPrompt} onOpenChange={setShowPrompt}>
      <DrawerContent
        className={`flex flex-col items-center justify-center rounded-2xl px-4 pt-4 pb-6 transition-transform font-[family-name:var(--font-text)]`}
      >
        <DrawerHeader className="space-y-1">
          <DrawerTitle className="flex items-center gap-[0.5rem] text-base font-semibold">
            <OctagonAlert size="1.2rem" className="text-destructive" />
            You&#39;re leaving our site
          </DrawerTitle>
          <DrawerDescription className="text-md">
            You&#39;re about to visit an external website not affiliated with
            us. Proceed only if you trust it.
          </DrawerDescription>
        </DrawerHeader>
        <div className="bg-muted p-[1.2rem] rounded-2xl text-foreground text-sm flex items-center gap-2 mt-2 max-w-full sm:max-w-[calc(100%-2rem)] md:max-w-[calc(100%-3rem)]">
          {stat()}
        </div>

        <DrawerFooter className="pt-4 flex flex-col sm:flex-row gap-[0.5rem]">
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DrawerClose>
          <Button type="button" onClick={proceed} className="w-full sm:w-auto">
            Proceed
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <AlertDialog open={showPrompt} onOpenChange={setShowPrompt}>
      <AlertDialogContent
        className={`rounded-2xl space-y-4 transition-transform font-[family-name:var(--font-text)]`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-[0.5rem] text-lg font-semibold text-foreground">
            <OctagonAlert size="1.2rem" className="text-destructive" />
            You&#39;re leaving our site
          </AlertDialogTitle>
          <AlertDialogDescription className="text-md">
            You&#39;re about to visit an external website. This link is not
            affiliated with or controlled by us. Continue only if you trust the
            source.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="bg-muted p-[1.2rem] rounded-3xl">{stat()}</div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={proceed}>Proceed</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
