"use client";

import { useEffect } from "react";

export default function SendActivityToSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const interval = setInterval(() => {
        navigator.serviceWorker.controller?.postMessage({ type: "USER_ACTIVE" });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return null;
}

export 