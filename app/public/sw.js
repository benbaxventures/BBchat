// BBchat service worker (BB-08): lets the app open without signal and be installed on phones.
// - Pages: network first, so users always get the latest version when online; cached copy when offline.
// - Built files in /assets/ (JS, CSS, fonts, images) have content hashes in their names, so they are cached.
// Bump CACHE when this file's logic changes; old caches are deleted on activate.

const CACHE = "bbchat-v2";
const SHELL = ["/", "/manifest.webmanifest", "/favicon.ico", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(SHELL);
      // Also cache the JS/CSS the current page needs (their hashed names are in index.html).
      const html = await (await fetch("/", { cache: "no-store" })).text();
      const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
      await cache.addAll(assets);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("/", copy));
          return res;
        })
        .catch(async () => (await caches.match("/")) || Response.error()),
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      // hashed assets never change: cache first; everything else: cached copy now, refresh in background
      return cached || network;
    })(),
  );
});
