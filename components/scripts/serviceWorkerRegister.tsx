"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      registerServiceWorker();
    } else {
      console.log("Service workers are not supported in this browser");
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();

      const currentOrigin = window.location.origin;
      const existingRegistration = registrations.find(
        (reg) =>
          reg.scope === `${currentOrigin}/` ||
          reg.scope === currentOrigin ||
          reg.scope.startsWith(currentOrigin)
      );

      const swResponse = await fetch("/sw.min.js", { cache: "no-cache" });
      const swLastModified = swResponse.headers.get("last-modified");
      const swETag = swResponse.headers.get("etag");

      if (existingRegistration) {
        let isOutdated = false;

        if (existingRegistration.active) {
          try {
            const messageChannel = new MessageChannel();
            existingRegistration.active.postMessage({ type: "GET_VERSION" }, [
              messageChannel.port2,
            ]);

            // Set a timeout to assume it's outdated if no response
            const timeoutPromise = new Promise((resolve) => {
              setTimeout(() => resolve("timeout"), 1000);
            });

            const versionCheckResult = await Promise.race([
              new Promise((resolve) => {
                messageChannel.port1.onmessage = (event) => {
                  if (event.data && event.data.type === "VERSION") {
                    resolve(event.data.version);
                  } else {
                    resolve(null);
                  }
                };
              }),
              timeoutPromise,
            ]);

            if (versionCheckResult === "timeout" || versionCheckResult === null) {
              console.log(versionCheckResult);
              console.debug("Service worker version check failed, considering it outdated");
              isOutdated = true;
            }
          } catch (error) {
            console.debug("Error checking service worker version, considering it outdated:", error);
            isOutdated = true;
          }

          // If we have last-modified or etag headers, use them as fallback
          if (!isOutdated && (swLastModified || swETag)) {
            // We don't have a direct way to check the SW file date that was registered
            // So we'll use the update() method which will check if the SW file has changed
            await existingRegistration.update();

            // If after update() there's a waiting worker, it means the SW file has changed
            if (existingRegistration.waiting) {
              console.debug("Service worker update found, considering current one outdated");
              isOutdated = true;
            }
          }
        } else {
          // No active service worker, consider it outdated/incomplete
          isOutdated = true;
        }

        if (isOutdated) {
          console.debug("Service worker is outdated, unregistering and registering latest...");
          await existingRegistration.unregister();

          // Register the new service worker
          const registration = await navigator.serviceWorker.register("/sw.min.js", {
            scope: "/",
            updateViaCache: "none", // Ensure we always check for updates
          });

          console.debug("New service worker registered successfully:", {
            scope: registration.scope,
            state: registration.active?.state,
          });

          return;
        } else if (
          existingRegistration.active &&
          existingRegistration.active.state === "activated"
        ) {
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
      const registration = await navigator.serviceWorker.register("/sw.min.js", {
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
              console.log("New service worker installed, page refresh recommended");
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
