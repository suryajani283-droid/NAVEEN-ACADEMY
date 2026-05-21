const CACHE_NAME = 'naveen-academy-v1';
const urlsToCache = [
  '/',
  '/login',
  '/student-corner',
  '/parent-corner',
  '/notices',
  '/contact',
  '/gallery',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});