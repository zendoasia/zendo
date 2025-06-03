"use client";

import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
              "fixed bottom-6 left-1/2 z-[10000] w-[95vw] max-w-xl -translate-x-1/2 rounded-2xl p-5 backdrop-blur-lg",
              "flex flex-col gap-2 app-font glassmorphism",
              "bg-white/95 border-gray-200/60 shadow-lg shadow-indigo-500/10",
              "dark:bg-zinc-900/70 dark:border-white/20 dark:shadow-2xl dark:shadow-indigo-500/20"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center w-full gap-3 justify-between app-font">
              <span className="text-base flex-1 font-medium text-gray-800 dark:text-zinc-100">
                We use cookies for preferences and analytics (Google Analytics, Tag Manager).
              </span>

              <div className="flex gap-2 mt-1 sm:mt-0">
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
            </div>
            <div className="flex justify-end mt-1">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
