// Cache names with versioning
const CACHE_NAMES = {
  STATIC: "static-cache-v1",
  FONTS: "fonts-cache-v1",
  PAGES: "pages-cache-v1",
  OFFLINE: "offline-cache-v1",
};

// Resources to cache
const OFFLINE_PAGE = "/fallback/offline.html";

// Cache duration in milliseconds (365 days)
const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000;
// Check interval in milliseconds (5 minutes)
const CHECK_INTERVAL = 5 * 60 * 1000;

// Install event - cache critical assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker...");

  event.waitUntil(
    caches
      .open(CACHE_NAMES.OFFLINE)
      .then((cache) => {
        console.log("[Service Worker] Caching offline page");
        return cache.add(OFFLINE_PAGE);
      })
      .then(() => {
        console.log("[Service Worker] Installation complete");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[Service Worker] Installation failed:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete caches that aren't in our defined CACHE_NAMES
            if (!Object.values(CACHE_NAMES).includes(cacheName)) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        console.log("[Service Worker] Activation complete");
        return self.clients.claim();
      })
      .catch((error) => {
        console.error("[Service Worker] Activation failed:", error);
      })
  );
});

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

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try to fetch from network first
    const response = await fetch(request);
    return response;
  } catch (error) {
    // If network fails (offline), serve the offline page
    console.log("[Service Worker] Network failed, serving offline page");

    try {
      const offlineResponse = await caches.match(OFFLINE_PAGE);
      if (offlineResponse) {
        return processOfflinePage(offlineResponse);
      }
    } catch (cacheError) {
      console.error("[Service Worker] Error serving offline page:", cacheError);
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
        console.log("[Service Worker] Font cached:", request.url);
      } catch (cacheError) {
        console.log(
          "[Service Worker] Could not cache font (this is normal for no-cors requests):",
          request.url
        );
      }
    }

    return response;
  } catch (error) {
    console.log("[Service Worker] Font request failed, checking cache:", request.url);

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

    // For font files, let the browser handle the fallback
    throw error;
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
        console.log("[Service Worker] Could not cache asset:", request.url);
      }
    }

    return response;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
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
    console.error("[Service Worker] Error processing offline page:", error);
    return response;
  }
}

// Periodic cache check and maintenance
async function checkAndRefreshCache() {
  try {
    console.log("[Service Worker] Checking cache status...");

    // Check if offline page is cached
    const offlineCache = await caches.open(CACHE_NAMES.OFFLINE);
    const offlinePageCached = await offlineCache.match(OFFLINE_PAGE);

    if (!offlinePageCached) {
      console.log("[Service Worker] Offline page not found in cache, re-caching...");
      try {
        await offlineCache.add(OFFLINE_PAGE);
        console.log("[Service Worker] Offline page re-cached successfully");
      } catch (error) {
        console.log("[Service Worker] Could not re-cache offline page:", error.message);
      }
    }

    // Clean up expired caches
    await cleanupExpiredCaches();

    console.log("[Service Worker] Cache check complete");
  } catch (error) {
    console.error("[Service Worker] Error during cache check:", error);
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
                console.log(`[Service Worker] Removing expired cache for: ${request.url}`);
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
    console.log("[Service Worker] Error during cache cleanup:", error.message);
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
  if (event.data === "CHECK_CACHE") {
    checkAndRefreshCache();
  } else if (event.data === "START_CACHE_CHECK") {
    startCacheCheckInterval();
  }
});

// Start cache checking when the service worker becomes active
self.addEventListener("activate", () => {
  startCacheCheckInterval();
});

// Run initial cache check
checkAndRefreshCache();
