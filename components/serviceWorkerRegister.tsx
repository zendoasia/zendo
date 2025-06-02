"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      registerServiceWorker();
    } else {
      console.debug("Service workers are not supported in this browser");
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();

      // Check if we already have a registration for our scope
      const currentOrigin = window.location.origin;
      const existingRegistration = registrations.find(
        (reg) =>
          reg.scope === `${currentOrigin}/` ||
          reg.scope === currentOrigin ||
          reg.scope.startsWith(currentOrigin)
      );

      if (existingRegistration) {
        console.debug("Found existing service worker registration:", {
          scope: existingRegistration.scope,
          state: existingRegistration.active?.state,
          installing: !!existingRegistration.installing,
          waiting: !!existingRegistration.waiting,
          active: !!existingRegistration.active,
        });

        if (existingRegistration.active && existingRegistration.active.state === "activated") {
          console.debug("Service worker is already active, skipping registration");
          return;
        }

        // If there's a waiting service worker, we might want to update
        if (existingRegistration.waiting) {
          console.debug("Service worker is waiting, checking for updates...");
          await existingRegistration.update();
          return;
        }

        // If it's still installing, wait for it
        if (existingRegistration.installing) {
          console.debug("Service worker is still installing, waiting...");
          return;
        }
      }

      // Only register if no suitable existing registration was found
      console.debug("No active service worker found, registering new one...");
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none", // Ensure we always check for updates
      });

      console.debug("Service Worker registered successfully:", {
        scope: registration.scope,
        state: registration.active?.state,
      });

      // Handle service worker updates
      registration.addEventListener("updatefound", () => {
        console.debug("New service worker version found");
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            console.debug("Service worker state changed:", newWorker.state);

            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.debug("New service worker installed, page refresh recommended");
            }
          });
        }
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  };

  return null;
}
