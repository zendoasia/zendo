const CACHE_NAMES = {
  STATIC: "static-cache-v1",
  FONTS: "fonts-cache-v1",
  PAGES: "pages-cache-v1",
  OFFLINE: "offline-cache-v1",
  CRITICAL: "critical-cache-v1",
};

const SW_VERSION = "1.0.7";

const OFFLINE_PAGE = "/fallback/offline.html";

const CRITICAL_RESOURCES = ["/manifest.webmanifest", "/favicon.ico", "/robots.txt"];

const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000;
const CHECK_INTERVAL = 5 * 60 * 1000;

const INSTALL_SESSION_KEY = "install-session";
const INSTALL_PROMPT_DELAY = 8000;
const SESSION_DURATION = 24 * 60 * 60 * 1000;
const SESSION_UPDATE_INTERVAL = 1000;

const NOTIFICATION_STATE_KEY = "notification-state";
const INSTALL_NOTIFICATION_PENDING_KEY = "install-notification-pending";

// Import Firebase scripts for FCM
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Initialize Firebase in service worker
const firebase = self.firebase;

// Init fake placeholder keys for firebase until encoded by prep step.
const firebaseConfig = {
  apiKey: "__API_KEY__",
  authDomain: "__AUTH_DOMAIN__",
  projectId: "__PROJECT_ID__",
  storageBucket: "__STORAGE_BUCKET__",
  messagingSenderId: "__MESSAGING_SENDER_ID__",
  appId: "__APP_ID__",
  measurementId: "__MEASUREMENT_ID__",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] Received background message", payload);

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || "Zendo";
  const body = notification.body || "You had a new notification minutes ago! Check it out!";
  const icon = data.icon || "/assets/icons/maskable-icon.png";
  const badge = data.badge || "/assets/icons/maskable-icon.png";
  const tag = data.tag || "default";
  const requireInteraction = true;
  const vibrate = [200, 100, 200];
  const timestamp = Number(data.timestamp || Date.now());
  const actions = safeParseActions(data.actions);

  const notificationOptions = {
    body,
    icon,
    badge,
    tag,
    requireInteraction,
    vibrate,
    timestamp,
    data: {
      url: data.url || "/kofi",
      action: data.action || "support",
      dateOfArrival: timestamp,
    },
    actions,
    silent: false,
    renotify: true,
    dir: "auto",
  };

  self.registration.showNotification(title, notificationOptions);
});

function safeParseActions(actionsRaw) {
  try {
    return actionsRaw ? JSON.parse(actionsRaw) : [];
  } catch (e) {
    console.warn("Failed to parse notification actions", e);
    return [];
  }
}

