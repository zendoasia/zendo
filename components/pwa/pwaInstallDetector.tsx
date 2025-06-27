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
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Refs to prevent multiple intervals and cleanup
  const sessionUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const toastShownRef = useRef(false);

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

    // Handle page visibility changes
    const handleVisibilityChange = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          registration.active?.postMessage({
            type: "PAGE_VISIBILITY_CHANGE",
            isVisible: !document.hidden,
          });
        } catch (error) {
          console.error("Error sending visibility change:", error);
        }
      }
    };

    // Initialize FCM and get token
    const initializeFCM = async () => {
      try {
        if ("Notification" in window && Notification.permission === "granted") {
          const { initializeApp } = await import("firebase/app");
          const { getMessaging, getToken } = await import("firebase/messaging");

          const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            measurementId: process.env.NEXT_PUBLIC_GA_ID,
          };

          const app = initializeApp(firebaseConfig);
          const messaging = getMessaging(app);

          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });

          if (token) {
            setFcmToken(token);
            console.log("FCM token obtained:", token);
          }
        }
      } catch (error) {
        console.error("Error initializing FCM:", error);
      }
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
              // Prevent multiple toasts with ref check
              if (toastShownRef.current) {
                console.log("Toast already shown, skipping");
                return;
              }

              // Don't show if cookie consent is visible or other dialogs are open
              if (checkCookieConsent() || checkForOpenDialogs()) {
                console.log("Delaying install toast - dialogs are open");
                return;
              }

              if (isSafari() && (isIOS() || isMacOS())) {
                toastShownRef.current = true;
                const deviceType = isIOS() ? "iPhone/iPad" : "Mac";

                sendToast({
                  type: "neutral",
                  message: `Install Zendo on your ${deviceType} for the best experience!`,
                  action: {
                    label: "Show me how",
                    onClick: () => {
                      setShowIOSDialog(true);
                      // Reset toast shown flag when action is taken
                      setTimeout(() => {
                        toastShownRef.current = false;
                      }, 1000);
                    },
                  },
                });

                // Reset toast shown flag after 10 seconds
                setTimeout(() => {
                  toastShownRef.current = false;
                  // Notify service worker that toast was dismissed
                  registration.active?.postMessage({
                    type: "TOAST_DISMISSED",
                  });
                }, 10000);
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
            } else if (event.data.type === "GET_FCM_TOKEN") {
              // Respond to service worker FCM token request
              const port = event.ports[0];
              if (port) {
                port.postMessage({ token: fcmToken });
              }
            }
          });

          // Set up periodic session updates to ensure timely prompts
          if (sessionUpdateInterval.current) {
            clearInterval(sessionUpdateInterval.current);
          }

          sessionUpdateInterval.current = setInterval(async () => {
            if (installed || checkCookieConsent()) {
              if (sessionUpdateInterval.current) {
                clearInterval(sessionUpdateInterval.current);
                sessionUpdateInterval.current = null;
              }
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

          // Add page visibility change listener
          document.addEventListener("visibilitychange", handleVisibilityChange);

          // Initialize FCM
          await initializeFCM();

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

      // The service worker will handle the notification after installation
      console.log("Install notification will be handled by service worker");
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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();

      if (sessionUpdateInterval.current) {
        clearInterval(sessionUpdateInterval.current);
        sessionUpdateInterval.current = null;
      }
    };
  }, [deferredPrompt, cookieConsentVisible, fcmToken]);

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
