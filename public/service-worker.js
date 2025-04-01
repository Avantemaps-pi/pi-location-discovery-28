
// Service Worker for Avante Maps

const CACHE_NAME = 'avante-maps-cache-v1';
const OFFLINE_URL = '/offline.html';

// Install event - precache essential resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/favicon.ico',
          '/static/js/main.chunk.js',
          '/static/js/vendors~main.chunk.js',
          '/static/js/bundle.js',
          '/lovable-uploads/b0daa374-9909-4cf8-a2ae-e08e2184c3fc.png',
          '/lovable-uploads/816179f9-d16d-46a7-9d6e-169846c0d0da.png'
        ]);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
    .then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle offline navigation
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              return cache.match(OFFLINE_URL);
            });
        })
    );
  } else {
    // Standard cache-first strategy for non-navigation requests
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Save important resources in cache
              if (event.request.url.includes('/static/') || 
                  event.request.url.includes('/assets/')) {
                return caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                });
              }
              return fetchResponse;
            });
        })
        .catch((error) => {
          console.log('[Service Worker] Fetch failed:', error);
          // You can add specific fallbacks for certain resources here
        })
    );
  }
});

// Handle offline page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
