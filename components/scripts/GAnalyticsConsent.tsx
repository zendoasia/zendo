"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";

const GA_ID = "G-RNN756TW7T";
const GA_COOKIE_PREFIXES = ["_ga", "_gid", "_gat", "_gcl_", "_gat_gtag", "_gat_UA-"];

function removeScript(id: string) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function removeGACookies() {
  // Remove all known GA cookies
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name] = cookie.split("=");
    if (GA_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) {
      Cookies.remove(name, { path: "/" });
      Cookies.remove(name);
    }
  }
}

function removeGASnippets() {
  removeScript("ga-script");
  removeScript("ga-init");
  // Remove any gtag scripts by src as fallback
  document.querySelectorAll('script[src*="google-analytics"]').forEach((el) => el.remove());
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GAnalyticsConsent() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  useEffect(() => {
    let gaLoaded = false;
    let initialPageviewSent = false;
    const consent = Cookies.get("cookie_consent_status");
    let gaScriptEl: HTMLScriptElement | null = null;

    function sendInitialPageview() {
      if (window.gtag && !initialPageviewSent) {
        window.gtag("event", "page_view", {
          page_path: window.location.pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
        initialPageviewSent = true;
      }
    }

    function injectGAScriptAndInit() {
      if (document.getElementById("ga-script")) return;
      // 1. Inject the gtag.js loader
      gaScriptEl = document.createElement("script");
      gaScriptEl.id = "ga-script";
      gaScriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      gaScriptEl.async = true;
      document.head.appendChild(gaScriptEl);
      // 2. Inject the GA initialization inline script (as Google recommends)
      const inlineScript = document.createElement("script");
      inlineScript.id = "ga-init";
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `;
      document.head.appendChild(inlineScript);
      // 3. Send initial pageview after gtag is available
      const interval = setInterval(() => {
        if (window.gtag) {
          sendInitialPageview();
          clearInterval(interval);
        }
      }, 100);
      setTimeout(() => clearInterval(interval), 5000);
    }

    function enableAnalytics() {
      if (!gaLoaded) {
        injectGAScriptAndInit();
        gaLoaded = true;
      }
    }

    function handleDeny() {
      removeGASnippets();
      removeGACookies();
      if (window.gtag) delete window.gtag;
      if (window.dataLayer) window.dataLayer = [];
      gaLoaded = false;
      initialPageviewSent = false;
      if (gaScriptEl) gaScriptEl.remove();
    }

    window.addEventListener("cookie-consent-allow", enableAnalytics);
    window.addEventListener("cookie-consent-deny", handleDeny);

    // On mount, check cookie and act accordingly
    if (consent === "allow") {
      enableAnalytics();
    } else if (consent === "deny") {
      handleDeny();
    }

    return () => {
      window.removeEventListener("cookie-consent-allow", enableAnalytics);
      window.removeEventListener("cookie-consent-deny", handleDeny);
      if (gaScriptEl) gaScriptEl.remove();
    };
  }, [pathname]);
  return null;
}
