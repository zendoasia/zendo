// Service Worker for PWA with offline support and push notifications

self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icons/maskable-icon.png",
      badge: "/icons/maskable-icon.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("https://zendo.pages.dev"));
});

const CACHE_NAME = "zendo-pwa-cache-v5";
const OFFLINE_RICH_URL = "/fallback/offline.html";
const OFFLINE_RAW_URL = "/fallback/offline/offline.html";
const ASSETS = ["/assets/LogoWhite.svg", "/assets/LogoBlack.svg", "/assets/lonelyGhost.svg"];
const GOOGLE_FONTS_CSS = [
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap",
];

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

// Simplified cache checking - just check if it exists
async function isCached(cache, url) {
  try {
    const cached = await cache.match(url);
    return !!cached;
  } catch (error) {
    console.error("Error checking cache:", error);
    return false;
  }
}

// Helper function to safely cache a response
async function safeCache(cache, request, response) {
  try {
    if (response && response.status === 200 && response.body) {
      await cache.put(request, response);
      console.log("Successfully cached:", typeof request === "string" ? request : request.url);
      return true;
    }
  } catch (error) {
    console.error(
      "Failed to cache resource:",
      typeof request === "string" ? request : request.url,
      error
    );
  }
  return false;
}

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);

        // Cache basic assets
        console.log("Caching basic assets...");
        for (const asset of ASSETS) {
          try {
            if (!(await isCached(cache, asset))) {
              const response = await fetch(asset);
              if (response.ok) {
                await safeCache(cache, asset, response.clone());
              }
            } else {
              console.log("Asset already cached:", asset);
            }
          } catch (error) {
            console.error("Failed to cache asset:", asset, error);
          }
        }

        // Cache offline pages
        console.log("Caching offline pages...");
        for (const offlineUrl of [OFFLINE_RICH_URL, OFFLINE_RAW_URL]) {
          try {
            if (!(await isCached(cache, offlineUrl))) {
              const response = await fetch(offlineUrl);
              if (response.ok) {
                await safeCache(cache, offlineUrl, response.clone());
                console.log("Cached offline page:", offlineUrl);
              } else {
                console.warn("Offline page not found:", offlineUrl, response.status);
              }
            } else {
              console.log("Offline page already cached:", offlineUrl);
            }
          } catch (error) {
            console.warn("Could not cache offline page:", offlineUrl, error);
          }
        }

        // Cache Google Fonts CSS and extract font files
        console.log("Caching Google Fonts...");
        for (const cssUrl of GOOGLE_FONTS_CSS) {
          try {
            if (!(await isCached(cache, cssUrl))) {
              console.log("Fetching Google Fonts CSS:", cssUrl);
              const response = await fetch(cssUrl);
              if (response.ok) {
                const cssText = await response.text();
                console.log("CSS content preview:", cssText.substring(0, 200) + "...");

                // Cache the CSS file
                const cssResponse = new Response(cssText, {
                  headers: { "Content-Type": "text/css" },
                });
                await safeCache(cache, cssUrl, cssResponse);

                // Extract font URLs - try multiple patterns
                let fontUrls = [];

                // Pattern 1: url(https://fonts.gstatic.com/...)
                const pattern1 = cssText.matchAll(/url$$(https:\/\/fonts\.gstatic\.com\/[^)]+)$$/g);
                fontUrls.push(...Array.from(pattern1, (m) => m[1]));

                // Pattern 2: url("https://fonts.gstatic.com/...")
                const pattern2 = cssText.matchAll(
                  /url$$"(https:\/\/fonts\.gstatic\.com\/[^"]+)"$$/g
                );
                fontUrls.push(...Array.from(pattern2, (m) => m[1]));

                // Pattern 3: url('https://fonts.gstatic.com/...')
                const pattern3 = cssText.matchAll(
                  /url$$'(https:\/\/fonts\.gstatic\.com\/[^']+)'$$/g
                );
                fontUrls.push(...Array.from(pattern3, (m) => m[1]));

                // Remove duplicates
                fontUrls = [...new Set(fontUrls)];

                console.log(`Found ${fontUrls.length} font files for ${cssUrl}:`, fontUrls);

                // Cache each font file
                for (const fontUrl of fontUrls) {
                  try {
                    if (!(await isCached(cache, fontUrl))) {
                      console.log("Fetching font:", fontUrl);
                      const fontResponse = await fetch(fontUrl, {
                        mode: "cors",
                        credentials: "omit",
                      });
                      if (fontResponse.ok) {
                        await safeCache(cache, fontUrl, fontResponse.clone());
                        console.log("Successfully cached font:", fontUrl);
                      } else {
                        console.error("Failed to fetch font:", fontUrl, fontResponse.status);
                      }
                    } else {
                      console.log("Font already cached:", fontUrl);
                    }
                  } catch (fontError) {
                    console.error("Error caching font:", fontUrl, fontError);
                  }
                }
              } else {
                console.error("Failed to fetch CSS:", cssUrl, response.status);
              }
            } else {
              console.log("Google Fonts CSS already cached:", cssUrl);
            }
          } catch (error) {
            console.error("Error caching Google Fonts CSS:", cssUrl, error);
          }
        }

        console.log("Service Worker installation completed");
      } catch (error) {
        console.error("Service Worker installation failed:", error);
      }
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("Deleting old cache:", name);
            return caches.delete(name);
          })
      );

      console.log("Service Worker activated and claiming clients");
    })()
  );

  // Take control of all clients immediately
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") return;

  console.log("SW intercepting:", request.url);

  // Handle Google Fonts CSS
  if (url.hostname === "fonts.googleapis.com") {
    event.respondWith(handleGoogleFonts(request));
    return;
  }

  // Handle Google Fonts static files
  if (url.hostname === "fonts.gstatic.com") {
    event.respondWith(handleGoogleFontsStatic(request));
    return;
  }

  // Handle local assets
  if (url.pathname.includes("/assets/")) {
    event.respondWith(handleAssets(request));
    return;
  }

  // Handle navigation requests (HTML pages)
  if (
    request.mode === "navigate" ||
    (request.method === "GET" && request.headers.get("accept")?.includes("text/html"))
  ) {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Handle all other requests with basic caching
  event.respondWith(handleOtherRequests(request));
});

