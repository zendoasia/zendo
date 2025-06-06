// Cache names with versioning
const CACHE_NAMES = {
  STATIC: "static-cache-v1",
  FONTS: "fonts-cache-v1",
  PAGES: "pages-cache-v1",
  OFFLINE: "offline-cache-v1",
  CRITICAL: "critical-cache-v1",
};

// Service worker version - increment this when you want to force updates
const SW_VERSION = "1.0.4";

// Resources to cache
const OFFLINE_PAGE = "/fallback/offline.html";

// Critical resources that should be cached during install
const CRITICAL_RESOURCES = ["/manifest.webmanifest", "/favicon.ico", "/robots.txt"];

// Cache duration in milliseconds (365 days)
const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000;
// Check interval in milliseconds (5 minutes)
const CHECK_INTERVAL = 5 * 60 * 1000;

// Session management for install prompts
const INSTALL_SESSION_KEY = "pwa-install-session";
const INSTALL_PROMPT_DELAY = 8000; // 8 seconds
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Import Firebase scripts for FCM
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Initialize Firebase in service worker
const firebase = self.firebase;

// NOTE: These are not confidential, as they're public keys.
// We are not using GTM to reduce latency
const firebaseConfig = {
  apiKey: "AIzaSyAQP_VjdlDv915rj1_eqlq0BnJGCB1lJYw",
  authDomain: "zendo-aarush.firebaseapp.com",
  projectId: "zendo-aarush",
  storageBucket: "zendo-aarush.firebasestorage.app",
  messagingSenderId: "756455688246",
  appId: "1:756455688246:web:d72db4298952b3e702b097",
  measurementId: "G-RNN756TW7T",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "Zendo";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/assets/icons/maskable-icon.png",
    badge: "/assets/icons/maskable-icon.png",
    tag: payload.data?.tag || "default",
    data: payload.data,
    actions: payload.data?.actions ? JSON.parse(payload.data.actions) : [],
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Install event - cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Cache offline page
      caches.open(CACHE_NAMES.OFFLINE).then((cache) => {
        return cache.add(OFFLINE_PAGE).catch((error) => {
          console.warn("[Service Worker] Could not cache offline page:", error);
        });
      }),
      // Cache critical resources
      caches.open(CACHE_NAMES.CRITICAL).then((cache) => {
        return Promise.allSettled(
          CRITICAL_RESOURCES.map((resource) =>
            cache.add(resource).catch((error) => {
              console.warn(`[Service Worker] Could not cache ${resource}:`, error);
            })
          )
        );
      }),
    ])
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error("[Service Worker] Installation failed:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete caches that aren't in our defined CACHE_NAMES
            if (!Object.values(CACHE_NAMES).includes(cacheName)) {
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => self.clients.claim())
      .catch((error) => {
        console.error("[Service Worker] Activation failed:", error);
      })
  );
});

// Update session timing for more responsive prompts with dialog detection
async function updateInstallSessionTiming(data) {
  const session = await getInstallSession();
  if (!session || session.hasShownPrompt) {
    return;
  }

  // Don't update timing if dialogs are open
  if (data.hasOpenDialogs) {
    console.log("[Service Worker] Pausing session timing - dialogs are open");
    return;
  }

  const now = Date.now();
  const updatedSession = {
    ...session,
    totalTime: session.totalTime + (now - (session.lastUpdate || session.startTime)),
    lastUpdate: now,
  };

  // Check if user has spent enough time to show prompt
  if (updatedSession.totalTime >= INSTALL_PROMPT_DELAY) {
    updatedSession.hasShownPrompt = true;
    await setInstallSession(updatedSession);

    // Send message to all clients to show the appropriate prompt
    const clients = await self.clients.matchAll({ type: "window" });
    const messageType = session.isSafari ? "SHOW_INSTALL_TOAST" : "SHOW_INSTALL_PROMPT";

    clients.forEach((client) => {
      client.postMessage({
        type: messageType,
        data: { timestamp: now },
      });
    });

    console.log(`[Service Worker] Triggered ${messageType} after`, updatedSession.totalTime, "ms");
  } else {
    await setInstallSession(updatedSession);
    console.log("[Service Worker] Updated session time:", updatedSession.totalTime, "/ 8000ms");
  }
}

