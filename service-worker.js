const CACHE_NAME = "urbanleap-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/game.js",
  "/icon-192.png",
  "/icon-512.png",
  "/screenshot1.png",
  "/512.png",
  "/R.png",
  "/manifest.json"
];

// Install event: cache all files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve cached files, fallback to network, fallback to offline page
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then((response) => response || fetch(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Periodic Sync (example, requires registration in main JS)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "urbanleap-sync") {
    event.waitUntil(
      // Example: fetch updates or sync data
      fetch("/api/sync")
    );
  }
});

// Background Sync (example, requires registration in main JS)
self.addEventListener("sync", (event) => {
  if (event.tag === "urbanleap-bg-sync") {
    event.waitUntil(
      // Example: send queued requests
      fetch("/api/bg-sync")
    );
  }
});

// Push Notifications (example)
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Urban Leap Notification";
  const options = {
    body: data.body || "You have a new notification.",
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
