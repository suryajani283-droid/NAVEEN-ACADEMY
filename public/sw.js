self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('naveen-v1').then(function (cache) {
      return cache.addAll([
        '/',
        '/about',
        '/academics',
        '/faculty',
        '/gallery',
        '/notices',
        '/contact',
        '/admissions',
        '/manifest.json',
        '/images/logo.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});