// Session management functions
async function getInstallSession() {
  try {
    const cache = await caches.open(CACHE_NAMES.STATIC);
    const response = await cache.match(INSTALL_SESSION_KEY);
    if (response) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn("[Service Worker] Could not retrieve install session:", error);
  }
  return null;
}

async function setInstallSession(data) {
  try {
    const cache = await caches.open(CACHE_NAMES.STATIC);
    const response = new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    await cache.put(INSTALL_SESSION_KEY, response);
  } catch (error) {
    console.warn("[Service Worker] Could not save install session:", error);
  }
}

async function clearInstallSession() {
  try {
    const cache = await caches.open(CACHE_NAMES.STATIC);
    await cache.delete(INSTALL_SESSION_KEY);
  } catch (error) {
    console.warn("[Service Worker] Could not clear install session:", error);
  }
}

// Check if user is on Safari iOS/macOS
function isSafariApple(userAgent) {
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  const isApple = /iPad|iPhone|iPod|Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent);
  return isSafari && isApple;
}

// Handle install session initialization and timing
async function handleInstallSession(data) {
  // Don't start session tracking if user is already installed or cookie consent is visible
  if (data.isInstalled || data.cookieConsentVisible) {
    console.log("[Service Worker] Skipping session tracking - installed or cookie consent visible");
    return;
  }

  const session = await getInstallSession();
  const now = Date.now();

  // Check if we have an existing session
  if (session) {
    // Check if session is expired
    if (now - session.startTime > SESSION_DURATION) {
      // Session expired, start new one
      await setInstallSession({
        startTime: now,
        totalTime: 0,
        hasShownPrompt: false,
        userAgent: data.userAgent,
        isSafari: data.isSafari,
        lastUpdate: now,
      });
      console.log("[Service Worker] Started new install session (expired)");
    } else if (!session.hasShownPrompt) {
      // Don't update if dialogs are open
      if (data.hasOpenDialogs) {
        console.log("[Service Worker] Pausing session - dialogs are open");
        return;
      }

      // Update total time spent
      const updatedSession = {
        ...session,
        totalTime: session.totalTime + (now - (session.lastUpdate || session.startTime)),
        lastUpdate: now,
      };

      // Check if user has spent enough time to show prompt
      if (updatedSession.totalTime >= INSTALL_PROMPT_DELAY) {
        updatedSession.hasShownPrompt = true;
        await setInstallSession(updatedSession);

        // Send message to all clients to show the appropriate prompt
        const clients = await self.clients.matchAll({ type: "window" });
        const messageType = data.isSafari ? "SHOW_INSTALL_TOAST" : "SHOW_INSTALL_PROMPT";

        clients.forEach((client) => {
          client.postMessage({
            type: messageType,
            data: { timestamp: now },
          });
        });

        console.log(
          `[Service Worker] Triggered ${messageType} after`,
          updatedSession.totalTime,
          "ms"
        );
      } else {
        await setInstallSession(updatedSession);
        console.log("[Service Worker] Updated session time:", updatedSession.totalTime, "/ 8000ms");
      }
    }
  } else {
    // No existing session, create new one
    await setInstallSession({
      startTime: now,
      totalTime: 0,
      hasShownPrompt: false,
      userAgent: data.userAgent,
      isSafari: data.isSafari,
      lastUpdate: now,
    });
    console.log("[Service Worker] Started new install session");
  }
}

// Fetch event - intercept network requests
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip browser extensions and chrome-extension URLs
  if (url.protocol === "chrome-extension:" || url.protocol === "moz-extension:") {
    return;
  }

  // Handle critical resources (manifest, favicon, etc.)
  if (isCriticalResource(url.pathname)) {
    event.respondWith(handleCriticalResource(request));
    return;
  }

  // Handle Google Fonts requests with no-cors mode
  if (url.hostname.includes("googleapis.com") || url.hostname.includes("gstatic.com")) {
    event.respondWith(handleFontRequest(request));
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle static assets
  if (url.origin === self.location.origin) {
    event.respondWith(handleStaticAssetRequest(request));
    return;
  }
});

