"use client";

import { useEffect, useState } from "react";
import { isIOS, isMacOS, isSafari } from "@/lib/utils";
import { IOSInstallDialog } from "@/components/pwa/iosInstallDialog";
import sendToast from "@/components/modules/toast";
import type { BeforeInstallPromptEvent } from "@/types";
import { Button } from "@/components/ui/button";

export default function PWAInstallDetector() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSDialog, setShowIOSDialog] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isInApp =
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      const isInstalled = isStandalone || isInApp;
      setIsInstalled(isInstalled);
      return isInstalled;
    };

    const installed = checkIfInstalled();

    // Initialize session manager for Safari install guidance
    const initializeSessionManager = async () => {
      if (installed) return;
      if (!isSafari() || (!isIOS() && !isMacOS())) return;

      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data.type === "SHOW_INSTALL_TOAST") {
              const deviceType = isIOS() ? "iPhone/iPad" : "Mac";
              sendToast({
                type: "neutral",
                message: `Install Zendo on your ${deviceType} for the best experience!`,
                action: {
                  label: "Show me how",
                  onClick: () => setShowIOSDialog(true),
                },
              });
            }
          });

          // Initialize session tracking
          registration.active?.postMessage({
            type: "INIT_INSTALL_SESSION",
            data: {
              userAgent: navigator.userAgent,
              timestamp: Date.now(),
              isInstalled: installed,
            },
          });
        } catch (error) {
          console.error("Error initializing session manager:", error);
        }
      }
    };

    // Handle beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      e.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
      console.log("PWA install prompt available");
    };

    // Handle app installed event
    const handleAppInstalled = async () => {
      console.log("PWA was installed successfully");
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);

      // Notify service worker about installation
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({
          type: "APP_INSTALLED",
          data: { timestamp: Date.now() },
        });
      }

      // Wait a moment for the installation to complete
      setTimeout(async () => {
        await requestNotificationPermission();
      }, 1000);
    };

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Initialize session manager
    initializeSessionManager();

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // (moved inside useEffect to avoid missing dependency warning)

  // Requests notification permission from the user
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.error("Notification permission request failed:", e);
      }
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error("Error during installation:", error);
    }
  };

  // Don't render Chrome install prompt if already installed
  if (isInstalled) {
    return (
      <>
        <IOSInstallDialog open={showIOSDialog} onOpenChangeAction={setShowIOSDialog} />
      </>
    );
  }

  return (
    <>
      {isInstallable && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[100000]">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Install Zendo App
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Get the full experience with offline access and notifications.
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={handleInstallClick}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    Install
                  </Button>
                  <Button
                    onClick={() => setIsInstallable(false)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded transition-colors"
                  >
                    Not now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <IOSInstallDialog open={showIOSDialog} onOpenChangeAction={setShowIOSDialog} />
    </>
  );
}
