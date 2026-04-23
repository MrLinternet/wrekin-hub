// Wrekin College E-Learning Hub — Service Worker
// Minimal version: always fetch from network, no caching complexity

const CACHE_NAME = 'wrekin-hub-v3';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Clear ALL old caches
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Always go to network — no caching
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch('/wrekin-hub/index.html')
    );
    return;
  }
  event.respondWith(fetch(event.request));
});