self.addEventListener("notificationclick", function (event) {
  const targetUrl = event.notification.data?.url || "/";
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
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

let activeDuration = 0;
let sessionMet = false;
let timer = null;

self.addEventListener("message", (event) => {
  if (event.data?.type === "USER_ACTIVE") {
    if (!sessionMet) {
      if (!timer) {
        timer = setInterval(() => {
          activeDuration += 1;
          if (activeDuration >= 8) {
            sessionMet = true;
            clearInterval(timer);

            self.clients.matchAll({ type: "window" }).then((clients) => {
              for (const client of clients) {
                client.postMessage({ type: "8S_SESSION_INIT" });
              }
            });
          }
        }, 1000);
      }
    }
  }
});

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
    isSessionInitialized = false;
    sessionTracker = null;
    if (sessionInterval) {
      clearInterval(sessionInterval);
      sessionInterval = null;
    }
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

// Initialize persistent session tracking
async function initializeSessionTracking(data) {
  // Prevent multiple initializations
  if (isSessionInitialized) {
    console.log("[Service Worker] Session already initialized, skipping");
    return;
  }

  // Don't start session tracking if user is already installed
  if (data.isInstalled) {
    console.log("[Service Worker] User already installed - skipping session tracking");
    return;
  }

  const session = await getInstallSession();
  const now = Date.now();

  // Check if we have an existing session
  if (session) {
    // Check if session is expired
    if (now - session.startTime > SESSION_DURATION) {
      // Session expired, start new one
      await createNewSession(data, now);
      console.log("[Service Worker] Started new install session (expired)");
    } else {
      // Resume existing session
      sessionTracker = {
        ...session,
        lastUpdate: now,
        isActive: true,
        isSafari: data.isSafari,
      };

      // Check if we should show prompt immediately (user already has enough time)
      if (session.totalTime >= INSTALL_PROMPT_DELAY && !session.hasShownPrompt) {
        await triggerInstallPrompt(session.isSafari);
      } else {
        console.log(
          `[Service Worker] Resumed session - ${session.totalTime}ms / ${INSTALL_PROMPT_DELAY}ms`
        );
        startSessionTimer();
      }
    }
  } else {
    // No existing session, create new one
    await createNewSession(data, now);
    console.log("[Service Worker] Started new install session");
  }

  isSessionInitialized = true;
}

// Create a new session
async function createNewSession(data, timestamp) {
  // Clear any existing interval
  if (sessionInterval) {
    clearInterval(sessionInterval);
    sessionInterval = null;
  }

  sessionTracker = {
    startTime: timestamp,
    totalTime: 0,
    hasShownPrompt: false,
    userAgent: data.userAgent,
    isSafari: data.isSafari,
    lastUpdate: timestamp,
    isActive: true,
  };

  await setInstallSession(sessionTracker);
  startSessionTimer();
}

// Start the session timer
function startSessionTimer() {
  // Clear any existing interval first
  if (sessionInterval) {
    clearInterval(sessionInterval);
    sessionInterval = null;
  }

  console.log("[Service Worker] Starting session timer");

  sessionInterval = setInterval(async () => {
    if (!sessionTracker || !sessionTracker.isActive || sessionTracker.hasShownPrompt) {
      console.log("[Service Worker] Stopping session timer - inactive or prompt shown");
      clearInterval(sessionInterval);
      sessionInterval = null;
      return;
    }

    const now = Date.now();
    const timeDelta = now - sessionTracker.lastUpdate;

    // Update session
    sessionTracker.totalTime += timeDelta;
    sessionTracker.lastUpdate = now;

    // Save to persistent storage
    await setInstallSession(sessionTracker);

    console.log(
      `[Service Worker] Session time: ${sessionTracker.totalTime}ms / ${INSTALL_PROMPT_DELAY}ms`
    );

    // Check if we should show the prompt
    if (sessionTracker.totalTime >= INSTALL_PROMPT_DELAY) {
      sessionTracker.hasShownPrompt = true;
      await setInstallSession(sessionTracker);
      await triggerInstallPrompt(sessionTracker.isSafari);
      clearInterval(sessionInterval);
      sessionInterval = null;
    }
  }, SESSION_UPDATE_INTERVAL);
}

// Pause session tracking (when dialogs are open)
function pauseSessionTracking() {
  if (sessionTracker && sessionTracker.isActive) {
    sessionTracker.isActive = false;
    console.log("[Service Worker] Session tracking paused");
  }
}

// Resume session tracking
function resumeSessionTracking() {
  if (sessionTracker && !sessionTracker.hasShownPrompt && !sessionTracker.isActive) {
    sessionTracker.isActive = true;
    sessionTracker.lastUpdate = Date.now();
    console.log("[Service Worker] Session tracking resumed");

    // Only restart timer if it's not already running
    if (!sessionInterval) {
      startSessionTimer();
    }
  }
}

// Handle install session initialization and timing
async function handleInstallSession(data) {
  // Don't start session tracking if user is already installed or cookie consent is visible
  if (data.isInstalled || data.cookieConsentVisible) {
    console.log("[Service Worker] Skipping session tracking - installed or cookie consent visible");
    return;
  }

  // Initialize session tracking only once
  if (!isSessionInitialized) {
    await initializeSessionTracking(data);
  }

  // Handle dialog state
  if (data.hasOpenDialogs) {
    pauseSessionTracking();
  } else {
    resumeSessionTracking();
  }
}

// Update session timing for more responsive prompts with dialog detection
async function updateInstallSessionTiming(data) {
  if (!sessionTracker || !isSessionInitialized) {
    return;
  }

  // Handle dialog state changes
  if (data.hasOpenDialogs) {
    pauseSessionTracking();
  } else {
    resumeSessionTracking();
  }
}

// Handle page visibility changes
async function handlePageVisibilityChange(isVisible) {
  if (!sessionTracker || sessionTracker.hasShownPrompt) {
    return;
  }

  if (isVisible) {
    // Page became visible, resume tracking
    sessionTracker.isActive = true;
    sessionTracker.lastUpdate = Date.now();

    // Check if we should show prompt immediately
    if (sessionTracker.totalTime >= INSTALL_PROMPT_DELAY) {
      await triggerInstallPrompt(sessionTracker.isSafari);
    } else {
      startSessionTimer();
    }
  } else {
    // Page became hidden, pause tracking
    sessionTracker.isActive = false;
    if (sessionInterval) {
      clearInterval(sessionInterval);
      sessionInterval = null;
    }
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
              purpose: "maskable",
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
        body {
          font-family: 'Geist Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
        }
        
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
    // Handle app installation
    clearInstallSession();

    // Save pending notification for after installation
    setPendingInstallNotification({
      timestamp: Date.now(),
      type: "install-thank-you",
    });

    console.log("[Service Worker] App installed - saved pending notification");

    // Trigger notification check immediately for faster delivery
    setTimeout(() => {
      checkPendingInstallNotification();
    }, 1000);
  } else if (data === "CHECK_CACHE") {
    checkAndRefreshCache();
  } else if (data === "START_CACHE_CHECK") {
    startCacheCheckInterval();
  } else if (data && data.type === "UPDATE_INSTALL_SESSION") {
    // Update install session timing
    updateInstallSessionTiming(data.data);
  } else if (data && data.type === "PAGE_VISIBILITY_CHANGE") {
    // Handle page visibility changes
    handlePageVisibilityChange(data.isVisible);
  } else if (data && data.type === "GET_FCM_TOKEN") {
    // Handle FCM token request from service worker
    const port = ports[0];
    if (port) {
      // We can't get FCM token from service worker, respond with null
      port.postMessage({ token: null });
    }
  } else if (data && data.type === "TOAST_DISMISSED") {
    // Reset toast state when dismissed
    setNotificationState({
      isShowing: false,
      lastShown: Date.now(),
      showCount: toastState.showCount,
    });
  }
});

// Enhanced notification click handler with better action support
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Get the action and notification data
  const action = event.action;
  const data = event.notification.data || {};

  console.log("Notification clicked with action:", action, "and data:", data);

  let url = "/";

  // Handle different actions
  if (action === "support") {
    url = "/kofi";
  } else if (action === "explore") {
    url = "/";
  } else if (event.notification.tag === "install-thank-you" && !action) {
    // Default action for thank you notification if no specific action
    url = "/kofi";
  } else if (data.url) {
    url = data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Try to focus existing window and navigate to the URL
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus().then(() => {
            if ("navigate" in client) {
              return client.navigate(url);
            }
          });
          return;
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

// Initialize notification state on startup
getNotificationState().then((state) => {
  toastState = state;
});

// Check and send pending install notification
async function checkPendingInstallNotification() {
  const pendingNotification = await getPendingInstallNotification();
  if (pendingNotification) {
    console.log("[Service Worker] Found pending install notification, sending now...");

    // Send notification immediately
    await sendInstallThankYouNotification(pendingNotification);
    await clearPendingInstallNotification();
  }
}

// Declare functions that were previously undeclared
async function triggerInstallPrompt(isSafari) {
  // Implementation for triggerInstallPrompt
  console.log("Triggering install prompt for Safari:", isSafari);
}

async function setPendingInstallNotification(notification) {
  // Implementation for setPendingInstallNotification
  console.log("Setting pending install notification:", notification);
}

async function getPendingInstallNotification() {
  // Implementation for getPendingInstallNotification
  console.log("Getting pending install notification");
  return null;
}

async function sendInstallThankYouNotification(notification) {
  // Implementation for sendInstallThankYouNotification
  console.log("Sending install thank you notification:", notification);
}

async function clearPendingInstallNotification() {
  // Implementation for clearPendingInstallNotification
  console.log("Clearing pending install notification");
}

async function getNotificationState() {
  // Implementation for getNotificationState
  console.log("Getting notification state");
  return { isShowing: false, lastShown: 0, showCount: 0 };
}

async function setNotificationState(state) {
  // Implementation for setNotificationState
  console.log("Setting notification state:", state);
}
