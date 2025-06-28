"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const COOKIE_NAME = "are_cookies_allowed";

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const bannerRef = useRef<HTMLDivElement>(null);
  const EXIT_ANIMATION_DURATION = 400;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!Cookies.get(COOKIE_NAME)) {
      (async () => {
        await new Promise((res) => setTimeout(res, 2000));
        setVisible(true);
        setShouldRender(true);
      })();
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    document.body.classList.add("cookie-consent-active");
    document.body.style.overflow = "hidden";

    const mainSelectors = [
      `div#${process.env.NEXT_PUBLIC_APP_ID}`,
      "main",
      "[role='main']",
      "header",
      "nav",
      "aside",
      ".header",
      ".navigation",
      ".sidebar",
      ".content",
      "#__next > *:not([data-cookie-consent])",
      "#root > *:not([data-cookie-consent])",
    ];

    const elementsToHide: Element[] = [];

    mainSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (!element.closest("[data-cookie-consent]")) {
          element.setAttribute("aria-hidden", "true");
          element.setAttribute("data-cookie-hidden", "true");
          elementsToHide.push(element);
        }
      });
    });

    const style = document.createElement("style");
    style.id = "cookie-consent-styles";
    style.textContent = `
      .cookie-consent-active *:not([data-cookie-consent] *):not([data-cookie-consent]) {
        pointer-events: none !important;
      }
      [data-cookie-consent] * {
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.classList.remove("cookie-consent-active");
      document.body.style.overflow = "";

      elementsToHide.forEach((element) => {
        element.removeAttribute("aria-hidden");
        element.removeAttribute("data-cookie-hidden");
      });

      const styleElement = document.getElementById("cookie-consent-styles");
      styleElement?.remove();
    };
  }, [visible]);

  const closeBanner = () => {
    setVisible(false);
    setTimeout(() => setShouldRender(false), EXIT_ANIMATION_DURATION);
  };

  const handleAllow = () => {
    Cookies.set(COOKIE_NAME, "allow", { expires: 365 });
    closeBanner();
    window.dispatchEvent(new Event("cookie-consent-allow"));
  };

  const handleDeny = useCallback(() => {
    Cookies.set(COOKIE_NAME, "deny", { expires: 365 });
    closeBanner();
    window.dispatchEvent(new Event("cookie-consent-deny"));
  }, []);

  useEffect(() => {
    if (!visible) return;

    const backgroundFocusable = document.querySelectorAll<HTMLElement>(
      'button:not([data-cookie-consent] *), a:not([data-cookie-consent] *), input:not([data-cookie-consent] *), select:not([data-cookie-consent] *), textarea:not([data-cookie-consent] *), [tabindex]:not([tabindex="-1"]):not([data-cookie-consent] *)'
    );

    const originalTabIndexes = new Map<HTMLElement, string | null>();

    backgroundFocusable.forEach((element) => {
      originalTabIndexes.set(element, element.getAttribute("tabindex"));
      element.setAttribute("tabindex", "-1");
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusableElements = bannerRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const focusableArray = Array.from(focusableElements);
        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }

      if (e.key === "Escape") {
        handleDeny();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = setTimeout(() => {
      const firstFocusable = bannerRef.current?.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );
      firstFocusable?.focus();
    }, 150);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(focusTimer);

      // Restore original tabindex values
      backgroundFocusable.forEach((element) => {
        const originalValue = originalTabIndexes.get(element);
        if (originalValue === null || originalValue === undefined) {
          element.removeAttribute("tabindex");
        } else {
          element.setAttribute("tabindex", originalValue);
        }
      });
    };
  }, [visible, activeTab, handleDeny]);

  if (!mounted) return null;
  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
            data-cookie-consent
            aria-hidden="true"
          />

          <motion.div
            ref={bannerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Cookie consent"
            data-cookie-consent
            initial={{ opacity: 0, y: 48, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 48, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed bottom-6 left-1/2 z-[10000] w-[95vw] max-w-lg",
              "rounded-2xl p-6 -translate-x-1/2",
              "bg-white/95 dark:bg-zinc-900/95",
              "backdrop-blur-xl backdrop-saturate-150",
              "border border-zinc-200/50 dark:border-zinc-700/50",
              "shadow-2xl shadow-black/10 dark:shadow-black/30",
              "flex flex-col gap-4 app-font"
            )}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="space-y-3">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-zinc-800">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="advance"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700"
                  >
                    Advanced
                  </TabsTrigger>
                </TabsList>

                <div className="min-h-[120px]">
                  <TabsContent value="overview" className="mt-0">
                    <div className="text-base leading-relaxed">
                      We use cookies for preferences and analytics. You can check what we really use
                      in the Advanced tab. To access this website, please make a choice on whether
                      to allow cookies or not.
                    </div>
                  </TabsContent>

                  <TabsContent value="advance" className="mt-0">
                    <div className="text-base leading-relaxed">
                      We use{" "}
                      <Link
                        href="https://support.google.com/analytics/answer/6004245"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
                      >
                        Google Analytics
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="https://www.cloudflare.com/privacypolicy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
                      >
                        Cloudflare Insights
                      </Link>{" "}
                      for analytics and performance monitoring. For more details on what data is
                      collected, please refer to our privacy policy.
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>

            <Separator className="bg-zinc-200 dark:bg-zinc-700" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  onClick={handleAllow}
                  className={cn(
                    "flex items-center gap-2 font-medium transition-all duration-200",
                    "bg-emerald-600 hover:bg-emerald-700 text-white",
                    "focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                    "dark:bg-emerald-600 dark:hover:bg-emerald-700",
                    "dark:focus:ring-emerald-400 dark:focus:ring-offset-zinc-900",
                    "shadow-sm hover:shadow-md",
                    "w-full sm:w-auto justify-center"
                  )}
                  aria-label="Allow cookies"
                >
                  <Check size={16} />
                  Allow
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDeny}
                  className={cn(
                    "flex items-center gap-2 font-medium transition-all duration-200",
                    "border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300",
                    "focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                    "dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:border-red-700",
                    "dark:focus:ring-red-400 dark:focus:ring-offset-zinc-900",
                    "w-full sm:w-auto justify-center"
                  )}
                  aria-label="Deny cookies"
                >
                  <X size={16} />
                  Deny
                </Button>
              </div>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800",
                  "transition-colors duration-200",
                  "w-full sm:w-auto justify-center"
                )}
              >
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Info size={16} />
                  Privacy Policy
                </Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
