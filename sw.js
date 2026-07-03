// === SERVICE WORKER v5 ===
const CACHE_NAME = 'sponsor-crm-cache-v5';
const urlsToCache = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/js/theme.js',
  './assets/js/state.js',
  './assets/js/firebase-init.js',
  './assets/js/utils.js',
  './assets/js/calculations.js',
  './assets/js/core.js',
  './assets/js/auth.js',
  './assets/js/data-service.js',
  './assets/js/ui-render.js',
  './assets/js/ui-handlers.js',
  './assets/js/client-space.js',
  './assets/js/meta-live.js',
  './assets/js/app.js',
  './assets/js/demo.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache).catch(() => {}))
  );
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
  // Ne pas intercepter les requêtes Firebase ou CDN
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis') || event.request.url.includes('cdn')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
