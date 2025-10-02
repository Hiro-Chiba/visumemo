const STATIC_CACHE = 'visumemo-static-v1';
const RUNTIME_CACHE = 'visumemo-runtime-v1';
const IMAGE_CACHE = 'visumemo-images-v1';
const OFFLINE_URL = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll([OFFLINE_URL, '/manifest.webmanifest']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => ![STATIC_CACHE, RUNTIME_CACHE, IMAGE_CACHE].includes(key)).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached ? Promise.resolve(cached) : fetchPromise;
};

const networkFirst = async (request, { fallbackUrl } = {}) => {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    if (fallbackUrl) {
      const fallbackCache = await caches.open(STATIC_CACHE);
      const offlineResponse = await fallbackCache.match(fallbackUrl);
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    throw error;
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, { fallbackUrl: OFFLINE_URL }));
    return;
  }

  if (url.pathname.startsWith('/api/notes')) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.pathname.startsWith('/api/blob')) {
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});
