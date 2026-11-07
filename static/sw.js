const CACHE_NAME = 'pwa-clock-v1';
const PRECACHE = [
  './',
  'index.html',
  'manifest.json',
  'favicon.ico',
  'css/style.css',
  'js/main.js',
  'fonts/ShareTechMono-Regular.ttf',
  'images/anim-bw.gif',
  'images/icon-180.png',
  'images/icon-192.png',
  'images/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

/* Drop caches left by earlier versions, including the old 'hello-pwa' one */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

/* Answer from the cache so the clock works offline, and refresh the cache in
   the background so deployed changes show up on the next launch */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    const refresh = fetch(request).then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    });

    if (cached) {
      event.waitUntil(refresh.catch(() => {}));
      return cached;
    }
    return refresh;
  })());
});
