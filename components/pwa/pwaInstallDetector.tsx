"use client";

import { useEffect, useState, useRef } from "react";
import { isIOS, isMacOS, isSafari } from "@/lib/utils";
import { IOSInstallDialog } from "@/components/pwa/iosInstallDialog";
import sendToast from "@/components/modules/toast";
import type { BeforeInstallPromptEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export default function PWAInstallDetector() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSDialog, setShowIOSDialog] = useState(false);
  const [cookieConsentVisible, setCookieConsentVisible] = useState(false);
  const sessionUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

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

    // Check if cookie consent is visible
    const checkCookieConsent = () => {
      const cookieConsentElement = document.querySelector("[data-cookie-consent]");
      const isVisible = cookieConsentElement !== null;
      setCookieConsentVisible(isVisible);
      return isVisible;
    };

    // Check if any dialogs or prompts are open
    const checkForOpenDialogs = () => {
      const dialogSelectors = [
        '[role="dialog"]',
        '[role="alertdialog"]',
        ".modal",
        ".popup",
        ".overlay",
        '[data-state="open"]',
        '[aria-modal="true"]',
        ".toast",
        ".notification",
        ".alert",
        "[data-radix-popper-content-wrapper]",
        "[data-radix-dialog-content]",
        "[data-sonner-toaster]",
        ".sonner-toast",
      ];

      for (const selector of dialogSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const computedStyle = window.getComputedStyle(element);
          if (
            computedStyle.display !== "none" &&
            computedStyle.visibility !== "hidden" &&
            computedStyle.opacity !== "0"
          ) {
            return true;
          }
        }
      }
      return false;
    };

    // Initialize session manager for all platforms
    const initializeSessionManager = async () => {
      if (installed) return;

      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data.type === "SHOW_INSTALL_TOAST") {
              // Don't show if cookie consent is visible or other dialogs are open
              if (checkCookieConsent() || checkForOpenDialogs()) {
                console.log("Delaying install toast - dialogs are open");
                return;
              }

              if (isSafari() && (isIOS() || isMacOS())) {
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
            } else if (event.data.type === "SHOW_INSTALL_PROMPT") {
              // Don't show if cookie consent is visible or other dialogs are open
              if (checkCookieConsent() || checkForOpenDialogs()) {
                console.log("Delaying install prompt - dialogs are open");
                return;
              }

              // Show the stored beforeinstallprompt
              if (deferredPrompt) {
                setIsInstallable(true);
              }
            }
          });

          // Set up periodic session updates to ensure timely prompts
          sessionUpdateInterval.current = setInterval(async () => {
            if (installed || checkCookieConsent()) {
              if (sessionUpdateInterval.current) clearInterval(sessionUpdateInterval.current);
              return;
            }

            try {
              const registration = await navigator.serviceWorker.ready;
              registration.active?.postMessage({
                type: "UPDATE_INSTALL_SESSION",
                data: {
                  timestamp: Date.now(),
                  hasOpenDialogs: checkForOpenDialogs(),
                },
              });
            } catch (error) {
              console.error("Error updating session:", error);
            }
          }, 1000); // Update every second

          // Clean up interval when component unmounts or conditions change
          cleanup.current = () => {
            if (sessionUpdateInterval.current) clearInterval(sessionUpdateInterval.current);
          };

          // Store cleanup function for later use
          window.addEventListener("beforeunload", cleanup.current!);

          // Only initialize session tracking if cookie consent is not visible
          if (!checkCookieConsent()) {
            registration.active?.postMessage({
              type: "INIT_INSTALL_SESSION",
              data: {
                userAgent: navigator.userAgent,
                timestamp: Date.now(),
                isInstalled: installed,
                isSafari: isSafari() && (isIOS() || isMacOS()),
                cookieConsentVisible: false,
                hasOpenDialogs: checkForOpenDialogs(),
              },
            });
          }
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

      // Don't show immediately if cookie consent is visible
      if (checkCookieConsent()) {
        console.log("Storing install prompt - cookie consent is visible");
        return;
      }

      // Store the prompt and let session manager handle timing
      console.log("PWA install prompt stored for session management");
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

      // Initialize FCM and send thank you notification
      setTimeout(async () => {
        await initializeFCMAndSendThankYou();
      }, 1000);
    };

    // Listen for cookie consent events
    const handleCookieConsentAllow = () => {
      setCookieConsentVisible(false);
      console.log("Cookie consent allowed - starting session tracking");

      // Start session tracking now that consent is given
      setTimeout(async () => {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;
          registration.active?.postMessage({
            type: "INIT_INSTALL_SESSION",
            data: {
              userAgent: navigator.userAgent,
              timestamp: Date.now(),
              isInstalled: installed,
              isSafari: isSafari() && (isIOS() || isMacOS()),
              cookieConsentVisible: false,
              hasOpenDialogs: checkForOpenDialogs(),
            },
          });
        }
      }, 500);
    };

    const handleCookieConsentDeny = () => {
      setCookieConsentVisible(false);
      console.log("Cookie consent denied - starting session tracking anyway");

      // Still allow install prompts even if analytics denied
      setTimeout(async () => {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;
          registration.active?.postMessage({
            type: "INIT_INSTALL_SESSION",
            data: {
              userAgent: navigator.userAgent,
              timestamp: Date.now(),
              isInstalled: installed,
              isSafari: isSafari() && (isIOS() || isMacOS()),
              cookieConsentVisible: false,
              hasOpenDialogs: checkForOpenDialogs(),
            },
          });
        }
      }, 500);
    };

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("cookie-consent-allow", handleCookieConsentAllow);
    window.addEventListener("cookie-consent-deny", handleCookieConsentDeny);

    // Initialize session manager only if cookie consent is not visible
    initializeSessionManager();

    // Monitor cookie consent visibility
    const observer = new MutationObserver(() => {
      const newCookieConsentState = checkCookieConsent();
      if (newCookieConsentState !== cookieConsentVisible) {
        setCookieConsentVisible(newCookieConsentState);

        // If cookie consent just disappeared, start session tracking
        if (!newCookieConsentState && cookieConsentVisible) {
          console.log("Cookie consent disappeared - starting session tracking");
          setTimeout(async () => {
            if ("serviceWorker" in navigator) {
              const registration = await navigator.serviceWorker.ready;
              registration.active?.postMessage({
                type: "INIT_INSTALL_SESSION",
                data: {
                  userAgent: navigator.userAgent,
                  timestamp: Date.now(),
                  isInstalled: installed,
                  isSafari: isSafari() && (isIOS() || isMacOS()),
                  cookieConsentVisible: false,
                  hasOpenDialogs: checkForOpenDialogs(),
                },
              });
            }
          }, 500);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-cookie-consent"],
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("cookie-consent-allow", handleCookieConsentAllow);
      window.removeEventListener("cookie-consent-deny", handleCookieConsentDeny);
      observer.disconnect();
      if (sessionUpdateInterval.current) clearInterval(sessionUpdateInterval.current);
      if (cleanup.current) window.removeEventListener("beforeunload", cleanup.current);
    };
  }, [deferredPrompt, cookieConsentVisible]);

  // Initialize FCM and send thank you notification
  const initializeFCMAndSendThankYou = async () => {
    try {
      // Request notification permission first
      if ("Notification" in window) {
        let permission = Notification.permission;

        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        if (permission !== "granted") {
          console.log("Notification permission denied");
          // @ts-expect-error Notification actions are not yet standard in all browsers
          if (permission === "granted") {
            new Notification("Thank you for installing Zendo! 🎉", {
              body: "Welcome to the Zendo experience! Consider supporting the project.",
              icon: "/assets/icons/maskable-icon.png",
              tag: "install-thank-you",
              requireInteraction: true,
            });
          }
          return;
        }
      }

      // Initialize FCM
      const { initializeApp } = await import("firebase/app");
      const { getMessaging, getToken } = await import("firebase/messaging");

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (token) {
        console.log("FCM token obtained:", token);

        // Send token to server and trigger thank you notification
        const response = await fetch("/api/fcm/send-install-thank-you", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            title: "Thank you for installing Zendo! 🎉",
            body: "Welcome to the Zendo experience! Consider supporting the project.",
            data: {
              url: "/kofi",
              action: "support",
            },
          }),
        });

        if (response.ok) {
          console.log("Install thank you notification sent via FCM");

          // Also show a browser notification as immediate feedback
          if (Notification.permission === "granted") {
            const notification = new Notification("Thank you for installing Zendo! 🎉", {
              body: "Welcome to the Zendo experience! Consider supporting the project.",
              icon: "/assets/icons/maskable-icon.png",
              tag: "install-thank-you",
              requireInteraction: true,
              // @ts-expect-error Notification actions are not yet standard in all browsers
              actions: [
                { action: "support", title: "Support on Ko-fi ☕" },
                { action: "explore", title: "Explore App" },
              ],
            });

            notification.onclick = () => {
              window.open("/kofi", "_blank");
              notification.close();
            };
          }
        } else {
          const errorData = await response.json();
          console.error("Failed to send FCM notification:", errorData);

          // Fallback to browser notification
          if (Notification.permission === "granted") {
            new Notification("Thank you for installing Zendo! 🎉", {
              body: "Welcome to the Zendo experience! Consider supporting the project.",
              icon: "/assets/icons/maskable-icon.png",
              tag: "install-thank-you",
            });
          }
        }
      } else {
        console.log("No FCM token available, using browser notification");

        // Fallback to browser notification
        if (Notification.permission === "granted") {
          new Notification("Thank you for installing Zendo! 🎉", {
            body: "Welcome to the Zendo experience! Consider supporting the project.",
            icon: "/assets/icons/maskable-icon.png",
            tag: "install-thank-you",
          });
        }
      }
    } catch (error) {
      console.error("Error initializing FCM:", error);

      // Fallback to browser notification
      if (Notification.permission === "granted") {
        new Notification("Thank you for installing Zendo! 🎉", {
          body: "Welcome to the Zendo experience! Consider supporting the project.",
          icon: "/assets/icons/maskable-icon.png",
          tag: "install-thank-you",
        });
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

  // Don't render Chrome install prompt if already installed or cookie consent is visible
  if (isInstalled) {
    return (
      <>
        <IOSInstallDialog open={showIOSDialog} onOpenChangeAction={setShowIOSDialog} />
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isInstallable && !cookieConsentVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[100000]"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
      <IOSInstallDialog open={showIOSDialog} onOpenChangeAction={setShowIOSDialog} />
    </>
  );
}
