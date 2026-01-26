const CACHE_NAME = 'gorkhon-online-v8';
const RUNTIME_CACHE = 'gorkhon-runtime-v8';
const APP_VERSION = '3.8.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/files/e098ebda-8db5-4ceb-a0e8-4bf14bdc9cde.jpg',
  'https://cdn.poehali.dev/files/538a3c94-c9c4-4488-9214-dc9493fadb43.png',
  'https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.matchAll({ type: 'window' });
    }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'VERSION_UPDATE',
          version: APP_VERSION
        });
      });
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.startsWith('/src/') || url.pathname.endsWith('.tsx') || url.pathname.endsWith('.ts')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const shouldCache = 
            url.origin === location.origin ||
            url.hostname.includes('cdn.poehali.dev') ||
            url.hostname.includes('fonts.googleapis.com') ||
            url.hostname.includes('fonts.gstatic.com');

          if (shouldCache) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
          
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#e0e0e0" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="#666">Офлайн</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }

          return new Response('Офлайн режим', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'Новое уведомление';
  const options = {
    body: data.body || '',
    icon: data.icon || 'https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/a1a580c6-2f15-4ed8-91d1-d06df7cf1647.png',
    badge: 'https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/a1a580c6-2f15-4ed8-91d1-d06df7cf1647.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
    silent: false,
    sound: '/notification.mp3',
    actions: data.actions || [],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: 1,
      ...data
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});