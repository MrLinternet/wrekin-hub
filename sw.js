// Wrekin College E-Learning Hub — Service Worker
// Fixed for GitHub Pages subfolder: /wrekin-hub/

const CACHE_NAME = 'wrekin-hub-v2';
const BASE = '/wrekin-hub';

const PRECACHE = [
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/icon-192.png',
  BASE + '/icon-512.png',
  BASE + '/media/logo.png',
  BASE + '/media/Computing.jpg',
  BASE + '/media/EAL.jpg',
  BASE + '/media/epq.jpg',
  BASE + '/media/geography.png',
  BASE + '/media/Library.jpg',
  BASE + '/media/Mathematics.jpg',
  BASE + '/media/Music.jpg',
  BASE + '/media/science.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (
    url.pathname === BASE + '/' ||
    url.pathname === BASE + '/index.html' ||
    url.pathname === BASE
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(BASE + '/index.html'))
    );
    return;
  }

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
