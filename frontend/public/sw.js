// ISHU TOOLS Service Worker v8 — KILL SWITCH
// Previous SW (v6/v7) was caching the HTML shell from "/" and serving stale
// pages to returning users. This version unregisters itself, deletes every
// cache it ever created, then force-reloads any open tabs so they pick up
// the latest build immediately.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
    } catch (e) { /* ignore */ }
    try {
      await self.registration.unregister();
    } catch (e) { /* ignore */ }
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => {
        try { client.navigate(client.url); } catch (e) { /* ignore */ }
      });
    } catch (e) { /* ignore */ }
  })());
});

// Pass-through fetch — never serve from cache.
self.addEventListener('fetch', () => { /* noop */ });