async function handleGoogleFonts(request) {
  console.log("Handling Google Fonts CSS:", request.url);
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      console.log("Serving cached Google Fonts CSS:", request.url);
      return cached;
    }

    console.log("Fetching Google Fonts CSS from network:", request.url);
    const response = await fetch(request);
    if (response.ok) {
      await safeCache(cache, request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("Error handling Google Fonts CSS:", error);
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    return cached || new Response("Font CSS unavailable", { status: 503 });
  }
}

async function handleGoogleFontsStatic(request) {
  console.log("Handling Google Fonts static file:", request.url);
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      console.log("Serving cached font file:", request.url);
      return cached;
    }

    console.log("Fetching font file from network:", request.url);
    const response = await fetch(request, {
      mode: "cors",
      credentials: "omit",
    });
    if (response.ok) {
      await safeCache(cache, request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("Error handling Google Fonts static file:", error);
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    return cached || new Response("Font unavailable", { status: 503 });
  }
}

async function handleAssets(request) {
  console.log("Handling asset:", request.url);
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      await safeCache(cache, request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("Error handling asset:", error);
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request);
  }
}

async function handleNavigation(request) {
  console.log("Handling navigation request:", request.url);
  try {
    const response = await fetch(request, {
      cache: "no-cache",
    });

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await safeCache(cache, request, response.clone());
      console.log("Successfully fetched and cached page:", request.url);
      return response;
    }

    return response;
  } catch (error) {
    console.log("Network error for navigation, serving offline page:", error.message);
    return await serveOfflinePage();
  }
}

async function handleOtherRequests(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await safeCache(cache, request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) {
      console.log("Serving from cache:", request.url);
      return cached;
    }
    throw error;
  }
}

async function serveOfflinePage() {
  console.log("Serving offline page...");
  try {
    const cache = await caches.open(CACHE_NAME);

    // Try rich offline page first
    const rich = await cache.match(OFFLINE_RICH_URL);
    if (rich) {
      console.log("Serving rich offline page");
      return rich;
    }

    // Try raw offline page
    const raw = await cache.match(OFFLINE_RAW_URL);
    if (raw) {
      console.log("Serving raw offline page");
      return raw;
    }

    // Serve minimal fallback
    console.log("Serving minimal offline fallback");
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Zendo</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 2rem;
            background: #f5f5f5;
            color: #333;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .container {
            max-width: 400px;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #e74c3c; margin-bottom: 1rem; }
          p { line-height: 1.6; margin-bottom: 1rem; }
          .retry-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }
          .retry-btn:hover { background: #2980b9; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>You're Offline</h1>
          <p>It looks like you're not connected to the internet. Please check your connection and try again.</p>
          <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error serving offline page:", error);
    return new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
