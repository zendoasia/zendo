"use client";

import { useEffect } from "react";

export default function FCMHandler() {
  useEffect(() => {
    const initializeFCM = async () => {
      if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        return;
      }

      try {
        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;

        // Initialize Firebase
        const { initializeApp } = await import("firebase/app");
        const { getMessaging, onMessage } = await import("firebase/messaging");

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

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log("Received foreground message:", payload);

          // Parse actions if they exist in the payload
          let actions = [];
          try {
            if (payload.data?.actions) {
              actions = JSON.parse(payload.data.actions);
            }
          } catch (error) {
            console.error("Error parsing notification actions:", error);
          }

          // Show notification if the app is in foreground
          if (Notification.permission === "granted") {
            const notification = new Notification(payload.notification?.title || "Zendo", {
              body: payload.notification?.body,
              icon: "/assets/icons/maskable-icon.png",
              tag: payload.data?.tag || "default",
              data: payload.data,
              // @ts-expect-error Actions are not standard across browsers yet
              actions: actions,
              requireInteraction: true,
            });

            notification.onclick = () => {
              const url = payload.data?.url || "/";
              window.open(url, "_blank");
              notification.close();
            };
          }
        });

        console.log("FCM initialized successfully");
      } catch (error) {
        console.error("Error initializing FCM:", error);
      }
    };

    initializeFCM();
  }, []);

  return null;
}
