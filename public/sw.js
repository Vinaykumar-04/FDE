const CACHE = 'fde-hero-academy-v2';
const PRECACHE = [
  '/', '/map/', '/review/', '/profile/', '/interview/', '/manifest.webmanifest', '/icon.svg',
  '/level/L0-recruit/',
  '/lesson/what-an-fde-does/', '/lesson/fde-career-paths/', '/lesson/terminal-basics/',
  '/lesson/git-and-python/', '/lesson/http-and-status-codes/', '/lesson/json-and-integrations/',
  '/play/status-code-match/', '/play/terminal-quest/', '/play/json-debugger/', '/boss/integration-script/'
];
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(PRECACHE.map(async (path) => {
      try {
        const response = await fetch(path);
        if (!response.ok) return;
        await cache.put(path, response.clone());
        const html = await response.text();
        const assets = [...html.matchAll(/(?:src|href)="(\/_next\/(?:static|image)\/[^"?#]+)"/g)].map((match) => match[1]);
        await Promise.all(assets.map(async (asset) => {
          try { const file = await fetch(asset); if (file.ok) await cache.put(asset, file); } catch { /* keep installing other pages */ }
        }));
      } catch { /* keep installing other pages */ }
    }));
  })());
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(request, copy)); }
    return response;
  }).catch(() => caches.match('/'))));
});
