/* 离线缓存：应用外壳（app shell）优先，保证断网也能打开。 */
const CACHE = 'fitcut-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './styles.css',
  './app.js',
  './store.js',
  './nutrition.js',
  './views.js',
  './ingredients.js',
  './dishes.js',
  './exercises.js',
  './templates.js',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map((u) => cache.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    if (hit) {
      // 命中缓存后后台静默更新，下次打开即为新版。
      e.waitUntil(fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
      }).catch(() => {}));
      return hit;
    }
    try {
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      if (req.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});
