const CACHE_NAME = 'naveen-academy-v2';
const urlsToCache = ['/', '/login', '/student-corner', '/parent-corner', '/notices', '/contact', '/gallery'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// ✅ यही वो जगह है जहाँ पुश मैसेज मिलने पर नोटिफिकेशन बनता है
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/images/logo.png',
    badge: data.badge || '/images/logo.png',
    data: { url: data.data?.url || '/student-corner' },
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ✅ नोटिफिकेशन पर क्लिक करने पर URL खुलता है
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/student-corner';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});