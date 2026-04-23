// Wrekin College E-Learning Hub — Service Worker
// Strategy: Network-first for HTML (so updates are instant),
//           Cache-first for assets (images, fonts) for speed.

const CACHE_NAME = 'wrekin-hub-v1';

const PRECACHE = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'media/logo.png',
  'media/Computing.jpg',
  'media/EAL.jpg',
  'media/epq.jpg',
  'media/geography.png',
  'media/Library.jpg',
  'media/Mathematics.jpg',
  'media/Music.jpg',
  'media/science.jpg'
];

// Install: pre-cache all local assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: delete any old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // For external links (Google, GCSEPod etc.) — just pass through, no caching
  if (url.origin !== self.location.origin) {
    return;
  }

  // For index.html — network first, fall back to cache
  // This means ANY update you make to index.html goes live immediately on next open
  if (url.pathname === '/' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For local assets (images etc.) — cache first for speed
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