// Check if a resource is critical
function isCriticalResource(pathname) {
  return CRITICAL_RESOURCES.some(
    (resource) => pathname === resource || pathname.endsWith(resource)
  );
}

// Handle critical resources (manifest, favicon, etc.)
async function handleCriticalResource(request) {
  try {
    // Try cache first for critical resources
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Try network
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      try {
        const cache = await caches.open(CACHE_NAMES.CRITICAL);
        const responseToCache = response.clone();
        await cache.put(request, responseToCache);
      } catch (cacheError) {
        // Silently handle cache errors
      }
    }

    return response;
  } catch (error) {
    // Try cache again as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // For manifest.webmanifest, return a minimal fallback
    if (request.url.includes("manifest.webmanifest")) {
      return new Response(
        JSON.stringify({
          name: "Zendo",
          short_name: "Zendo",
          start_url: "/",
          display: "standalone",
          background_color: "#000000",
          theme_color: "#000000",
          icons: [
            {
              src: "/assets/icons/maskable-icon.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        }),
        {
          headers: { "Content-Type": "application/manifest+json" },
          status: 200,
        }
      );
    }

    // For favicon.ico, return a minimal 1x1 transparent PNG
    if (request.url.includes("favicon.ico")) {
      // Minimal 1x1 transparent PNG as base64
      const transparentPng =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      const binaryString = atob(transparentPng);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return new Response(bytes, {
        headers: { "Content-Type": "image/png" },
        status: 200,
      });
    }

    // For other critical resources, return a 404 but don't throw
    return new Response("Not Found", { status: 404 });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try to fetch from network first
    const response = await fetch(request);
    return response;
  } catch (error) {
    // If network fails (offline), serve the offline page
    try {
      const offlineResponse = await caches.match(OFFLINE_PAGE);
      if (offlineResponse) {
        return processOfflinePage(offlineResponse);
      }
    } catch (cacheError) {
      // Silently handle cache errors
    }

    // Final fallback
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Offline</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 2rem; 
              background: #f9fafb; 
            }
            h1 { color: #111827; }
          </style>
        </head>
        <body>
          <h1>You're Offline</h1>
          <p>Please check your internet connection and try again.</p>
          <button onclick="window.location.reload()">Retry</button>
        </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" },
        status: 200,
      }
    );
  }
}

// Handle font requests with proper CORS handling
async function handleFontRequest(request) {
  try {
    // Check cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Create a new request with no-cors mode to avoid CORS issues
    const corsRequest = new Request(request.url, {
      method: "GET",
      mode: "no-cors",
      credentials: "omit",
      cache: "default",
    });

    // Fetch with no-cors mode
    const response = await fetch(corsRequest);

    // Cache successful responses
    if (response.status === 0 || response.ok) {
      try {
        const cache = await caches.open(CACHE_NAMES.FONTS);
        // Clone the response before caching
        const responseToCache = response.clone();
        await cache.put(request, responseToCache);
      } catch (cacheError) {
        // Silently handle cache errors
      }
    }

    return response;
  } catch (error) {
    // Try to serve from cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If it's a CSS request, return a minimal fallback
    if (request.url.includes("googleapis.com") && request.url.includes("css")) {
      return new Response(
        `/* Fallback font CSS */
        @font-face {
          font-family: 'Geist Sans';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local('system-ui'), local('sans-serif');
        }
        @font-face {
          font-family: 'Space Grotesk';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local('system-ui'), local('sans-serif');
        }`,
        {
          headers: { "Content-Type": "text/css" },
          status: 200,
        }
      );
    }

    // For font files, return a 404 but don't throw
    return new Response("Font not available offline", { status: 404 });
  }
}

// Handle static asset requests
async function handleStaticAssetRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);

    // Cache successful responses for static assets
    if (response.ok && shouldCacheAsset(request.url)) {
      try {
        const cache = await caches.open(CACHE_NAMES.STATIC);
        const responseToCache = response.clone();
        await cache.put(request, responseToCache);
      } catch (cacheError) {
        // Silently handle cache errors
      }
    }

    return response;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return a 404 instead of throwing - this prevents unhandled promise rejections
    return new Response("Resource not available offline", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Check if an asset should be cached
function shouldCacheAsset(url) {
  const cacheableExtensions = [
    ".js",
    ".css",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
  ];
  return cacheableExtensions.some((ext) => url.includes(ext));
}

// Process the offline page before serving
async function processOfflinePage(response) {
  try {
    const html = await response.text();

    // Ensure the offline page has proper font fallbacks
    const modifiedHtml = html.replace(
      "</head>",
      `
      <style>
        /* Enhanced font fallbacks for offline use */
        body {
          font-family: 'Geist Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
        }
        
        /* Ensure fonts load properly */
        * {
          font-display: swap;
        }
      </style>
    </head>`
    );

    return new Response(modifiedHtml, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
      status: 200,
    });
  } catch (error) {
    return response;
  }
}

