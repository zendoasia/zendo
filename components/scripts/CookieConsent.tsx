"use client";

import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const COOKIE_NAME = "cookie_consent_status";

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const EXIT_ANIMATION_DURATION = 400;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!Cookies.get(COOKIE_NAME)) {
      setVisible(true);
      setShouldRender(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    document.body.classList.add("cookie-consent-active");
    document.body.style.overflow = "hidden";

    const mainSelectors = [
      "div#c301e48c-ae4c-4061-b1f9-d4f64d85d4dc",
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

    // Add pointer-events: none to prevent clicks on background elements
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

    // Simple focus trap - much more reliable than libraries
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusableElements = bannerRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Focus first interactive element
    setTimeout(() => {
      const firstFocusable = bannerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }, 100);

    return () => {
      document.body.classList.remove("cookie-consent-active");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);

      // Remove aria-hidden from elements
      elementsToHide.forEach((element) => {
        element.removeAttribute("aria-hidden");
        element.removeAttribute("data-cookie-hidden");
      });

      // Remove styles
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

  const handleDeny = () => {
    Cookies.set(COOKIE_NAME, "deny", { expires: 365 });
    closeBanner();
    window.dispatchEvent(new Event("cookie-consent-deny"));
  };

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
            className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm"
            data-cookie-consent
            aria-hidden="true"
          />

          <motion.div
            ref={bannerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Cookie consent"
            data-cookie-consent
            initial={{ opacity: 0, y: 48, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 48, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 32, duration: 0.38 }}
            className={cn(
              "fixed bottom-6 left-1/2 z-[10000] w-[95vw] max-w-xl min-w-[340px] min-h-[260px] h-[320px] -translate-x-1/2 rounded-2xl p-5 backdrop-blur-lg",
              "flex flex-col app-font glassmorphism",
              "bg-white/95 border-gray-200/60 shadow-lg shadow-indigo-500/10",
              "dark:bg-zinc-900/70 dark:border-white/20 dark:shadow-2xl dark:shadow-indigo-500/20"
            )}
          >
            {/* Tabs header */}
            <Tabs defaultValue="overview" className="w-full h-full flex flex-col flex-1">
              <div>
                <TabsList className="mb-0 w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="advance">Advance</TabsTrigger>
                </TabsList>
                <Separator className="my-2" />
              </div>
              <div className="flex-1 flex flex-col justify-between min-h-[140px]">
                <div className="flex-1">
                  <TabsContent value="overview">
                    <div className="text-base font-medium text-gray-800 dark:text-zinc-100">
                      We use cookies for preferences and analytics. You can check what we really use
                      in the
                      <span
                        className="font-semibold ml-1 mr-1 "
                        style={{
                          background:
                            "linear-gradient(132deg, rgb(2, 106, 122) 0.00%, rgb(242, 78, 163) 100.00%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          color: "transparent",
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        Advance
                        <span
                          aria-hidden={true}
                          style={{
                            content: "''",
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: "2px",
                            background:
                              "linear-gradient(132deg, rgb(0,255,157) 0%, rgb(227,43,175) 100%)",
                            borderRadius: "2px",
                            width: "100%",
                            display: "block",
                          }}
                        />
                      </span>
                      tab.
                    </div>
                  </TabsContent>
                  <TabsContent value="advance">
                    <div className="text-base font-medium text-gray-800 dark:text-zinc-100">
                      We use
                      <span
                        className="font-semibold ml-1 mr-1"
                        style={{
                          background:
                            "linear-gradient(132deg, rgb(0,255,157) 0%, rgb(227,43,175) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          color: "transparent",
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        Google Analytics
                        <span
                          aria-hidden={true}
                          style={{
                            content: "''",
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: "2px",
                            background:
                              "linear-gradient(132deg, rgb(0,255,157) 0%, rgb(227,43,175) 100%)",
                            borderRadius: "2px",
                            width: "100%",
                            display: "block",
                          }}
                        />
                      </span>
                      and
                      <span
                        className="font-semibold ml-1"
                        style={{
                          background:
                            "linear-gradient(132deg, rgb(250,170,0) 0%, rgb(237,19,19) 50%, rgb(213,74,255) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          color: "transparent",
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        Cloudflare Insights
                        <span
                          aria-hidden={true}
                          style={{
                            content: "''",
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: "2px",
                            background:
                              "linear-gradient(132deg, rgb(250,170,0) 0%, rgb(237,19,19) 50%, rgb(213,74,255) 100%)",
                            borderRadius: "2px",
                            width: "100%",
                            display: "block",
                          }}
                        />
                      </span>
                      for analytics and performance monitoring. For more details on what data is
                      collected, please refer to our privacy policy.
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-center">
                      <span className="text-md text-gray-600 dark:text-zinc-300 mt-2 text-center">
                        NO PERSONAL DATA IS COLLECTED, SOLD, OR USED IN ANY WAY.
                      </span>
                    </div>
                  </TabsContent>
                </div>
                <div className="flex items-center justify-between mt-6 w-full">
                  <div className="flex-1 flex justify-start gap-3">
                    <Button
                      size="sm"
                      variant="default"
                      className={cn(
                        "flex app-font-space items-center gap-1 font-semibold shadow-sm transition-all duration-200",
                        "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                        "dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500 dark:focus:ring-offset-zinc-900"
                      )}
                      onClick={handleAllow}
                      aria-label="Allow cookies"
                    >
                      <CheckCircle size="1.2rem" className="text-white" /> Allow
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className={cn(
                        "flex app-font-space items-center gap-1 font-semibold shadow-sm transition-all duration-200",
                        "bg-red-500 hover:bg-red-600 text-white border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                        "dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-600 dark:focus:ring-red-500 dark:focus:ring-offset-zinc-900"
                      )}
                      onClick={handleDeny}
                      aria-label="Deny cookies"
                    >
                      <XCircle size="1.2rem" className="text-white" /> Deny
                    </Button>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <Button
                      asChild
                      variant="link"
                      size="sm"
                      className={cn(
                        "app-font px-0 transition-colors duration-200 underline rounded-lg",
                        "text-indigo-600 hover:text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm",
                        "dark:text-indigo-400 dark:hover:text-indigo-300 dark:focus:ring-indigo-400 dark:focus:ring-offset-zinc-900"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Check
                          aria-hidden="true"
                          size="1.2rem"
                          className="text-emerald-600 dark:text-green-500"
                        />
                        <Link
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Privacy Policy"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
