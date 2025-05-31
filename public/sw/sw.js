self.addEventListener("push", function (event) {
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

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("<https://zendo.pages.dev>"));
});

const CACHE_NAME = "zendo-pwa-cache-v2";
const OFFLINE_RICH_URL = "/fallback/offline.html"; // Tailwind, Google Fonts
const OFFLINE_RAW_URL = "/fallback/offline/offline.html"; // Raw HTML, local fonts only
const ASSETS = [
  OFFLINE_RICH_URL,
  OFFLINE_RAW_URL,
  "/assets/Logo.svg",
  "/assets/LogoDark.svg",
  "/assets/lonelyGhost.svg",
];
const GOOGLE_FONTS_CSS = [
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap",
];

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([...ASSETS, ...GOOGLE_FONTS_CSS]);
      for (const cssUrl of GOOGLE_FONTS_CSS) {
        try {
          const response = await fetch(cssUrl);
          if (response.ok) {
            const cssText = await response.text();
            const fontUrls = Array.from(
              cssText.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g),
              (m) => m[1]
            );
            for (const fontUrl of fontUrls) {
              try {
                const fontResp = await fetch(fontUrl);
                if (fontResp.ok) {
                  await cache.put(fontUrl, fontResp.clone());
                }
              } catch (e) {
                console.error("Error fetching font:", fontUrl, e);
              }
            }
          }
        } catch (e) {
          console.error("Error fetching Google Fonts CSS:", cssUrl, e);
        }
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (
    request.url.startsWith("https://fonts.googleapis.com/css2?family=Geist") ||
    request.url.startsWith("https://fonts.googleapis.com/css2?family=Space+Grotesk")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request)
            .then((response) => {
              if (response.status === 200) cache.put(request, response.clone());
              return response;
            })
            .catch(() => undefined);
        })
      )
    );
    return;
  }

  if (request.url.startsWith("https://fonts.gstatic.com/s/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request)
            .then((response) => {
              if (response.status === 200) cache.put(request, response.clone());
              return response;
            })
            .catch(() => undefined);
        })
      )
    );
    return;
  }

  if (request.url.includes("/assets/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request)
            .then((response) => {
              if (response.status === 200) cache.put(request, response.clone());
              return response;
            })
            .catch(() => undefined);
        })
      )
    );
    return;
  }

  // Navigation: serve rich offline.html if cached, else raw offline/offline.html, else minimal fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const rich = await cache.match(OFFLINE_RICH_URL);
          if (rich) return rich;
          const raw = await cache.match(OFFLINE_RAW_URL);
          if (raw) return raw;
          // Log error for debugging
          console.error("Both offline pages missing from cache. Serving minimal fallback.");
          return new Response(
            "<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>No offline page available.</p></body></html>",
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_RICH_URL)))
  );
});
