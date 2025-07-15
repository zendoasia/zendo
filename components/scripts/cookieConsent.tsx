/**
 * components/scripts/cookieConsent.tsx
 * ------------------------------------
 *
 * Handles cookie consent and tracking consent.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

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

const COOKIE_CONSENT_COOKIE_NAME = "cookie_status";

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
    if (!Cookies.get(COOKIE_CONSENT_COOKIE_NAME)) {
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
    Cookies.set(COOKIE_CONSENT_COOKIE_NAME, "allow", { expires: 365 });
    closeBanner();
    window.dispatchEvent(new Event("cookie-consent-allow"));
  };

  const handleDeny = useCallback(() => {
    Cookies.set(COOKIE_CONSENT_COOKIE_NAME, "deny", { expires: 365 });
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
            className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-md"
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
              "rounded-[var(--radius)] p-5 -translate-x-1/2",
              "bg-[color:var(--background)]",
              "backdrop-blur-xl backdrop-saturate-150",
              "border border-[color:var(--border)]",
              "shadow-2xl shadow-black/10 dark:shadow-black/30",
              "flex flex-col gap-2 app-font"
            )}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="space-y-3">
                <TabsList className="grid w-full grid-cols-2 ">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="advance">Advanced</TabsTrigger>
                </TabsList>

                <div className="min-h-[120px]">
                  <TabsContent value="overview" className="mt-0">
                    <div className="text-base leading-relaxed">
                      We use cookies to enhance preferences and analyze site performance. We comply
                      with the{" "}
                      <Link
                        href="https://gdpr-info.eu/"
                        target="_blank"
                        data-no-prompt
                        className="underline underline-offset-2 transition-colors font-bold bg-clip-text text-transparent"
                        style={{
                          background:
                            "linear-gradient(132deg, rgb(59, 55, 106) 0.00%, rgb(0, 143, 186) 50.00%, rgb(255, 149, 213) 100.00%)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          color: "rgb(59, 55, 106)",
                          textDecorationColor: "rgb(59, 55, 106)",
                          textDecorationThickness: "2px",
                          textDecorationStyle: "solid",
                          textDecorationLine: "underline",
                        }}
                      >
                        GDPR
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="https://oag.ca.gov/privacy/ccpa"
                        target="_blank"
                        data-no-prompt
                        className="underline underline-offset-2 transition-colors font-bold bg-clip-text text-transparent"
                        style={{
                          background:
                            "linear-gradient(132deg, rgb(3, 148, 108) 0.00%, rgb(33, 35, 34) 100.00%)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          color: "rgb(3, 148, 108)",
                          textDecorationColor: "rgb(3, 148, 108)",
                          textDecorationThickness: "2px",
                          textDecorationStyle: "solid",
                          textDecorationLine: "underline",
                        }}
                      >
                        CCPA
                      </Link>{" "}
                      regulations and respect your privacy. We only collect data necessary for
                      analytics and performance monitoring.
                    </div>
                  </TabsContent>

                  <TabsContent value="advance" className="mt-0">
                    <div className="text-base leading-relaxed">
                      We use{" "}
                      <Link
                        href="https://support.google.com/analytics/answer/6004245"
                        target="_blank"
                        data-no-prompt
                        className="underline underline-offset-2 transition-colors font-bold bg-clip-text text-transparent"
                        style={{
                          background:
                            "linear-gradient(132deg, rgb(34, 181, 254) 0%, rgb(255, 186, 214) 100%)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          color: "rgb(34, 181, 254)",
                          textDecorationColor: "rgb(34, 181, 254)",
                          textDecorationThickness: "2px",
                          textDecorationStyle: "solid",
                          textDecorationLine: "underline",
                        }}
                      >
                        Google Analytics
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="https://www.cloudflare.com/privacypolicy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-no-prompt
                        className="underline underline-offset-2 transition-colors font-bold bg-clip-text text-transparent"
                        style={{
                          background:
                            "linear-gradient(132deg, rgb(255, 0, 0) 0%, rgb(255, 213, 0) 100%)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          color: "rgb(255, 94, 0)",
                          textDecorationColor: "rgb(255, 94, 0)",
                          textDecorationThickness: "2px",
                          textDecorationStyle: "solid",
                          textDecorationLine: "underline",
                        }}
                      >
                        Cloudflare Insights
                      </Link>{" "}
                      for analytics and performance monitoring. Please review their privacy policies
                      for more information.
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>

            <Separator className="my-2 bg-muted-foreground/40 dark:bg-muted-foreground/40" />

            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  onClick={handleAllow}
                  className={cn(
                    "flex items-center gap-2 font-medium transition-all duration-200",
                    "button-scaler hover:cursor-pointer",
                    "w-full sm:w-auto justify-center",
                    "bg-emerald-500 hover:bg-emerald-600 text-white"
                  )}
                  aria-label="Allow cookies"
                >
                  <Check size={16} />
                  Allow
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeny}
                  className={cn(
                    "flex items-center gap-2 font-medium transition-all duration-200",
                    "button-scaler hover:cursor-pointer",
                    "w-full sm:w-auto justify-center",
                    "!bg-red-500 !hover:bg-red-600 text-white"
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
                <Link href="/privacy" target="_blank" className="flex items-center gap-2">
                  <Info size={"1.2rem"} />
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
