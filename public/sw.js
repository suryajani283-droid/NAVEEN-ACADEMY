const CACHE_NAME = 'naveen-v3'; // ⬅️ change version every time you deploy important changes

// These URLs will be pre‑cached on install
const PRE_CACHE_URLS = [
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
];

// Install event – pre‑cache and skip waiting so the new SW takes over immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRE_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event – clean old caches and take control of all open pages
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
  // Notify all open pages to reload
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => client.postMessage({ type: 'UPDATE' }));
  });
});

// Fetch strategy – network first for navigation, cache first for static assets
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // For page navigation: try network, fallback to cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the fresh page in the background
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // For images, CSS, JS, etc.: cache first, fallback to network
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request))
    );
  }
});

// Push notification handler (unchanged from before)
self.addEventListener('push', function (event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Naveen Academy', body: event.data.text() };
    }
  }
  const options = {
    body: data.body || 'No message body',
    icon: data.icon || '/images/logo.png',
    badge: data.badge || '/images/logo.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Naveen Academy', options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});