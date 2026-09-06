const CACHE_NAME = 'gorkhon-online-v1.4';
const APP_ICON = 'https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/49a4926a-8d83-465d-ba36-1bb75c363f14.png';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(() => undefined)
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        }).catch(() => undefined);
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Фоновые push-уведомления (приходят даже когда вкладка закрыта)
self.addEventListener('push', (event) => {
  let payload = {
    title: 'Горхон.Online',
    body: 'Есть новое обновление',
    tag: 'gorkhon-push',
    url: '/'
  };

  if (event.data) {
    try {
      payload = Object.assign(payload, event.data.json());
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: APP_ICON,
      badge: APP_ICON,
      tag: payload.tag,
      renotify: true,
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: { url: payload.url }
    })
  );
});

// Клик по уведомлению — открываем нужную страницу
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl).catch(() => undefined);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  // Показ уведомления из приложения через SW — работает в фоне
  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, url } = event.data;
    self.registration.showNotification(title || 'Горхон.Online', {
      body: body || '',
      icon: APP_ICON,
      badge: APP_ICON,
      tag: tag || 'gorkhon-push',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: url || '/' }
    });
  }
});