// Periodic cache check and maintenance
async function checkAndRefreshCache() {
  try {
    // Check if offline page is cached
    const offlineCache = await caches.open(CACHE_NAMES.OFFLINE);
    const offlinePageCached = await offlineCache.match(OFFLINE_PAGE);

    if (!offlinePageCached) {
      try {
        await offlineCache.add(OFFLINE_PAGE);
      } catch (error) {
        // Silently handle errors
      }
    }

    // Clean up expired caches
    await cleanupExpiredCaches();
  } catch (error) {
    // Silently handle errors during maintenance
  }
}

// Clean up expired cache entries
async function cleanupExpiredCaches() {
  try {
    const now = Date.now();
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      if (!Object.values(CACHE_NAMES).includes(cacheName)) {
        continue;
      }

      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        try {
          const response = await cache.match(request);

          if (response) {
            const dateHeader = response.headers.get("date");

            if (dateHeader) {
              const cacheDate = new Date(dateHeader).getTime();

              if (now - cacheDate > CACHE_DURATION) {
                await cache.delete(request);
              }
            }
          }
        } catch (error) {
          // Silently continue if we can't process this cache entry
          continue;
        }
      }
    }
  } catch (error) {
    // Silently handle cleanup errors
  }
}

// Set up periodic cache checking
let cacheCheckInterval;

// Start the cache check interval
function startCacheCheckInterval() {
  if (cacheCheckInterval) {
    clearInterval(cacheCheckInterval);
  }

  cacheCheckInterval = setInterval(checkAndRefreshCache, CHECK_INTERVAL);
}

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  const { data, ports } = event;

  if (data && data.type === "GET_VERSION") {
    // Respond with the service worker version
    const port = ports[0];
    if (port) {
      port.postMessage({
        type: "VERSION",
        version: SW_VERSION,
        cacheNames: CACHE_NAMES,
        timestamp: Date.now(),
      });
    }
  } else if (data && data.type === "INIT_INSTALL_SESSION") {
    // Initialize install session tracking
    handleInstallSession(data.data);
  } else if (data && data.type === "APP_INSTALLED") {
    // Clear install session when app is installed
    clearInstallSession();
    console.log("[Service Worker] Cleared install session - app installed");
  } else if (data === "CHECK_CACHE") {
    checkAndRefreshCache();
  } else if (data === "START_CACHE_CHECK") {
    startCacheCheckInterval();
  } else if (data && data.type === "UPDATE_INSTALL_SESSION") {
    // Update install session timing
    updateInstallSessionTiming(data.data);
  }
});

// Handle notification click events
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};

  let url = "/";

  // Handle different actions
  if (action === "support") {
    url = "/kofi";
  } else if (action === "explore") {
    url = "/";
  } else if (event.notification.tag === "install-thank-you") {
    url = "/kofi";
  } else if (data.url) {
    url = data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Try to focus existing window and navigate to the URL
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          if ("navigate" in client) {
            client.navigate(url);
          }
          return client.focus();
        }
      }

      // Open new window if no existing window found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Start cache checking when the service worker becomes active
self.addEventListener("activate", () => {
  startCacheCheckInterval();
});

// Run initial cache check
checkAndRefreshCache();
